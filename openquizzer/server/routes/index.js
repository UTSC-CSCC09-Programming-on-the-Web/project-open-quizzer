const express = require("express");
const router = express.Router();
const quizController = require('../controllers/quizController');

// Sample route for the API
router.get("/", (req, res) => {
  res.json("Welcome to the OpenQuizzer API!");
});

router.post("/quiz", quizController.createQuiz); // REST endpoint for create quiz

module.exports = router;
