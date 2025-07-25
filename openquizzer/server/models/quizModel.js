//pg queries of quiz table to interact with db
const database = require("../config/db");

//method to return a quiz from database based on the quizcode 'code'
exports.findQuiz = async (code) => {
  const rows = await database.query(
    `SELECT id, code, status, owner_id, title, time_limit, difficulty
       FROM quizzes
      WHERE code = $1`,
    [code]
  );
  return rows[0] || null;
};

//method to create a new quiz in the db
exports.createQuiz = async (quizData) => {
  const { id, userid, title, answer, status, time_limit, difficulty } = quizData;

  console.log("Creating quiz with data:", quizData); // Debugging

  try {
    const { rows } = await database.query(
      `INSERT INTO quizzes (id, userid, title, answer, status, time_limit, difficulty, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, title, answer, userid, status, time_limit, difficulty, created_at`,
      [id, userid, title, answer, status || 'inactive', time_limit, difficulty]
    );

    const quiz = rows[0];

    return {
      id: quiz.id,
      title: quiz.title,
      answer: quiz.answer,
      userId: quiz.userid,
      status: quiz.status,
      time_limit: quiz.time_limit,
      difficulty: quiz.difficulty,
      created_at: quiz.created_at,
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
    `SELECT id, userid, title, answer, status, time_limit, difficulty, created_at
     FROM quizzes
     ORDER BY created_at DESC`
  );

  return rows.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    answer: quiz.answer,
    userId: quiz.userid,
    status: quiz.status,
    time_limit: quiz.time_limit,  
    difficulty: quiz.difficulty,  
    created_at: quiz.created_at 
  }));
};

exports.getQuizById = async (quizId) => {
  const { rows } = await database.query(
    `SELECT id, userid, title, answer, status, time_limit, difficulty, created_at
     FROM quizzes
     WHERE id = $1`,
    [quizId]
  );
  
  if (!rows[0]) return null;
  
  const quiz = rows[0];
  return {
    id: quiz.id,
    userid: quiz.userid,
    title: quiz.title,
    answer: quiz.answer,
    status: quiz.status,
    time_limit: quiz.time_limit,  
    difficulty: quiz.difficulty,  
    created_at: quiz.created_at
  };
};

exports.updateQuiz = async (quizid, newQuizData) => {
  const { id, userid, title, answer, status, time_limit, difficulty } = newQuizData;
  const { rows } = await database.query(
    `UPDATE quizzes
       SET id = $1, userid = $2, title = $3, answer = $4, status = $5, time_limit = $6, difficulty = $7
     WHERE id = $8
     RETURNING id, userid, title, answer, status, time_limit, difficulty`,
    [id, userid, title, answer, status, time_limit, difficulty, quizid]
  );
  
  if (!rows[0]) return null;
  
  const quiz = rows[0];
  return {
    id: quiz.id,
    userid: quiz.userid,
    title: quiz.title,
    answer: quiz.answer,
    status: quiz.status,
    time_limit: quiz.time_limit,
    difficulty: quiz.difficulty
  };
};
