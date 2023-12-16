import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import config from '../../../../config.json';
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private patternUserId = new RegExp(config.PATTERN.USER_ID);
  private patternPassword = new RegExp(config.PATTERN.USER_PASSWORD);
  // Initialized in ngOnInit
  // @ts-ignore: Object is possibly 'null'.
  loginForm: FormGroup;

  userId: string = '';
  password: string = '';
  errMsg = '';
  loading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private api: BackendService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userId: ['', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(this.patternUserId)
          ]
      }],
      password: ['', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(this.patternPassword)
          ]
      }]
    });
  }

  onSubmit() {
    this.loading = true;
    const onError = (err: HttpErrorResponse) => {
      this.loading = false;
      this.errMsg = 'Login Failed';
    };
    const onComplete = () => {
      this.loading = false;
      this.router.navigate(['/app']);
    };

    this.api.login(
      this.loginForm.value.userId,
      this.loginForm.value.password
    ).subscribe({ error: onError, complete: onComplete});
  }
}
