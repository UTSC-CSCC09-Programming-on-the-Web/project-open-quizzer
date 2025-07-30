const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.TWILIO_API_KEY);

const nameToEmailMap = {
  "Vraj Shah": "vraj.shah2105@gmail.com",
  // To send yourself an email, you must add your name here with the corresponding email @Hardik @Arhum
};

function generateEmailContent(name, questions, answers) {
  let content = `Hi ${name},\n\nHere's a copy of your submission:\n\n`;
  questions.forEach((q, i) => {
    content += `Q${i + 1}: ${q}\nYour Answer: ${answers[i] || "No answer"}\n\n`;
  });
  return content;
}

function generateQuizResultsContent(userName, quizName, quizQuestion, expectedAnswer, userAnswer) {
  return `Hi ${userName},

Here are your quiz results for: ${quizName}

Question: ${quizQuestion}

Your Answer: ${userAnswer || "No answer submitted"}

Expected Answer: ${expectedAnswer}

Thank you for participating in OpenQuizzer!

Best regards,
OpenQuizzer Team`;
}

async function sendUserSummaryEmail({ name, questions, answers }) {
  const to = nameToEmailMap[name];
  if (!to) throw new Error(`No email found for user: ${name}`);

  const text = generateEmailContent(name, questions, answers);

  const msg = {
    to,
    from: "vrajr.shah@mail.utoronto.ca",
    replyTo: "vrajr.shah@mail.utoronto.ca",
    subject: "Your Quiz Submission",
    text,
  };

  await sgMail.send(msg);
}

async function sendQuizResultsEmail({ userEmail, userName, quizName, quizQuestion, expectedAnswer, userAnswer }) {
  const text = generateQuizResultsContent(userName, quizName, quizQuestion, expectedAnswer, userAnswer);

  const msg = {
    to: userEmail,
    from: "vrajr.shah@mail.utoronto.ca",
    replyTo: "vrajr.shah@mail.utoronto.ca",
    subject: `OpenQuizzer Results: ${quizName}`,
    text,
  };

  await sgMail.send(msg);
}

module.exports = {
  sendUserSummaryEmail,
  sendQuizResultsEmail,
};
