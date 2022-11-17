const configuration = {
  // BASE_URL: process.env.BASE_URL,
  LMS_BASE_URL: process.env.LMS_BASE_URL,
  // LOGIN_URL: process.env.LOGIN_URL,
  // LOGOUT_URL: process.env.LOGOUT_URL,
  // CSRF_TOKEN_API_PATH: process.env.CSRF_TOKEN_API_PATH,
  // REFRESH_ACCESS_TOKEN_ENDPOINT: process.env.REFRESH_ACCESS_TOKEN_ENDPOINT,
  // DATA_API_BASE_URL: process.env.DATA_API_BASE_URL,
  // SECURE_COOKIES: process.env.NODE_ENV !== 'development',
  // SEGMENT_KEY: process.env.SEGMENT_KEY,
  // ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME,
  LEARNING_BASE_URL: process.env.LEARNING_BASE_URL,
  PERSONALIZED_RECOMMENDATION_COOKIE_NAME: process.env.PERSONALIZED_RECOMMENDATION_COOKIE_NAME || '',
  SESSION_COOKIE_DOMAIN: process.env.SESSION_COOKIE_DOMAIN || '',
  ZENDESK_KEY: process.env.ZENDESK_KEY,
  SUPPORT_URL: process.env.SUPPORT_URL || null,
};

const features = {};

export { configuration, features };
