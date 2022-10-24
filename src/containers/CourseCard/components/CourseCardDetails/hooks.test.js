import { useIntl } from '@edx/frontend-platform/i18n';

import { keyStore, dateFormatter } from 'utils';
import { hooks as appHooks } from 'data/redux';

import * as hooks from './hooks';
import messages from './messages';

jest.mock('data/redux', () => ({
  hooks: {
    useCardCourseData: jest.fn(),
    useCardCourseRunData: jest.fn(),
    useCardEnrollmentData: jest.fn(),
    useCardEntitlementData: jest.fn(),
    useCardProviderData: jest.fn(),
    useUpdateSelectSessionModalCallback: (...args) => ({ updateSelectSessionModalCallback: args }),
  },
}));

const cardId = 'my-test-card-id';
const courseNumber = 'test-course-number';
const useAccessMessage = 'test-access-message';
const mockAccessMessage = (args) => ({ cardId: args.cardId, useAccessMessage });
const hookKeys = keyStore(hooks);

describe('CourseCardDetails hooks', () => {
  let out;
  const { formatMessage, formatDate } = useIntl();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCardDetailsData', () => {
    const providerData = {
      name: 'my-provider-name',
    };
    const entitlementData = {
      isEntitlement: false,
      canViewCourse: false,
      isFulfilled: false,
      isExpired: false,
      canChange: false,
      hasSessions: false,
    };
    const runHook = ({ provider = {}, entitlement = {} }) => {
      jest.spyOn(hooks, hookKeys.useAccessMessage)
        .mockImplementationOnce(mockAccessMessage);
      appHooks.useCardProviderData.mockReturnValueOnce({
        ...providerData,
        ...provider,
      });
      appHooks.useCardEntitlementData.mockReturnValueOnce({
        ...entitlementData,
        ...entitlement,
      });
      appHooks.useCardCourseData.mockReturnValueOnce({ courseNumber });
      out = hooks.useCardDetailsData({ cardId });
    };
    beforeEach(() => {
      runHook({});
    });
    it('forwards useAccessMessage output, called with cardId', () => {
      expect(out.accessMessage).toEqual(mockAccessMessage({ cardId }));
    });
    it('forwards provider name if it exists, else formatted unknown provider name', () => {
      expect(out.providerName).toEqual(providerData.name);
      runHook({ provider: { name: '' } });
      expect(out.providerName).toEqual(formatMessage(messages.unknownProviderName));
    });
    it('forward changeOrLeaveSessionMessage', () => {
      expect(out.changeOrLeaveSessionMessage).toEqual(formatMessage(messages.changeOrLeaveSessionButton));
    });
  });

  describe('useAccessMessage', () => {
    const enrollmentData = {
      isEnrolled: true,
      accessExpirationDate: 'test-expiration-date',
      isAudit: false,
      isAuditAccessExpired: false,
    };
    const courseRunData = {
      isStarted: true,
      isArchived: false,
      startDate: '10/10/1000',
      endDate: '10/20/2000',
    };
    const runHook = ({ enrollment = {}, courseRun = {} }) => {
      appHooks.useCardCourseRunData.mockReturnValueOnce({
        ...courseRunData,
        ...courseRun,
      });
      appHooks.useCardEnrollmentData.mockReturnValueOnce({
        ...enrollmentData,
        ...enrollment,
      });
      out = hooks.useAccessMessage({ cardId });
    };

    it('loads data from enrollment and course run data based on course number', () => {
      runHook({});
      expect(appHooks.useCardCourseRunData).toHaveBeenCalledWith(cardId);
      expect(appHooks.useCardEnrollmentData).toHaveBeenCalledWith(cardId);
    });

    describe('if not started yet', () => {
      it('returns accessExpired message with accessExpirationDate', () => {
        runHook({
          enrollment: { isAudit: true, isAuditAccessExpired: true },
          courseRun: { isStarted: false },
        });
        expect(out).toEqual(formatMessage(
          messages.courseStarts,
          { startDate: dateFormatter(formatDate, courseRunData.startDate) },
        ));
      });
    });

    describe('if started', () => {
      describe('is audit', () => {
        describe('expired', () => {
          it('returns accessExpired message with accessExpirationDate', () => {
            runHook({ enrollment: { isAudit: true, isAuditAccessExpired: true } });
            expect(out).toEqual(formatMessage(
              messages.accessExpired,
              { accessExpirationDate: dateFormatter(formatDate, enrollmentData.accessExpirationDate) },
            ));
          });
        });

        describe('not expired', () => {
          it('returns accessExpires message with accessExpirationDate', () => {
            runHook({ enrollment: { isAudit: true } });
            expect(out).toEqual(formatMessage(
              messages.accessExpires,
              { accessExpirationDate: dateFormatter(formatDate, enrollmentData.accessExpirationDate) },
            ));
          });
          it('no endDate and no accessExpirationDate, returns null', () => {
            runHook({ enrollment: { isAudit: true, accessExpirationDate: '' }, courseRun: { endDate: '' } });
            expect(out).toEqual(null);
          });
          it('no accessExpirationDate and is not archive, return courseEnds with endDate', () => {
            runHook({ enrollment: { isAudit: true, accessExpirationDate: '' } });
            expect(out).toEqual(formatMessage(
              messages.courseEnds,
              { endDate: dateFormatter(formatDate, courseRunData.endDate) },
            ));
          });
          it('no accessExpirationDate and is archived, return courseEnded with endDate', () => {
            runHook({ enrollment: { isAudit: true, accessExpirationDate: '' }, courseRun: { isArchived: true } });
            expect(out).toEqual(formatMessage(
              messages.courseEnded,
              { endDate: dateFormatter(formatDate, courseRunData.endDate) },
            ));
          });
        });
      });

      describe('if verified and not ended', () => {
        it('returns course ends message with course end date', () => {
          runHook({});
          expect(out).toEqual(formatMessage(
            messages.courseEnds,
            { endDate: dateFormatter(formatDate, courseRunData.endDate) },
          ));
        });
      });

      describe('if verified and ended', () => {
        it('returns course ended message with course end date', () => {
          runHook({ courseRun: { isArchived: true } });
          expect(out).toEqual(formatMessage(
            messages.courseEnded,
            { endDate: dateFormatter(formatDate, courseRunData.endDate) },
          ));
        });
      });
    });
  });
});
