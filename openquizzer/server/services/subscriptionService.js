const userModel = require("../models/userModel");

//cases to handle stripe webhooks event
exports.processEvents = async event => {
  //payload from stripe events
  const obj = event.data.object;       // the payload for all cases
  let userName;
  
  try{
    switch (event.type) {

        /* CASE 1: User successfully subscribed to our application */
      case 'checkout.session.completed':{
        userName = obj.metadata.userName;
        const subscriptionId = obj.subscription;
        console.log(subscriptionId);
        // if(!userName || !subscriptionId)
        //   return;
        await userModel.activateSubscription(userName,subscriptionId);
        break;
        }

      /* CASE 2: User cancelled the subscription to our application */
      case 'customer.subscription.deleted' :{
        userName = obj.metadata?.userName ||
            obj.lines?.data[0]?.metadata?.userName;
        console.log(userName);
        // if(!userName || !subscriptionId)
        //   return;
        await userModel.deactivateSubscription(userName);
        break;
        }

      
      // /* CASE 3: User payment method failed(card error,expiry,not enough funds etc results in unsubscribed.) */
      // case 'invoice.payment_failed' :{
      //   userName = obj.metadata?.userName ||
      //       obj.lines?.data[0]?.metadata?.userName;
      //   if(!userName)
      //     return;
      //   await userModel.deactivateSubscription(userName);
      //   //delete console.log later
      //   console.log("user has been unsubscribed to our application due to failure of payment");
      //   break;
      //   }

      // case 'invoice.payment_succeeded' :{
      //   userName = obj.metadata?.userName ||
      //       obj.lines?.data[0]?.metadata?.userName;
      //   if(!userName)
      //     return;
      //   await userModel.activateSubscription(userName);
      //   //delete console.log later
      //   console.log("user has been resubscribed to our application");
      //   break;
      //   }
      

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } 
  catch (err) {
    console.error('Webhook processing failed:', err);
    throw err;
    } 
}

