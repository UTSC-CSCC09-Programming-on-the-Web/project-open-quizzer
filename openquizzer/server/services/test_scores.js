const { getScores } = require("./score_answers");

async function testScoring() {
  const question = "What is the capital of France?";
  const answers = [
    "Paris",
    "London",
    "The capital is probably Rome.",
    "Paris, which is also known as the city of lights.",
  ];

  for (const answer of answers) {
    const score = await getScores(question, answer);
    console.log(`Answer: "${answer}" → Score: ${score}`);
  }
}

testScoring();
