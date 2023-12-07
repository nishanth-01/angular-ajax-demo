import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { apiLogin } from '../api'


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private reUserId = /^[0-9]{4}$/;
  private rePassword = /^[a-z]{1,4}$/;
  // Initialized in ngOnInit
  // @ts-ignore: Object is possibly 'null'.
  loginForm: FormGroup;

  userId: string = '';
  password: string = '';
  errMsg = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userId: ['', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(this.reUserId)
          ]
      }],
      password: ['', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(this.rePassword)
          ]
      }]
    });
  }

  onSubmit() {
    const res = apiLogin({
      id: this.loginForm.value.userId.value,
      password: this.loginForm.value.password.value
    });

    if(res.err) {
      let msg = 'Request Failed';
      if(res.err === 'WRONG') {
        msg = 'Cannot find user';
      }
      if(res.err === 'INVALID') {
        msg = 'Input Error';
      }
      this.errMsg = msg;
      return;
    }

    this.router.navigate(['/app']);
  }
}
