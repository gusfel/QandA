const client = require('../DB/db.js');

const runQuery = (query, callback) => {
  client.query(query, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      callback(null, response);
    }
  });
};

module.exports.getAnswers = (question_id, count, callback) => {
  const query = `SELECT
    a_id,
    body,
    answerer_name,
    helpfulness
    FROM answers
    WHERE q_id = ${question_id} AND answer_reported IS false
    LIMIT ${count}`;
  client.query(query, (aErr, aData) => {
    if (aErr) {
      console.log(aErr);
    } else {
      const answers = aData.rows;
      const answerIds = answers.map((answer) => answer.a_id);
      const pQuery = `SELECT
      answer_id,
      photo_url
        FROM photos
        WHERE answer_id = ANY(Array[${answerIds}])`;
      client.query(pQuery, (pErr, pData) => {
        if (pErr) {
          console.log(pErr);
        } else {
          const photos = pData.rows;
          const sendObj = {
            photos,
            answers,
          };
          callback(null, sendObj);
        }
      });
    }
  });
};
