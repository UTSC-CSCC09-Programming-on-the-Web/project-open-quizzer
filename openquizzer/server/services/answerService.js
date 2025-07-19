const answerModel = require('../models/answersModel');

exports.submitAnswer = ({ nickname, answer }) => {
  if(!nickname || !answer){
    const error = new error("invalid input");
    error.statusCode = 400;
    throw error;
    }
  answerModel.add(nickname, answer);
  return;
};
