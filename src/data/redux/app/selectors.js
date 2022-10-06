import { createSelector } from 'reselect';

import { StrictDict } from 'utils';
import { FilterKeys } from 'data/constants/app';
import urls from 'data/services/lms/urls';

import * as module from './selectors';

const { baseAppUrl, learningMfeUrl } = urls;

export const appSelector = (state) => state.app;

const mkSimpleSelector = (cb) => createSelector([module.appSelector], cb);

// top-level app data selectors
export const simpleSelectors = {
  courseData: mkSimpleSelector(app => app.courseData),
  platformSettings: mkSimpleSelector(app => app.platformSettings),
  suggestedCourses: mkSimpleSelector(app => app.suggestedCourses),
  emailConfirmation: mkSimpleSelector(app => app.emailConfirmation),
  enterpriseDashboard: mkSimpleSelector(app => app.enterpriseDashboard),
  selectSessionModal: mkSimpleSelector(app => app.selectSessionModal),
  pageNumber: mkSimpleSelector(app => app.pageNumber),
};

export const numCourses = createSelector(
  [module.simpleSelectors.courseData],
  (courseData) => Object.keys(courseData).length,
);
export const hasCourses = createSelector([module.numCourses], (num) => num > 0);
export const hasAvailableDashboards = createSelector(
  [module.simpleSelectors.enterpriseDashboard],
  (data) => data !== null,
);
export const showSelectSessionModal = createSelector(
  [module.simpleSelectors.selectSessionModal],
  (data) => data.cardId != null,
);

export const courseCardData = (state, cardId) => (
  module.simpleSelectors.courseData(state)[cardId]
);

const mkCardSelector = (sel) => (state, cardId) => {
  const cardData = module.courseCardData(state, cardId);
  return sel(cardData);
};

const dateSixMonthsFromNow = new Date();
dateSixMonthsFromNow.setDate(dateSixMonthsFromNow.getDate() + 180);
const today = new Date();

export const courseCard = StrictDict({
  certificate: mkCardSelector(({ certificate }) => {
    const availableDate = certificate.availableDate ? new Date(certificate.availableDate) : null;

    return {
      availableDate,
      certPreviewUrl: certificate.certPreviewUrl,
      isDownloadable: certificate.isDownloadable,
      isEarnedButUnavailable: certificate.isEarned && availableDate > today,
      isRestricted: certificate.isRestricted,
    };
  }),
  course: mkCardSelector(({ course }) => ({
    bannerImgSrc: baseAppUrl(course.bannerImgSrc),
    courseNumber: course.courseNumber,
    courseName: course.courseName,
    website: course.website,
  })),
  courseRun: mkCardSelector(({ courseRun }) => (courseRun === null ? {} : {
    endDate: courseRun.endDate ? new Date(courseRun?.endDate) : null,
    courseId: courseRun.courseId,
    isArchived: courseRun.isArchived,
    isStarted: courseRun.isStarted,
    isFinished: courseRun.isFinished,
    minPassingGrade: Math.floor(courseRun.minPassingGrade * 100),
    startDate: courseRun.startDate ? new Date(courseRun.startDate) : null,
    homeUrl: courseRun.homeUrl,
    marketingUrl: courseRun.marketingUrl,
    progressUrl: learningMfeUrl(courseRun.progressUrl),
    unenrollUrl: learningMfeUrl(courseRun.unenrollUrl),
    upgradeUrl: courseRun.upgradeUrl,
    resumeUrl: learningMfeUrl(courseRun.resumeUrl),
  })),
  enrollment: mkCardSelector(({ enrollment }) => {
    if (enrollment == null) {
      return {
        isEnrolled: false,
      };
    }
    const { isStaff, hasUnmetPrereqs, isTooEarly } = enrollment.coursewareAccess;
    return {
      accessExpirationDate: enrollment.accessExpirationDate ? new Date(enrollment.accessExpirationDate) : null,
      canUpgrade: enrollment.canUpgrade,
      hasStarted: enrollment.hasStarted,
      coursewareAccess: enrollment.coursewareAccess,
      hasAccess: isStaff || !(hasUnmetPrereqs || isTooEarly),
      hasFinished: enrollment.hasFinished,
      isAudit: enrollment.isAudit,
      isAuditAccessExpired: enrollment.isAuditAccessExpired,
      isEmailEnabled: enrollment.isEmailEnabled,
      isVerified: enrollment.isVerified,
      lastEnrolled: enrollment.lastEnrollment,
      isEnrolled: enrollment.isEnrolled,
    };
  }),
  entitlement: mkCardSelector(({ entitlement }) => {
    if (!entitlement || Object.keys(entitlement).length === 0) {
      return { isEntitlement: false };
    }
    const deadline = new Date(entitlement.changeDeadline);
    const deadlinePassed = deadline < new Date();
    const showExpirationWarning = !deadlinePassed && deadline <= dateSixMonthsFromNow;
    return {
      canChange: !deadlinePassed,
      entitlementSessions: entitlement.availableSessions,
      isEntitlement: true,
      isExpired: entitlement.isExpired,
      isFulfilled: entitlement.isFulfilled,
      hasSessions: entitlement.availableSessions?.length > 0,
      changeDeadline: deadline,
      uuid: entitlement.uuid,
      showExpirationWarning,
    };
  }),
  gradeData: mkCardSelector(({ gradeData }) => ({ isPassing: gradeData.isPassing })),
  courseProvider: mkCardSelector(({ courseProvider }) => ({ name: courseProvider?.name })),
  relatedPrograms: mkCardSelector(({ programs: { relatedPrograms } }) => ({
    list: relatedPrograms.map(program => ({
      bannerImgSrc: program.bannerImgSrc,
      logoImgSrc: program.logoImgSrc,
      numberOfCourses: program.numberOfCourses,
      programType: program.programType,
      programUrl: program.programUrl,
      provider: program.provider,
      title: program.title,
    })),
    length: relatedPrograms.length,
  })),
});

export const currentList = (state, {
  sortBy,
  isAscending,
  filters,
  pageSize,
}) => {
  const pageNumber = module.simpleSelectors.pageNumber(state);
  let list = Object.values(module.simpleSelectors.courseData(state));
  const hasFilter = filters.reduce((obj, filter) => ({ ...obj, [filter]: true }), {});
  if (filters.length) {
    list = list.filter(course => {
      if (hasFilter[FilterKeys.notEnrolled]) {
        if (course.enrollment.isEnrolled) {
          return false;
        }
      }
      if (hasFilter[FilterKeys.done]) {
        if (!course.enrollment.hasFinished) {
          return false;
        }
      }
      if (hasFilter[FilterKeys.upgraded]) {
        if (!course.enrollment.isVerified) {
          return false;
        }
      }
      if (hasFilter[FilterKeys.inProgress]) {
        if (!course.enrollment.hasStarted) {
          return false;
        }
      }
      if (hasFilter[FilterKeys.notStarted]) {
        if (course.enrollment.hasStarted) {
          return false;
        }
      }
      return true;
    });
  }
  if (sortBy === 'enrolled') {
    list = list.sort((a, b) => {
      const dateA = new Date(a.enrollment.lastEnrolled);
      const dateB = new Date(b.enrollment.lastEnrolled);
      if (dateA < dateB) { return isAscending ? -1 : 1; }
      if (dateA > dateB) { return isAscending ? 1 : 1; }
      return 0;
    });
  } else {
    list = list.sort((a, b) => {
      const nameA = a.course.courseName.toLowerCase();
      const nameB = b.course.courseName.toLowerCase();
      if (nameA < nameB) { return isAscending ? -1 : 1; }
      if (nameA > nameB) { return isAscending ? 1 : 1; }
      return 0;
    });
  }
  return {
    visible: list.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    numPages: Math.ceil(list.length / pageSize),
  };
};

export default StrictDict({
  ...simpleSelectors,
  courseCard,
  currentList,
  hasCourses,
  hasAvailableDashboards,
  showSelectSessionModal,
});
