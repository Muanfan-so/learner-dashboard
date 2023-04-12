/* eslint-disable import/prefer-default-export */
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { logError, logInfo } from '@edx/frontend-platform/logging';

export const getNotices = async () => {
  const authenticatedUser = getAuthenticatedUser();
  const url = new URL(`${getConfig().LMS_BASE_URL}/notices/api/v1/unacknowledged`);
  if (authenticatedUser) {
    try {
      const { data } = await getAuthenticatedHttpClient().get(url.href, {});
      return data;
    } catch (e) {
      // Error probably means that notices is not installed, which is fine.
      const { customAttributes: { httpErrorStatus } } = e;
      if (httpErrorStatus === 404) {
        logInfo(`${e}. This probably happened because the notices plugin is not installed on platform.`);
      } else {
        logError(e);
      }
    }
  }
  return null;
};
