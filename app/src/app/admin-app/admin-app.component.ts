import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observer, EMPTY, tap, catchError } from 'rxjs';

import { BackendService, SetDelayResponse } from '../backend.service';
import { DELAY_MAX } from '../common';

@Injectable({ providedIn: 'root' })
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
    return DELAY_MAX;
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
    this.delayForm = new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(DELAY_MAX),
          Validators.pattern(/^\d+$/)
        ]
      }
    );

    const observer: Partial<Observer<string>> = {
      next: (res: string) => {
        this.delayForm.reset(res);
      },
      error: (err: string) => {
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
      error: (err) => {
        this.showError(err);
      },
    };

    this.api.setDelay(this.delayForm.value).subscribe(observer);
  }
}
