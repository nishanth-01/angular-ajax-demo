import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import config from '../../../../config.json';
import { BackendService, User } from '../backend.service'
import { LogoutComponent } from '../logout/logout.component'


@Component({
  selector: 'app-general-app',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './general-app.component.html',
  styleUrls: ['./general-app.component.css', '/src/styles/toolbar-page.css'],
})
export class GeneralAppComponent implements AfterViewInit {

  displayedColumns: string[] = [
    config.JSON.KEY.USER_ID,
    config.JSON.KEY.USER_ROLE
  ];
  users: User[] = [];
  errMsg = '';
  loading = false;

  @ViewChild(MatTable) table!: MatTable<User>;

  constructor(
    private router: Router,
    private api: BackendService,
    private dialog: MatDialog) {}

  private updateUsers() {
    this.loading = true;

    const onLoaded = (u: User[]) => {
      this.loading = false;
      this.users = u;
      this.table.renderRows();
    };
    const onError = (e: HttpErrorResponse) => {
      this.loading = false;
      this.errMsg = e.status.toString(10);
    }
    this.api.getUsers().subscribe({ next: onLoaded, error: onError });
  }

  ngAfterViewInit() {
    this.updateUsers();
  }

  onUpdate() {
    this.updateUsers();
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  onLogout() {
    this.dialog.open(LogoutComponent);
  }
}
