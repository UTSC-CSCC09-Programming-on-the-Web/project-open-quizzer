//pg queries of quiz table to interact with db
const database = require("../config/db");

//method to return a quiz from database based on the quizcode 'code'
exports.findQuiz = async (code) => {
  const rows = await database.query(
    `SELECT id, code, status, owner_id, title
       FROM quizzes
      WHERE code = $1`,
    [code]
  );
  return rows[0] || null;
};

//method to create a new quiz in the db
exports.createQuiz = async (quizData) => {
  const { id, userid, title, answer, status } = quizData;

  console.log("Creating quiz with data:", quizData); // Debugging

  try {
    const { rows } = await database.query(
      `INSERT INTO quizzes (id, userid, title, answer, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, title, answer, userid, status, created_at`,
      [id, userid, title, answer, status]
    );

    const quiz = rows[0];

    return {
      id: quiz.id,
      title: quiz.title,
      answer: quiz.answer,
      userId: quiz.userid,
      status: quiz.status,
      createdAt: quiz.created_at,
    };
  } catch (error) {
    console.error("Database error details:", error); // Debugging

    // Handle duplicate error
    if (error.code === "23505") {
      const err = new Error("Quiz with this ID already exists");
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
};

exports.getAllQuizzes = async () => {
  const { rows } = await database.query(
    `SELECT id, title, answer, userid, status, created_at
    FROM quizzes
    ORDER BY created_at DESC`
  );
  return rows;
};

exports.getQuizById = async (quizId) => {
  const { rows } = await database.query(
    `SELECT id, userid, title, answer, status, created_at
     FROM quizzes
     WHERE id = $1`,
    [quizId]
  );
  return rows[0] || null;
};

exports.updateQuiz = async (quizid, newQuizData) => {
  const { id, userid, title, answer, status } = newQuizData;
  const { rows } = await database.query(
    `UPDATE quizzes
       SET id = $1, userid = $2, title = $3, answer = $4, status = $5
     WHERE id = $6
     RETURNING id, userid, title, answer, status`,
    [id, userid, title, answer, status, quizid] // quizid is used to match with id (in event of edge case)
  );
  return rows[0];
};
