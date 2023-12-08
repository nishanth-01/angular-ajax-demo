export type LoginError = 'input' | 'server';

export interface User {
  id: string;
  role: 'general' | 'admin';
}

export interface UserCredentials{
  id: string;
  password: string;
}

const pattern = {
  userId: /^[0-9]{4}$/,
  password: /^[a-z]{1,4}$/,
}

// TODO: remove this
export function validCredentials(id: string, pwd: string): boolean {
  return pattern.userId.test(id) && pattern.password.test(id);
}

