const fetch = require("node-fetch");
require("dotenv").config();

const API_KEY = process.env.OPEN_ROUTER_API_KEY;
const OPEN_ROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function getScores(question, answer) {
  const prompt = `Given the question: "${question}", score the following answer from 0 to 10 based on relevance and completeness. Respond ONLY with a number.\n\nAnswer: "${answer}"`;

  const response = await fetch(OPEN_ROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("OpenRouter Error:", data.error);
    throw new Error(data.error);
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  return content;
}

module.exports = { getScores };
