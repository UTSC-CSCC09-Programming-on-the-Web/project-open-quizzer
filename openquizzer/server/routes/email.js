const express = require("express");
const router = express.Router();
const { sendUserSummaryEmail, sendQuizResultsEmail } = require("../services/automatedEmailService");
const { authenticateToken } = require("../middleware/auth");
const db = require("../config/db");

router.post("/send-automatic-email", async (req, res) => {
  const { name, questions, answers } = req.body;

  if (!name || !Array.isArray(questions) || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    await sendUserSummaryEmail({ name, questions, answers });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// New route for quiz results
router.post("/send-quiz-results", authenticateToken, async (req, res) => {
  try {
    const { quizName, quizQuestion, expectedAnswer, userAnswer } = req.body;
    
    if (!quizName || !quizQuestion || !expectedAnswer) {
      return res.status(400).json({ error: "Missing required quiz data" });
    }

    // Get user's email from database using authenticated user ID
    const userQuery = "SELECT email, first_name, last_name FROM users WHERE id = $1";
    const userResult = await db.query(userQuery, [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];
    const userName = `${user.first_name} ${user.last_name}`;
    
    // Send email with quiz results
    await sendQuizResultsEmail({
      userEmail: user.email,
      userName: userName,
      quizName,
      quizQuestion,
      expectedAnswer,
      userAnswer
    });

    res.status(200).json({ message: "Quiz results sent successfully" });
  } catch (err) {
    console.error("Quiz results email error:", err.message);
    res.status(500).json({ error: "Failed to send quiz results email" });
  }
});

module.exports = router;
