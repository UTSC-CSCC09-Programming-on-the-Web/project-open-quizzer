//express router
const router = require('express').Router();
const joinControl = require('../controllers/joinController');
const answerControl = require('../controllers/answerController');
// POST /api/join
router.post('/join', joinControl.handleJoin);
router.post('/submit',answerControl.addAnswer);

module.exports = router;