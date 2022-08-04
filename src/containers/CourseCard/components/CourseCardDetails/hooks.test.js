import { useIntl } from '@edx/frontend-platform/i18n';

import { keyStore, dateFormatter } from 'utils';
import { hooks as appHooks } from 'data/redux';

import * as hooks from './hooks';
import messages from './messages';

jest.mock('data/redux', () => ({
  hooks: {
    useCardCourseRunData: jest.fn(),
    useCardEnrollmentData: jest.fn(),
    useCardEntitlementsData: jest.fn(),
    useCardProviderData: jest.fn(),
  },
}));
jest.mock('containers/SelectSession/hooks', () => () => ({
  openSessionModalWithLeaveOption: jest.fn().mockName('useSelectSession.openSessionModalWithLeaveOptionFunction'),
}));

const courseNumber = 'my-test-course-number';
const useAccessMessage = 'test-access-message';
const mockAccessMessage = (args) => ({ courseNumber: args.coursenumber, useAccessMessage });
const hookKeys = keyStore(hooks);

describe('CourseCard hooks', () => {
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
      appHooks.useCardEntitlementsData.mockReturnValueOnce({
        ...entitlementData,
        ...entitlement,
      });
      out = hooks.useCardDetailsData({ courseNumber });
    };
    beforeEach(() => {
      runHook({});
    });
    it('forwards formatMessage from useIntl', () => {
      expect(out.formatMessage).toEqual(formatMessage);
    });
    it('forwards useAccessMessage output, called with courseNumber', () => {
      expect(out.accessMessage).toEqual(mockAccessMessage({ courseNumber }));
    });
    it('forwards provider name if it exists, else formatted unknown provider name', () => {
      expect(out.providerName).toEqual(providerData.name);
      runHook({ provider: { name: '' } });
      expect(out.providerName).toEqual(formatMessage(messages.unknownProviderName));
    });
  });
  describe('useAccessMessage', () => {
    const enrollmentData = {
      accessExpirationDate: 'test-expiration-date',
      isAudit: false,
      isAuditAccessExpired: false,
    };
    const courseRunData = {
      isFinished: false,
      endDate: 'test-end-date',
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
      out = hooks.useAccessMessage({ courseNumber });
    };
    it('loads data from enrollment and course run data based on course number', () => {
      runHook({});
      expect(appHooks.useCardCourseRunData).toHaveBeenCalledWith(courseNumber);
      expect(appHooks.useCardEnrollmentData).toHaveBeenCalledWith(courseNumber);
    });
    describe('if audit, and expired', () => {
      it('returns accessExpired message with accessExpirationDate from cardData', () => {
        runHook({ enrollment: { isAudit: true, isAuditAccessExpired: true } });
        expect(out).toEqual(formatMessage(
          messages.accessExpired,
          { accessExpirationDate: dateFormatter(formatDate, enrollmentData.accessExpirationDate) },
        ));
      });
    });

    describe('if audit and not expired', () => {
      it('returns accessExpires message with accessExpirationDate from cardData', () => {
        runHook({ enrollment: { isAudit: true } });
        expect(out).toEqual(formatMessage(
          messages.accessExpires,
          { accessExpirationDate: dateFormatter(formatDate, enrollmentData.accessExpirationDate) },
        ));
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
