// server/routes/llmRoutes.js
const express = require('express');
const router = express.Router();
const { summarizeAnswers } = require('../services/llmServices/summarize_cats');
const { getScores } = require('../services/llmServices/score_answers');

router.post('/summarize_cats', async (req, res) => {
  try {
    const { answers, quizId } = req.body;
    
    console.log('Received LLM analysis request:', { 
      quizId, 
      answerCount: answers ? answers.length : 0 
    });
    
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No answers provided for analysis'
      });
    }

    const summary = await summarizeAnswers(answers);
    
    const topics = extractTopicsFromSummary(summary);
    const correctness = calculateCorrectness(answers.length);
    
    res.json({
      success: true,
      summary: summary,
      topics: topics,
      correctness: correctness,
      answersAnalyzed: answers.length
    });

  } catch (error) {
    console.error('Error in LLM analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze answers'
    });
  }
});

router.post('/score_answers', async (req, res) => {
  try {
    const { quizId, studentAnswer, expectedAnswer } = req.body;
    
    console.log('Received scoring request:', { 
      quizId, 
      studentAnswer: studentAnswer?.substring(0, 50) + '...', 
      expectedAnswer: expectedAnswer?.substring(0, 50) + '...'
    });
    
    if (!studentAnswer || !expectedAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Student answer and expected answer are required'
      });
    }

    const score = await getScores(expectedAnswer, studentAnswer);
    
    const numericScore = parseFloat(score) || 0;
    const percentageScore = Math.min(Math.max(numericScore * 10, 0), 100);
    
    res.json({
      success: true,
      score: percentageScore,
      correctness: percentageScore,
      feedback: `Your answer scored ${numericScore}/10 based on relevance and completeness compared to the expected answer.`
    });
    
  } catch (error) {
    console.error('Error in scoring:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to score answer'
    });
  }
});

function extractTopicsFromSummary(summary) {
  const commonTopics = [
    'Data Structures', 'Algorithms', 'System Design', 
    'Programming', 'Software Engineering', 'Computer Science'
  ];
  
  const foundTopics = commonTopics.filter(topic => 
    summary.toLowerCase().includes(topic.toLowerCase())
  );
  
  return foundTopics.length > 0 ? foundTopics.slice(0, 5) : ['General', 'Analysis', 'Responses'];
}

function calculateCorrectness(answerCount) {
  return Math.floor(Math.random() * 40) + 60; // Random between 60-100%
}

module.exports = router;