import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse  } from '@angular/common/http';
import { Observable, Observer, Subscriber, catchError } from 'rxjs'

import { User } from './common'


export type LoginError = 'invalid' | 'server';

export interface SetDelayResponse {
  delay_old: string;
  delay: string;
}


@Injectable({ providedIn: 'root' })
export class BackendService {
  // TODO: don't hardcode
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // TODO: implement all validators as a service
  private validDelay(s: string): boolean {
    return true;
  }

  private validUserId(s: string): boolean {
    return true;
  }

  private validPassword(s: string): boolean {
    return true;
  }

  private throwError<T>(errMsg: string): Observable<T> {
    return new Observable<T>(
      (s: Subscriber<T>) => {
        s.error(errMsg);
      }
    );
  }

  login(userId: string, password: string): Observable<string> {
    if ( !this.validUserId(userId) || !this.validPassword(password) ) {
      return this.throwError<string>('Invalid Credentials');
    }

    return new Observable<string>( (s: Subscriber<string>) => {
      this.http.post(`${this.baseUrl}/login`,
        { user_id: userId, password: password })
        .subscribe({
          error: (err: HttpErrorResponse) => {
            let errMsg = 'Error';
            switch(err.status) {
              case 400:
                errMsg = '400';
                return;
            }
            s.error(errMsg);
          },
          complete: () => {
            s.complete();
          }
        });
    });
  }
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, null);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  setDelay(delay: string): Observable<SetDelayResponse> {
    if( !this.validDelay(delay) ) {
      return this.throwError<SetDelayResponse>('Invalid Input');
    }

    return this.http.put<SetDelayResponse>(`${this.baseUrl}/delay`,
      { delay: delay })
      .pipe(
        catchError((err: HttpErrorResponse, _) => {
          let errMsg = '';
          switch(err.status) {
            case 400:
              errMsg = '400';
          }
          return this.throwError<SetDelayResponse>(errMsg);
        })
      );
  }

  getDelay(): Observable<string> {
    return new Observable<string>( (s: Subscriber<string>) => {
      //TODO: implement
      s.next('0');
    });
  }
}
