import { User } from './common'

interface ApiError<T> {
  err: T;
}

interface FetchUsersResponse {
  err: 'login' | 'other' | '';
  users: User[];
}

interface DelayResponse {
  err: 'server' | 'client' | 'other' | undefined;
  oldDelay: number;
  newDelay: number;
}

export function apiLogin(cred?: {id: string, password: string})
    :User & ApiError<'INVALID' | 'WRONG' | 'OTHER' | ''> {
  if (cred === undefined) {
    // check login status return user info if logged in
    return {id: '1234', role: 'admin', err: ''};
  }
  // try to login

  return {id: cred.id, role: 'general', err: ''};
}

export function apiLogout():ApiError<'ERROR' | ''> {
  return {err: ''};
}

export function apiFetchUsers()
    :{users: User[]} & ApiError<'login' | 'other' | ''> {
  const users: User[] = [];
  for(let i=0; i<100; i++) {
    users.push({id: i.toString(), role: (i%2)?'admin':'general'});
  }
  return {users: users, err: ''};
}

// Always send oldDelay
export function apiDelay(delay?: number)
    :{oldDelay: number, newDelay: number}
      & ApiError<'server' | 'client' | 'other' | undefined> {
  if (delay === undefined) {
    // TODO: return old delay with new delay as `NaN`
    return {err: undefined, oldDelay: 0, newDelay: NaN};
  }
  return {err: undefined, oldDelay: 0, newDelay: 0};
}
