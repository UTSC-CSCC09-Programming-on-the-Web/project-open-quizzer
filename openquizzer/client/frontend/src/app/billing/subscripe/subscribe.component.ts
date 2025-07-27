import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from './paymentService';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
//uncomment the following line when the authentication has deployed to redirect the user
//import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class PayComponent implements OnInit {
  loading = false;
  errorMsg = '';
  //setting them readonly so template can only read their values
  readonly priceId = 'price_1RgiT6FN6emTzMixYpv9ZkXL';
  readonly planName = 'Pro Subscription';
  readonly planPrice = '$10 / month';

  constructor(
    private payService: PaymentService,
    private router: Router,
    private http: HttpClient
  ) {}

  /* If the user is already active, bypass this page */
  ngOnInit(): void {
    /*
    if (this.auth.currentUser?.status === 'active') {
      this.router.navigate(['/join']);   // or wherever
    }
    */
  }
  
  //Stripe Checkout redirect when the user clicks subscribe button
  async subscribe(): Promise<void> {
    this.errorMsg = '';
    this.loading = true;

    try {
      const token = localStorage.getItem('token')!;
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      const profile = await lastValueFrom(
        this.http.get<{ data: { user: { email: string, status : boolean }}}>(
          'http://localhost:3000/api/auth/verify',
          { headers }
        )
      );
      if(profile.data.user.status){
        alert("you are already subscribed to the application. please proceed to home page");
        return;
      }
    await this.payService.startCheckout(this.priceId,profile.data.user.email);
    } 
    catch (err: any) {
      console.error(err);
      this.errorMsg =
        err?.message || 'Something went wrong; please try again.';
    } 
    finally {
      this.loading = false;
    }
  }


  //unsubsrribe button so that the user is no longer subscribed to our app
  async unsubscribe() : Promise<void>{

    try {
      //getting the user info from the bearer access token
      const token = localStorage.getItem('token')!;
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      const profile = await lastValueFrom(
        this.http.get<{ data: { user: { subscriptionId: string, status:boolean }}}>(
          'http://localhost:3000/api/auth/verify',
          { headers }
        )
      );
      if(!profile.data.user.status){
        alert("you are already unsubscribed to the application. please subscribe to proceed");
        return;
      }
      const subscriptionId = profile.data.user.subscriptionId;
      console.log(subscriptionId);
      //making a post req to our server 
      try {
      await lastValueFrom(
        this.http.post<{ success: boolean }>(
          'http://localhost:3000/api/subscription/cancel',
          { subscriptionId}
        )
      );
      alert('Your subscription has been cancelled—updating your status now.');
      this.router.navigateByUrl('/login');

    } 
    catch (err) {
      console.error('Unsubscribe failed', err);
      alert('Could not cancel. Please try again.');
    }
  }
  catch(err){
    console.log(err);
  }
  }
}