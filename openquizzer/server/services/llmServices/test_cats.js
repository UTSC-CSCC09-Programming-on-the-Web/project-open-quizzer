const { summarizeAnswers } = require("./summarize_cats");

(async () => {
  const answers = [
    "I enjoy working in teams because it helps me learn from others.",
    "Solving puzzles and challenges on my own gives me a sense of accomplishment.",
    "I prefer outdoor activities like hiking and running.",
    "Teamwork is important to me because it fosters collaboration.",
    "I often spend my free time reading books or writing stories.",
    "I like individual projects where I can focus deeply without distractions.",
    "Sports and fitness help me stay healthy and focused.",
    "When studying, I prefer group discussions over studying alone.",
    "I find creative activities like painting and drawing very relaxing.",
    "I value independence and enjoy setting my own goals.",
  ];

  const summary = await summarizeAnswers(answers);
  console.log(summary);
})();
