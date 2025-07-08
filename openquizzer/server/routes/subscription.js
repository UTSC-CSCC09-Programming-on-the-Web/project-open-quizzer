const express = require('express');
const router  = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
router.post(
  '/stripe',
  //stripe returns raw bytes
  express.raw({ type: 'application/json' }),
  subscriptionController.handleSubscription);


module.exports = router;