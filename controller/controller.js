const pool = require('../DB/db.js');

module.exports.getAnswers = (product_id, callback) => {
  const query = `SELECT * FROM answers WHERE question_id in (SELECT question_id from questions WHERE product_id = ${product_id} limit 10) limit 10`;
  pool.query(query, (err, data) => {
    if (err) {
      console.log('sorry answers');
    } else {
      const answers = data.rows;
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