import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observer } from 'rxjs';

import { User } from '../common'
import { BackendService } from '../backend.service'


@Component({
  selector: 'app-general-app',
  standalone: true,
  imports: [CommonModule, ScrollingModule, RouterLink],
  templateUrl: './general-app.component.html',
  styleUrl: './general-app.component.css'
})
export class GeneralAppComponent implements OnInit{
  users: User[] = [];
  errMsg = '';
  loading = false;

  constructor(
    private router: Router,
    private api: BackendService) {}

  private updateUsers() {
    console.log(this.users[0]);//debug
    this.loading = true;

    const onLoaded = (u: User[]) => {
      this.users = u;
      this.loading = false;
    };
    const onError = (e: HttpErrorResponse) => {
      this.errMsg = e.status.toString(10);
      this.loading = false;
    }
    this.api.getUsers().subscribe({ next: onLoaded, error: onError });
  }

  ngOnInit() {
    this.updateUsers();
  }

  onUpdate() {
    this.updateUsers();
  }
}
