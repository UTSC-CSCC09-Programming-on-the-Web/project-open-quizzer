const express = require('express');
const router  = express.Router();
const paymentControl = require('../controllers/paymentController');

router.post('/checkout', paymentControl.createCheckout);

module.exports = router;