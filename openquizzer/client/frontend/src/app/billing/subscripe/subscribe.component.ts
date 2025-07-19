import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from './paymentService';
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
  readonly planPrice = '$5 / month';

  constructor(
    private payService: PaymentService,
    //private auth: AuthService,  (uncomment this once authentication has deployed)
    private router: Router
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
      await this.payService.startCheckout(this.priceId,'abcd');
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
}
