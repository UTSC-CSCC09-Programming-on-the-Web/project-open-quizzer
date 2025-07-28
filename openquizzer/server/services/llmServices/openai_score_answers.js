const fetch = require("node-fetch");
require("dotenv").config();

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function getScores(question, answer) {
  const prompt = `
Given the following:

Question: "${question}"
Answer: "${answer}"

Evaluate how well the answer responds to the question in terms of relevance and completeness.
Respond with ONLY a number from 0 to 10. Do not explain your answer.
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
      temperature: 0.0,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("OpenAI Error:", data.error);
    throw new Error(data.error.message || "Failed to get response from OpenAI");
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  const score = parseInt(content.match(/\d+/)?.[0]);

  if (isNaN(score)) {
    console.warn("Could not extract numeric score:", content);
    throw new Error("Invalid score format returned by model");
  }

  return score;
}

module.exports = { getScores };
