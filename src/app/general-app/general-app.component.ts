import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { User } from '../common'
import { apiFetchUsers } from '../api'

@Component({
  selector: 'app-general-app',
  standalone: true,
  imports: [CommonModule, ScrollingModule, RouterLink],
  templateUrl: './general-app.component.html',
  styleUrl: './general-app.component.css'
})
export class GeneralAppComponent implements OnInit{
  users: User[] = [];
  error: 'login' | 'server' | '' = '';

  private updateUsers() {
    const res = apiFetchUsers();

    if(res.err) {
      if(res.err === 'login') {
        this.error = 'login';
      }
      this.error = 'server';
      return;
    }

    this.users = res.users;
  }

  ngOnInit() {
    this.updateUsers();
  }

  onGetUsers() {
    this.updateUsers();
  }
}
