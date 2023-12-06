import { User } from './common'

interface FetchUsersResponse {
  err: 'login' | 'other' | '';
  users: User[];
}

interface DelayResponse {
  err: 'server' | 'client' | 'other' | undefined;
  oldDelay: number;
  newDelay: number;
}

export function apiFetchUsers(): FetchUsersResponse {
  return { err: '', users: []};
}

export function apiLogout() {

}

// Always send oldDelay
export function apiDelay(delay?: number): DelayResponse {
  if (delay === undefined) {
    // TODO: return old delay with new delay as `NaN`
    return {err: undefined, oldDelay: 0, newDelay: NaN};
  }
  return {err: undefined, oldDelay: 0, newDelay: 0};
}
