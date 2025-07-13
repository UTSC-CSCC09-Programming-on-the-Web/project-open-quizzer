const express = require("express");
const router = express.Router();
const quizController = require('../controllers/quizController');

// Sample route for the API
router.get("/", (req, res) => {
  res.json("Welcome to the OpenQuizzer API!");
});

router.post("/quiz", quizController.createQuiz); // REST endpoint for create quiz
router.get("/quiz/", quizController.getAllQuizzes); // REST endpoint for get all quizzes
// router.get("/quiz/:id", quizController.getQuizById); // TODO: Need to implement this when implementing live quiz via socket.io

module.exports = router;
