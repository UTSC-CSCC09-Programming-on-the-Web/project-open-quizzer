const quizModel = require('../models/quizModel');

exports.joinQuiz = async (code, nickname) => { 
  //validating data received from Controller
  if(!code || isNaN(code) || !nickname){
    const error = new error("Incorrect input data");
    error.statusCode = 400;
    //this error must be caught at the controller side to send to Angular frontend
    throw error;
  }
  
  //Calling quizModel to check from db
  //Also checking for edges cases and correcting them if someone uses server side without frontend.
  const quiz = await quizModel.findQuiz(code.toUpperCase().trim());
  if(!quiz){
    const error = new Error("Quiz does not exist. Please enter a valid code and try again!");
    error.statusCode = 404;
    //this error must be caught at the controller side to send to Angular frontend
    throw error;
  }
  //checking the status of the quiz
  if (quiz.status !== 'live') {
    const error = new Error('Quiz is not accepting responses');
    error.statusCode = 409;
    throw error;
  }
  
  return { quizId: quiz.id, title: quiz.title, time_limit: quiz.time_limit };
};

// createQuiz method
exports.createQuiz = async (quizData) => {
  // initial validation check
  const { id, userid, title, answer, status, time_limit, difficulty } = quizData;
  if (!id || !title || !answer) {
    const error = new Error("Missing required fields: id, title, or answer");
    error.statusCode = 400;
    throw error;
  }

  // Validate time_limit if provided
  if (time_limit !== null && time_limit !== undefined) {
    if (typeof time_limit !== 'number' || time_limit < 0 || time_limit > 3600) {
      const error = new Error("Time limit must be a number between 0 and 3600 seconds");
      error.statusCode = 400;
      throw error;
    }
  }

  if (difficulty !== null && difficulty !== undefined) {
    if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
      const error = new Error("Difficulty must be a number between 1 and 5");
      error.statusCode = 400;
      throw error;
    }
  }

  // actually create quiz
  const quiz = await quizModel.createQuiz({
    id,
    userid,
    title,
    answer,
    status,
    time_limit: time_limit || null,
    difficulty: difficulty || 3 
  });

  return quiz;
}

exports.getAllQuizzes = async () => {
  const quizzes = await quizModel.getAllQuizzes();
  return quizzes;
};

exports.activateQuiz = async (quizId) => {
  if (!quizId) {
    const error = new Error("Quiz ID is required");
    error.statusCode = 400;
    throw error;
  }
  
  const quiz = await quizModel.getQuizById(quizId);
  if (!quiz) {
    const error = new Error("Quiz not found");
    error.statusCode = 404;
    throw error;
  }
  quiz.status = 'active';
  await quizModel.updateQuiz(quizId, quiz);
  return quiz;
};

exports.closeQuiz = async (quizId) => {
  if (!quizId) {
    const error = new Error("Quiz ID is required");
    error.statusCode = 400;
    throw error;
  }
  const quiz = await quizModel.getQuizById(quizId);
  if (!quiz) {
    const error = new Error("Quiz not found");
    error.statusCode = 404;
    throw error;
  }
  const updatedQuizData = {
    id: quiz.id,
    userid: quiz.userid,
    title: quiz.title,
    answer: quiz.answer,
    status: 'inactive',  // Change status to inactive -- now that quiz is over
    time_limit: quiz.time_limit,
    difficulty: quiz.difficulty
  };
  
  const updatedQuiz = await quizModel.updateQuiz(quizId, updatedQuizData);
  return updatedQuiz;
};

exports.getQuizById = async (quizId) => {
    if (!quizId) {
        const error = new Error("Quiz ID is required");
        error.statusCode = 400;
        throw error;
    }
    const quiz = await quizModel.getQuizById(quizId);
    if (!quiz) {
        const error = new Error("Quiz not found");
        error.statusCode = 404;
        throw error;
    }
    return quiz;
};