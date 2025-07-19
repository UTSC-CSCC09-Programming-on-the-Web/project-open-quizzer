import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
//change this later with your actual STRIPE key
import { firstValueFrom } from 'rxjs';
//uncomment the following and import the key from env file and past it here.
const apiBaseUrl = 'http://localhost:3000/api';
//Also import the value from env file
const stripePublishableKey = 'pk_test_51RgWgZFN6emTzMixVAdccRqitOHK1jFVNxt9VXEDRnOyWsGDX0bitBM5V10WKgkkYCowQfXBK6NLo9RO7YHAoHpt00Iea6KPst';
//injecting this in our payment component to start a checkout session

//import this from env file

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}
  private apiUrl = apiBaseUrl;
  async startCheckout(priceId: string,userName: string): Promise<void> {

  const response = await firstValueFrom(
  this.http.post<{ sessionId: {sessionId: string }}>(
    `${this.apiUrl}/checkout`,
    { priceId, userName }
  )
  );

   console.log(response);
  const sessionId = response.sessionId.sessionId;
    //calling the stripe API to load a checkout session with the sessionId
    const stripe = await loadStripe(stripePublishableKey);
    if (!stripe) 
      throw new Error('Stripe JS failed to load');

    const { error } = await stripe.redirectToCheckout({sessionId});
    if (error) throw error;
  }
}

