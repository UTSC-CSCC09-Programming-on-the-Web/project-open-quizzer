import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-home',
  imports: [CommonModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  constructor(private router: Router, private http: HttpClient) {}

  navigateToQuizMaster(): void {
    this.router.navigate(['/quiz-master']);
  }

  navigateToQuizTaker(): void {
    this.router.navigate(['/quiz-taker']);
  }

  logout(): void {
    const token = localStorage.getItem('token'); 
    if (!token)
      return;
    const headers = {
      Authorization: `Bearer ${token}`
    };
       lastValueFrom(
        this.http.post<{message:string }>(
          'http://localhost:3000/api/auth/logout',
          {},
          {headers}
        )
      )
      .then((res) => {
        console.log(res.message);
      
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}
