import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, Routes, RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';

import { User, UserCredentials, LoginError, validCredentials, login } from '../common'


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private errMsgInput = 'Invalid input: User Id - 4 digit number, password - 1 to 4 lower case alphabets';
  private errMsgOther = 'Login request failed';
  private reUserId = /^[0-9]{4}$/;
  private rePassword = /^[a-z]{1,4}$/;

  userId: string = '';
  password: string = '';
  errMsg = '';

  constructor(private router: Router) {}

  onUserIdChange(s: string | null) {
    if (!s) {
      this.userId = '';
    }
    this.userId = s as string;
  }

  onPasswordChange(s: string | null) {
    if (!s) {
      this.password = '';
    }
    this.password = s as string;
  }

  validCredentials(): boolean {
    return this.reUserId.test(this.userId)
      && this.rePassword.test(this.password);
  }

  onLoginRequest() {
    if (!this.validCredentials()) {
      this.errMsg = this.errMsgInput;
      return;
    }

    let u = login({id: this.userId, password: this.password});

    if (!u) {
      this.errMsg = this.errMsgOther;
      return;
    }

    this.errMsg = '';
    if (u.role === 'admin')
      this.router.navigate(['/app/admin']);
    this.router.navigate(['/app']);
  }
}
