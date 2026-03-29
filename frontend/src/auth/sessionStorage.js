const USER_TOKEN_KEY = "userAuthToken";
const PARTNER_TOKEN_KEY = "partnerAuthToken";

export const authSession = {
  getUserToken() {
    return localStorage.getItem(USER_TOKEN_KEY);
  },
  setUserToken(token) {
    if (token) {
      localStorage.setItem(USER_TOKEN_KEY, token);
    }
  },
  clearUserToken() {
    localStorage.removeItem(USER_TOKEN_KEY);
  },
  getPartnerToken() {
    return localStorage.getItem(PARTNER_TOKEN_KEY);
  },
  setPartnerToken(token) {
    if (token) {
      localStorage.setItem(PARTNER_TOKEN_KEY, token);
    }
  },
  clearPartnerToken() {
    localStorage.removeItem(PARTNER_TOKEN_KEY);
  }
};
