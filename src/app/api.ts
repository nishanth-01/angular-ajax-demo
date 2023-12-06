import { User } from './common'

interface FetchUsersResponse {
  err: 'login' | 'other' | '';
  users: User[];
}

interface DelayResponse {
  err: 'server' | 'client' | 'other';
  oldDelay: number;
  newDelay: number;
}

export function apiFetchUsers(): FetchUsersResponse {
  return { error: '', users: []};
}

export function apiLogout() {

}

export function apiDelay(delay?: number): DelayResponse {
  if (delay === undefined) {
    // TODO: return old delay with new delay as `NaN`
  }
}
