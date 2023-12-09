import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const PORT = '8080';
export const DOMAIN = '127.0.0.1';
export const API_DOMAIN = `api.${DOMAIN}`;
export const APP_DOMAIN = `${DOMAIN}`;
export const APP_BASEPATH = '/';

export const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));
export const STATIC_ROOT = `${PROJECT_ROOT}/app/dist`;
