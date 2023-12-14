import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, Subscriber } from 'rxjs'

import { BackendService, User } from './backend.service';


export const authGuard: CanActivateFn = (route, state) => {
  const api = inject(BackendService);
  const router = inject(Router);

  const loginUrl = router.parseUrl('/login');

  const auth = (s: Subscriber<boolean | UrlTree>) => {
    api.getUser().subscribe({
      next: (u: User) => {
        s.next(true);
        s.complete();
      },
      error: () => {
        s.next(loginUrl);
        s.complete();
      }
    });
  };

  return new Observable<boolean | UrlTree>(auth);
};
