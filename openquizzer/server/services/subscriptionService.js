const userModel = require("../models/userModel");

//cases to handle stripe webhooks event
exports.processEvents = async event => {
  //payload from stripe events
  const obj = event.data.object;       
  let userName;
  
  try{
    switch (event.type) {

        /* CASE 1: User successfully subscribed to our application */
      case 'checkout.session.completed':{
        userName = obj.metadata.userName;
        const subscriptionId = obj.subscription;
        console.log(subscriptionId);
        await userModel.activateSubscription(userName,subscriptionId);
        break;
        }

      /* CASE 2: User cancelled the subscription to our application */
      case 'customer.subscription.deleted' :{
        userName = obj.metadata?.userName ||
            obj.lines?.data[0]?.metadata?.userName;
        console.log(userName);
        await userModel.deactivateSubscription(userName);
        break;
        }

      
      /* CASE 3: User payment method failed(card error,expiry,not enough funds etc results in unsubscribed.) */
      case 'invoice.payment_failed' :{
        const invoice = event.data.object;
        const userName = invoice.metadata.userName;
        await userModel.deactivateSubscription(userName);
        //delete console.log later
        console.log("user has been unsubscribed to our application due to failure of payment");
        break;
        }

      case 'invoice.payment_succeeded' :{
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        const userName = invoice.metadata.userName;
        await userModel.activateSubscription(userName,subscriptionId);
        //delete console.log later
        break;
        }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } 
  catch (err) {
    console.error('Webhook processing failed:', err);
    throw err;
    } 
}

