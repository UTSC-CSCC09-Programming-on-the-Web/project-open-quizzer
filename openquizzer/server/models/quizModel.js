//pg queries of quiz table to interact with db
const database = require('../config/db');

//method to return a quiz from database based on the quizcode 'code'
exports.findQuiz =  async(code) => {
  const rows  = await database.query(
    `SELECT id, code, status, owner_id, title
       FROM quizzes
      WHERE code = $1`,
    [code]
  );
  return rows[0] || null;
};

//method to query to create a quiz in the db

