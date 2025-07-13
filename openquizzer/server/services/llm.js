const fetch = require("node-fetch");
require("dotenv").config();

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

async function summarizeAnswers(answers) {
  const inputText = answers.join(" ");
  const response = await fetch(HF_MODEL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `Group the following student responses into categories. Respond only with the categories. Here is the text:\n\n${inputText}`,
      options: { wait_for_model: true },
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error("Hugging Face Error:", data.error);
    throw new Error(data.error);
  }

  return data[0]?.summary_text || "No summary returned";
}

module.exports = { summarizeAnswers };
