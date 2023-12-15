import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observer } from 'rxjs';

import { BackendService, SetDelayResponse } from '../backend.service';
import config from '../../../../config.json';

@Component({
  selector: 'app-admin-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-app.component.html',
  styleUrl: './admin-app.component.css'
})
export class AdminAppComponent implements OnInit {
  // Initialized in ngOnInit
  // @ts-ignore: Object is possibly 'null'.
  delayForm: FormControl;
  message = '';
  messageColor: 'red' | 'green' = 'green';

  get delayMax(): number {
    return config.DELAY_MAX;
  }

  constructor(private api: BackendService) {}

  private showMessage(msg: string) {
    this.message = msg;
    this.messageColor = 'green';
  }

  private showError(msg: string) {
    this.message = msg;
    this.messageColor = 'red';
  }

  ngOnInit() {
    this.delayForm = new FormControl('0',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(config.PATTERN.DELAY)
        ]
      }
    );

    const observer: Partial<Observer<string>> = {
      next: (res: string) => {
        this.delayForm.reset(res);
      },
      error: (err: HttpErrorResponse) => {
        this.delayForm.reset('0');
        this.showError('Unable to get current delay');
      }
    };
    this.api.getDelay().subscribe(observer);
  }

  onSubmit() {
    this.showMessage('Loading...');
    const observer: Partial<Observer<SetDelayResponse>> = {
      next: (res) => {
        console.log(res);
        this.showMessage(`API delay changed from ${res.delay_old} to ${res.delay} second${(res.delay=='1')?'':'s'}`);
      },
      error: (err: HttpErrorResponse) => {
        this.showError('server returned '+err.status.toString());
      },
    };

    this.api.setDelay(this.delayForm.value).subscribe(observer);
  }
}
