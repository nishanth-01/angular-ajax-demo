import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable, Subscriber, catchError } from 'rxjs';

import config from '../../../config.json';

// properties names must match that of api response
export interface User {
  user_id: string;
  user_role: string;
}

export interface SetDelayResponse {
  delay_old: string;
  delay: string;
}

export interface GetDelayResponse {
  delay: string;
}


@Injectable({ providedIn: 'root' })
export class BackendService {

  constructor(private http: HttpClient) {}

  get apiBaseUrl() {
    return `${config.PROTOCOL}://${config.DOMAIN}:${config.PORT}${config.BASE_PATH_API}`;
  }

  private throwError<T>(errMsg: string): Observable<T> {
    return new Observable<T>(
      (s: Subscriber<T>) => {
        s.error(errMsg);
      }
    );
  }

  login(userId: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/login`, {
      [config.JSON.KEY.USER_ID]: userId,
      [config.JSON.KEY.PASSWORD]: password
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/logout`, null);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/user`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}/users`);
  }

  setDelay(delay: string): Observable<SetDelayResponse> {
    return this.http.put<SetDelayResponse>(`${this.apiBaseUrl}/delay`, {
      [config.JSON.KEY.DELAY]: delay
    });
  }

  getDelay(): Observable<string> {
    return new Observable<string>( (s: Subscriber<string>) => {
      this.http.get<GetDelayResponse>(`${this.apiBaseUrl}/delay`)
        .subscribe({
          error: (err: HttpErrorResponse) => {
            s.error(err);
          },
          next: (res: GetDelayResponse) => {
            s.next(res.delay);
          },
          complete: () => {
            s.complete();
          }
        });
    });
  }
}
