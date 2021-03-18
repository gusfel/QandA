const pool = require('../DB/db.js');

module.exports.getAnswers = (question_id, count, callback) => {
  const query = `SELECT
    a.*,
    p.* FROM answers a
    LEFT JOIN photos p on p.answer_id = a.id
    WHERE q_id = ${question_id}
    limit ${count}`;
  pool.query(query, (err, data) => {
    if (err) {
      console.log('sorry answers');
    } else {
      const answers = data.rows;
      // console.log(answers);
      callback(null, answers);
    }
  });
};

// module.exports.getQuestions = (product_id, callback) => {
//   const query = `SELECT * FROM questions WHERE product_id = ${product_id} limit 10`;
//   pool.query(query, (err, qData) => {
//     if (err) {
//       console.log('sorry');
//     } else {
//       const questions = qData.rows;
//       callback(null, questions);
//     }
//   });
// };

module.exports.getPhotos = (product_id, callback) => {
  const query = `SELECT * FROM photos WHERE answer_id in (SELECT id FROM answers WHERE question_id in (SELECT question_id from questions WHERE product_id = ${product_id} limit 10) limit 10) limit 5`;
  pool.query(query, (err, data) => {
    if (err) {
      console.log('sorry');
    } else {
      const photos = data.rows;
      callback(null, photos);
    }
  });
};

module.exports.getQuestions = (product_id, callback) => {
  const query = `SELECT
      q.*,
      a.*,
      p.*
      FROM questions q
      LEFT JOIN answers a on a.q_id = q.question_id
      LEFT JOIN photos p on p.answer_id = a.id
      WHERE q.product_id = ${product_id} AND q.question_id IS NOT NULL
      LIMIT 10`;
  pool.query(query, (err, qData) => {
    if (err) {
      console.log('sorry');
    } else {
      const questions = qData.rows;
      // console.log(questions);
      callback(null, questions);
    }
  });
};

module.exports.addQuestion = (questionObj, callback) => {
  const query = `INSERT INTO questions(
    question_body,
    asker_name,
    question_email,
    product_id
  ) VALUES (
    ${questionObj.body},
    ${questionObj.name},
    ${questionObj.email},
    ${questionObj.product_id},
  )`;

  pool.query(query, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      callback(null, response);
    }
  });
};