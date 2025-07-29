const express = require("express");
const router = express.Router();
const { sendUserSummaryEmail } = require("../services/automatedEmailService");

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

module.exports = router;
