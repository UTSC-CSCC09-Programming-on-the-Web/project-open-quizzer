//storing the user responses in an array for now 

//answerModel.js
const answers = [];

function addResponse(nickname, text) {
  answers.push({ nickname, text, at: Date.now()});
}

function getAllResponses() {
  return answers.slice();
}

module.exports = { add, getAll };
