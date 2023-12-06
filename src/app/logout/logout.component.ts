import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { apiLogout } from '../api';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(
    private router: Router
  ) {}

  onLogoutRequest() {
    apiLogout();
    this.router.navigate(['/login']);
  }

  onLogoutCancel() {
    this.router.navigate(['/app']);
  }
}
