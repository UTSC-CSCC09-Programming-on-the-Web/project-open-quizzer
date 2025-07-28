const fetch = require("node-fetch");
require("dotenv").config();

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function summarizeAnswers(answers) {
  const inputText = answers.join(" ");

  const prompt = `
You are given a collection of answers: "${inputText}"

Your task is to summarize these answers by grouping them into relevant categories.
Only output the category names as a bullet list. Do not include summaries or explanations.
`;

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("OpenAI Error:", data.error);
    throw new Error(data.error.message || "Failed to get response from OpenAI");
  }

  const categories = data.choices?.[0]?.message?.content?.trim();
  return categories || "No categories available";
}

module.exports = { summarizeAnswers };
