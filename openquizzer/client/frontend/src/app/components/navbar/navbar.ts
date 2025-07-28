import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(private http: HttpClient, private router: Router) { }


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


