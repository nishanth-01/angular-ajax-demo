import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '../common';
import { apiDelay } from '../api';
import * as config from '../../../config';

@Component({
  selector: 'app-admin-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-app.component.html',
  styleUrl: './admin-app.component.css'
})
export class AdminAppComponent implements OnInit {
  MAX_DELAY = config.MAX_DELAY;

  // Initialized in ngOnInit
  // @ts-ignore: Object is possibly 'null'.
  delayForm: FormControl;
  message = '';
  messageColor: 'red' | 'green' = 'green';


  private showMessage(msg: string) {
    this.message = msg;
    this.messageColor = 'green';
  }

  private showError(msg: string) {
    this.message = msg;
    this.messageColor = 'red';
  }

  ngOnInit() {
    this.delayForm = new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(this.MAX_DELAY),
          Validators.pattern(/^\d+$/)
        ]
      }
    );

    const res = apiDelay();
    if (res.err) {
      this.showError('Unable to fetch current delay');
      return;
    }
    this.delayForm.reset(res.oldDelay.toString(10));
  }

  onSubmit() {
    const res = apiDelay(Number(this.delayForm.value));
    if (res.err) {
      if (res.oldDelay) {
        this.delayForm.reset(res.oldDelay.toString());
      }
      this.delayForm.reset();

      let errMsg = 'Error';
      if (res.err === 'client') {
        this.showError('Invalid Input');
        errMsg = 'Invalid Input';
      }
      if (res.err === 'server') {
        this.showError('Server Error');
        errMsg = 'Server Error';
      }
      this.showError(errMsg);
      return;
    }

    this.delayForm.reset(res.newDelay.toString(10));
    this.showMessage(`API delay changed from ${res.oldDelay} to ${res.newDelay} second${(res.newDelay==1)?'':'s'}`);
  }
}
