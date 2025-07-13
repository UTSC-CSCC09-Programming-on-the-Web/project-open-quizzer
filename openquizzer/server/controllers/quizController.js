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

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAllQuizzes();
        res.status(200).json({
            ok: true,
            message: "All quizzes retrieved successfully",
            quizzes: quizzes
        });
    } 
    catch (error) {
        res.status(error.statusCode || 500).json({
            ok: false,
            message: error.message
        });
    }
}

exports.activateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuiz = await quizService.activateQuiz(id);
        res.status(200).json({
            ok: true,
            message: "Quiz activated successfully",
            quiz: updatedQuiz
        });
    } catch (error) {
        res.status(error.statusCode || 501).json({
            ok: false,
            message: error.message
        });
    }
}

exports.closeQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuiz = await quizService.closeQuiz(id);
        res.status(200).json({
            ok: true,
            message: "Quiz closed successfully",
            quiz: updatedQuiz
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            ok: false,
            message: error.message
        });
    }
}