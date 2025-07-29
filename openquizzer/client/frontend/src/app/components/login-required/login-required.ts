import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-required',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login-required.html',
  styleUrl: './login-required.scss',
})
export class LoginRequired {
  constructor() {}
}
