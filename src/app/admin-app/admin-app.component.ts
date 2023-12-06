import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroupDirective, FormBuilder } from '@angular/forms';

import { User } from '../common';
import { apiDelay } from '../api';
import * as config from '../../../config';

@Component({
  selector: 'app-admin-app',
  standalone: true,
  imports: [],
  templateUrl: './admin-app.component.html',
  styleUrl: './admin-app.component.css'
})
export class AdminAppComponent implements OnInit {
  delay: number = NaN;
  message = '';
  messageColor: 'red' | 'green' = 'green';
  delayForm = this.formBuilder.group({
    delay: `-`
  });

  constructor(
    private router: Router, private formBuilder: FormBuilder
  ) {}

  get MIN_DELAY() {
    return config.MIN_DELAY;
  }

  get MAX_DELAY() {
    return config.MAX_DELAY;
  }

  private validDelay(): boolean {
    if(Number.isInteger(this.delay)) {
      if (this.delay>=this.MIN_DELAY
        && this.delay<=this.MAX_DELAY) {
        return true;
      }
    }
    return false;
  }

  private showMessage(msg: string) {
    this.message = msg;
    this.messageColor = 'green';
  }

  private showError(msg: string) {
    this.message = msg;
    this.messageColor = 'red';
  }

  ngOnInit() {
    const res = apiDelay();
    if (res.err) {
      this.showError('Unable to fetch current delay');
      return;
    }
    this.delay = res.oldDelay;
  }

  onGoHomeRequest() {
    this.router.navigate(['/app']);
  }

  onLogoutRequest() {
    this.router.navigate(['/logout']);
  }

  onInputChange(delay: string) {
    this.delay = Number(delay);
  }

  onSetDelay() {
    if (!this.validDelay()) {
      this.showError('Invalid Input');
      return;
    }

    const res = apiDelay(this.delay);
    if (res.err) {
      this.delay = res.oldDelay;

      if (res.err === 'client') {
        this.showError('Invalid Input');
      }
      if (res.err === 'server') {
        this.showError('Server Error');
      }
      this.showError('Error');
      return;
    }

    this.delay = res.newDelay;
    this.showMessage(`API delay has been updated from ${res.oldDelay} to ${res.newDelay} second${(res.newDelay==1)?'':'s'}`);
  }

  onSetDelaySubmit() {
    this.delayForm.reset();
  }
}
