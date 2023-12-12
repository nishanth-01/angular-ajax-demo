import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, Subscriber } from 'rxjs'

import { BackendService } from './backend.service';
import { User } from './common';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const api = inject(BackendService);
  const router = inject(Router);

  const loginUrl = router.parseUrl('/login');

  const authAdmin = (s: Subscriber<UrlTree | boolean>) => {
    api.getUser().subscribe({
      next: (u: User) => {
        if(u.user_role === 'admin') {
          s.next(true);
          s.complete();
          return;
        }
        s.next(loginUrl);
        s.complete();
      },
      error: () => {
        s.next(loginUrl);
        s.complete();
      }
    });
  };

  return new Observable<boolean | UrlTree>(authAdmin);
};
