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