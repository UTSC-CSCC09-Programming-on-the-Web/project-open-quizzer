const fetch = require("node-fetch");
require("dotenv").config();

const API_KEY = process.env.OPEN_ROUTER_API_KEY;
const OPEN_ROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function summarizeAnswers(answers) {
  const inputText = answers.join(" ");

  const response = await fetch(OPEN_ROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "user",
          content:
            "Given the following answers, summarize them and put them into categories as you deem fit. Only give me the categories. Here are the answers: " +
            inputText,
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("Error summarizing answers:", data.error);
    throw new Error("Failed to summarize answers");
  }

  console.log(data);
  return data.choices?.[0].message?.content || "No summary available";
}

module.exports = { summarizeAnswers };
