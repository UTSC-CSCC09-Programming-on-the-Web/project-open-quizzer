const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const subscriptionService = require("../services/subscriptionService");
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

exports.handleSubscription = async (req, res) => {
  console.log("Received Stripe webhook event reached Subscription Controller");
  let event;
  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
    await subscriptionService.processEvents(event);
    //tells the stripe of successfull event.
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    //tells the stripe of error in the event
    return res.status(500).json({ received: false });
  }
};
