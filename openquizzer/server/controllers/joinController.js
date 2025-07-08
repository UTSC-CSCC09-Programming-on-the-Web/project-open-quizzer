const quizService = require('../services/quizService');

exports.handleJoin = async (req, res) => {
  try {
    const { quizCode, nickname } = req.body;
    const quiz = await quizService.joinQuiz(quizCode, nickname);
    res.status(200).json({ ok: true,quiz});
  } 
  catch (error) {
    res.status(error.statusCode).json({ ok: false, message: error.message });
  }
};


return module;