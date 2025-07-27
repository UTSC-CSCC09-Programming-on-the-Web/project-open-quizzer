const paymentService = require('../services/paymentService');

exports.createCheckout = async(req,res) => {
   const {priceId,userName} = req.body;
   try{
    const sessionId = await paymentService.startCheckout({priceId,userName});
    return res.status(200).json({ok:true, sessionId});
  }
  catch(error){
   return res.status(error.statusCode).json({ok:false, mess:error.message});
  }
}

exports.cancel = async (req, res) => {
  const { subscriptionId } = req.body;
  if (!subscriptionId) {
    return res.status(400).json({
      success: false,
      message: 'subscriptionId is required',
    });
  }
  try {
    await paymentService.cancelsubscription(subscriptionId);
    res.json({ success: true });
  } 
  catch (err) {
    console.error('Error cancelling subscription:', err);
    res.status(500).json({
      success: false,
      message: 'Could not cancel subscription',
      error: err.message,
    });
  }
}