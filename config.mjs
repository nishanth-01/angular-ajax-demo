import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const PORT = '8080';
export const DOMAIN = 'localhost';
export const API_DOMAIN = `api.${DOMAIN}`;
export const APP_DOMAIN = `${DOMAIN}`;
export const APP_BASEPATH = '/';

export const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));
export const STATIC_ROOT = `${PROJECT_ROOT}/static`;

// set to 'undefined' for session cookies
const loginValidity = undefined; // 'number' in seconds
// options should remain same for the cookies to work properly
export const COOKIES = {
  KEY: {
    USERID: 'user_id',
    SESSIONID: 'session_id',
  },
  OPTIONS: {
    USERID: { maxAge: loginValidity, httpOnly: true },
    SESSIONID: { maxAge: loginValidity, httpOnly: true },
  }
};

export const JSON = {
  KEY: {
    DELAY: 'delay',
    DELAY_OLD: 'delay_old',
  }
};

// in milli seconds
export const MIN_DELAY = 0;
export const MAX_DELAY = 60*1000;
