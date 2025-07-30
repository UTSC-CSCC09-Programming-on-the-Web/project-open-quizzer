const express = require('express');
const router  = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
router.post(
  '/stripe',
  //stripe returns raw bytes
  // console.log('Received a request to /stripe'),
  express.raw({ type: 'application/json' }),
  subscriptionController.handleSubscription);

module.exports = router;