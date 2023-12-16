import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observer } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { BackendService, SetDelayResponse } from '../backend.service';
import { LogoutComponent } from '../logout/logout.component';
import config from '../../../../config.json';


@Component({
  selector: 'app-admin-app',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './admin-app.component.html',
  styleUrl: './admin-app.component.css'
})
export class AdminAppComponent implements OnInit {
  // Initialized in ngOnInit
  // @ts-ignore: Object is possibly 'null'.
  delayForm: FormControl;
  errMsg = '';
  loading = false;

  // used in template
  get delayMax(): number {
    return config.DELAY_MAX;
  }

  constructor(
    private router: Router,
    private api: BackendService,
    private dialog: MatDialog) {}

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
        this.errMsg = 'Unable to get current delay';
      }
    };
    this.api.getDelay().subscribe(observer);
  }

  onSubmit() {
    const observer: Partial<Observer<SetDelayResponse>> = {
      next: (res) => {
        this.loading = false;
        console.log(res);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errMsg = 'server returned '+err.status.toString();
      },
    };

    this.loading = true;
    this.api.setDelay(this.delayForm.value).subscribe(observer);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  onLogout() {
    this.dialog.open(LogoutComponent);
  }
}
