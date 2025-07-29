const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.TWILIO_API_KEY);

const nameToEmailMap = {
  "Vraj Shah": "vraj.shah2105@gmail.com",
  // To send yourself an email, you must add your name here with the corresponding email @Hardik @Arhum
};

function generateEmailContent(name, questions, answers) {
  let content = `Hi ${name},\n\nHere’s a copy of your submission:\n\n`;
  questions.forEach((q, i) => {
    content += `Q${i + 1}: ${q}\nYour Answer: ${answers[i] || "No answer"}\n\n`;
  });
  return content;
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

module.exports = {
  sendUserSummaryEmail,
};
