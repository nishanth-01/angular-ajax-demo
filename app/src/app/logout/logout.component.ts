import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  errMsg: string = '';
  loading = false;

  constructor(
    private router: Router,
    private api: BackendService
  ) {}

  onLogoutRequest() {
    const goToLogin = () => {
      this.loading = false;
      this.router.navigate(['/login']);
    };

    this.loading = true;

    const showError = (err: HttpErrorResponse) => {
      switch(err.status) {
        case 400:
          this.errMsg = 'Invalid Request';
          break;
        case 401:
          this.errMsg = 'Access Denied';
          break;
        case 404:
          this.errMsg = 'User not found';
          break;
        case 500:
          this.errMsg = 'Something went wrong in the server';
          break;
        default:
          this.errMsg = 'Something went wrong';
      }
      this.loading = false;
    };

    this.api.logout().subscribe({
      error: showError,
      complete: goToLogin
    });
  }

  onLogoutCancel() {
    // TODO: redirect to previous page
    this.router.navigate(['/app']);
  }
}
