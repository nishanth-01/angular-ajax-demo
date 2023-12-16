import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  errMsg: string = '';
  loading = false;

  constructor(
    private router: Router,
    private api: BackendService,
    public dialogRef: MatDialogRef<LogoutComponent>
  ) {}

  onConfirm() {
    const goToLogin = () => {
      this.loading = false;
      this.dialogRef.close();
      this.router.navigate(['/login']);
    };

    const showError = (err: HttpErrorResponse) => {
      this.loading = false;
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
    };

    this.loading = true;

    this.api.logout().subscribe({
      error: showError,
      complete: goToLogin
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
