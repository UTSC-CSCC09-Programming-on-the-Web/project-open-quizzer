const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//stripe checkout session 
exports.startCheckout = async ({priceId,userName}) => {
  // if(!priceId || typeof priceId !== 'string'){
  //   const error = new Error("invalid input");
  //   error.statusCode = 400;
  //   throw error;
  //   }
    //must follow stripe keys otherwise it will ignore them 
    const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    //quantity is required
    line_items: [{price: priceId, quantity:1}],
    //where to navigate the user on successful payments
    //success_url:`${process.env.BASE_URL}/student/join?session_id={CHECKOUT_SESSION_ID}`,
    success_url:`143.198.43.88/student/join?session_id={CHECKOUT_SESSION_ID}`,

    //where to navigate the user on unsuccessful payments
    //cancel_url: `${process.env.BASE_URL}/pay`,
    cancel_url: `143.198.43.88/pay`,

    metadata: { userName },
    subscription_data: {
    metadata: { userName }
  }
  });

  return {sessionId:session.id};
};


exports.cancelsubscription = async (subscriptionId) => {
  if (!subscriptionId) {
    throw new Error('Missing subscriptionId');
  }
  try {
   await stripe.subscriptions.cancel(subscriptionId);
   } 
  catch (err) {
  console.error('Error cancelling subscription:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not cancel subscription',
      error: err.message
    });
  }


};