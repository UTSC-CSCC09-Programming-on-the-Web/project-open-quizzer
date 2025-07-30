import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isAuthenticated = false;
  
  constructor(private http: HttpClient, private router: Router) { 
    // Listen to route changes to update authentication status
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkAuthentication();
      }
    });
  }
  
  ngOnInit() {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
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
          `${environment.apiBaseUrl}/auth/logout`,
          {},
          {headers}
        )
      )
      .then((res) => {
        console.log(res.message);
      
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.router.navigate(['/login']);
    });
  }
}


