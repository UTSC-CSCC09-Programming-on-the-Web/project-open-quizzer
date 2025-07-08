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
    const error = new error("Quiz doesnot exist.Please enter a valid code and try again!");
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
  
  return { quizId: quiz.id, title: quiz.title };
 
}
