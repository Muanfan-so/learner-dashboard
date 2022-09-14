/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { hooks as appHooks } from 'data/redux';
import Banner from 'components/Banner';
import messages from './messages';

export const CourseBanner = ({ cardId }) => {
  const {
    isVerified,
    isAuditAccessExpired,
    canUpgrade,
    coursewareAccess = {},
  } = appHooks.useCardEnrollmentData(cardId);
  const courseRun = appHooks.useCardCourseRunData(cardId);
  const course = appHooks.useCardCourseData(cardId);
  const { formatMessage } = useIntl();

  const {
    hasUnmetPrerequisites,
    isStaff,
    isTooEarly,
  } = coursewareAccess;

  if (isVerified) { return null; }

  if (isAuditAccessExpired) {
    if (canUpgrade) {
      return (
        <Banner>
          {formatMessage(messages.auditAccessExpired)}
          {'  '}
          {formatMessage(messages.upgradeToAccess)}
        </Banner>
      );
    }
    return (
      <Banner>
        {formatMessage(messages.auditAccessExpired)}
        {'  '}
        <Hyperlink destination="">{formatMessage(messages.findAnotherCourse)}</Hyperlink>
      </Banner>
    );
  }
  if (courseRun.isActive && !canUpgrade) {
    return (
      <Banner>
        {formatMessage(messages.upgradeDeadlinePassed)}
        {'  '}
        <Hyperlink destination={course.website || ''}>
          {formatMessage(messages.exploreCourseDetails)}
        </Hyperlink>
      </Banner>
    );
  }
  if (isTooEarly) {
    return (
      <Banner>
        {formatMessage(messages.courseHasNotStarted, { startDate: courseRun.startDate })}
      </Banner>
    );
  }
  if (hasUnmetPrerequisites) {
    return (
      <Banner>
        {formatMessage(messages.prerequisitesNotMet)}
      </Banner>
    );
  }
  if (isStaff) {
    return (
      <Banner>
        {formatMessage(messages.staffAccessOnly)}
      </Banner>
    );
  }
  return null;
};
CourseBanner.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseBanner;
