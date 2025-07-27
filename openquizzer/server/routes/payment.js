const express = require('express');
const router  = express.Router();
const paymentControl = require('../controllers/paymentController');

router.post('/checkout', paymentControl.createCheckout);
router.post('/subscription/cancel',paymentControl.cancel);
module.exports = router;