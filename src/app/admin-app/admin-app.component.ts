import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/route';

import { User } from '../common';

@Component({
  selector: 'app-admin-app',
  standalone: true,
  imports: [],
  templateUrl: './admin-app.component.html',
  styleUrl: './admin-app.component.css'
})
export class AdminAppComponent implements OnInit {
  MIN_DELAY = 0;
  MAX_DELAY = 100;

  delay: number | null = null;
  message = '';
  messageColor: 'red' | 'green' = 'green';

  constructor(private router: Router) {}

  private validateDelay(i: number): boolean {
    const i = Number(s);
    if(Number.isInteger(i)) {
      if (i>=MIN_DELAY && i<=MAX_DELAY) {
        return true;
      }
    }
    return false;
  }

  private showMessage(msg: string, color: 'red' | 'green') {
    this.message = msg;
    this.color = color;
  }

  ngOnInit() {
    const res = apiDelay();
    if (res.err) {
      showMessage('Unable to fetch current delay', 'red');
      return;
    }
    this.currentDelay = res.oldDelay;
  }

  onGoHomeRequest() {
    this.router.navigate(['/app']);
  }

  onLogoutRequest() {
    this.router.navigate(['/logout']);
  }

  onInputChange(s: string) {
    let i = Number(s);
    if (validateDelay(Number(s))) {
      this.delay = i;
    }
    this.delay = null;
  }

  onSetDelay() {
    const res = apiDelay(this.delay);
    if (res.err) {
      if (res.err === 'client') {
        showMessage('Invalid Input', 'red');
      }
      if (res.err === 'server') {
        showMessage('Server Error', 'red');
      }
      showMessage('Error', 'red');
      return;
    }

    showMessage(`API Delay has been updated from ${res.newDelay} to ${res.newDelay}`, 'green');
  }
}
