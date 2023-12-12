import { dirname } from 'path';
import { fileURLToPath } from 'url';

// TODO: use seperate constants instead of objects

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
    USER_ID: 'user_id',
    SESSION_ID: 'session_id',
  },
  OPTIONS: {
    USER_ID: { maxAge: loginValidity, httpOnly: true },
    SESSION_ID: { maxAge: loginValidity, httpOnly: true },
  }
};

export const JSON = {
  KEY: {
    USER_ID:   'user_id',
    USER_ROLE: 'user_role',
    PASSWORD:  'password',
    DELAY:     'delay',
    DELAY_OLD: 'delay_old',
    USERS:     'users',
  }
};

// in milli seconds
export const DELAY_MIN = 0;
export const DELAY_MAX = 60*1000;
