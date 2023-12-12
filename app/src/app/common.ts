export type LoginError = 'input' | 'server';

export interface User {
  user_id: string;
  user_role: 'general' | 'admin';
}

export interface UserCredentials{
  id: string;
  password: string;
}

const pattern = {
  userId: /^[0-9]{4}$/,
  password: /^[a-z]{1,4}$/,
}

export const DELAY_MAX = 60*1000;

// TODO: remove this
export function validCredentials(id: string, pwd: string): boolean {
  return pattern.userId.test(id) && pattern.password.test(id);
}

