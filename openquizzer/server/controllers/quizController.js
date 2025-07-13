const quizService = require("../services/quizService");

exports.createQuiz = async (req, res) => {
    try {
        const { id, userid, title, answer } = req.body;
        const newQuiz = await quizService.createQuiz({
            id,
            userid: userid || '00000', // TODO: Default with 00000 for now
            title,
            answer,
            status: 'inactive'
        });

        // now return good response code
        res.status(201).json({
            ok: true,
            message: "Quiz created successfully",
            quiz: newQuiz
        });
    }
    // otherwise catch the error
    catch (error) {
        res.status(error.statusCode || 500).json({
            ok: false,
            message: error.message
        });
    }
}