const express = require("express");
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/auth');

// Sample route for the API
router.get("/", (req, res) => {
  res.json("Welcome to the OpenQuizzer API!");
});

router.post("/quiz", authenticateToken, quizController.createQuiz); // Add authenticateToken middleware
router.get("/quiz/", quizController.getAllQuizzes); // REST endpoint for get all quizzes
router.patch("/quiz/:id", quizController.activateQuiz); // REST endpoint for activate quiz
router.patch("/quiz/:id/close", quizController.closeQuiz); // REST endpoint for close quiz
router.get("/quiz/:id", quizController.getQuizById); // TD: Need to implement this when implementing live quiz via socket.io

module.exports = router;
