import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';

import { BackendService } from '../backend.service'


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
  //TODO: move validation to separate service
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
    private formBuilder: FormBuilder,
    private api: BackendService
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
    const onError = (err: string) => {
      this.errMsg = 'Login Failed';
    };
    const onComplete = () => {
      this.router.navigate(['/app']);
    };

    this.api.login(
      this.loginForm.value.userId,
      this.loginForm.value.password
    ).subscribe({ error: onError, complete: onComplete});
  }
}
