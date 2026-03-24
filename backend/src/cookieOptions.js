const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const hasCrossSiteFrontend = configuredOrigins.some((origin) => {
  try {
    return new URL(origin).protocol === 'https:';
  } catch (error) {
    return false;
  }
});

const shouldUseSecureCookies =
  process.env.COOKIE_SECURE === 'true' ||
  process.env.NODE_ENV === 'production' ||
  hasCrossSiteFrontend;

const sameSite = shouldUseSecureCookies ? 'none' : 'lax';

const cookieOptions = {
  httpOnly: true,
  secure: shouldUseSecureCookies,
  sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const clearCookieOptions = {
  httpOnly: true,
  secure: shouldUseSecureCookies,
  sameSite
};

module.exports = {
  cookieOptions,
  clearCookieOptions,
  shouldUseSecureCookies,
  sameSite
};
