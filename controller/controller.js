const pool = require('../DB/db.js');

// const { pool } = require('pg');

// const pool = new pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
// });

// pool.connect();

module.exports.getAnswers = (product_id, callback) => {
  const query = `SELECT * FROM answers WHERE question_id in (SELECT question_id from questions WHERE product_id = ${product_id} limit 10) limit 10`;
  pool.query(query, (err, data) => {
    if (err) {
      console.log('sorry answers');
    } else {
      const answers = data.rows;
      callback(null, answers);
      // const reviewList =
      // callback(null, data);
    }
  });
};

module.exports.getAll = (product_id, callback) => {
  const query = `SELECT * FROM questions WHERE product_id = ${product_id} limit 10`;
  pool.query(query, (err, qData) => {
    if (err) {
      console.log('sorry');
    } else {
      const questions = qData.rows;
      // console.log(qData.rows);
      callback(null, questions);

      // Promise.all(
      //   questions.map((question) => {
      //     const { question_id } = question;
      //     const qWithA = question;
      //     const res = getAnswers(question_id, (aErr, aData) => {
      //       if (aErr) {
      //         console.log('no answers');
      //       }
      //       const answers = aData.rows;
      //       const answersObj = {};
      //       answers.forEach((answer) => {
      //         answersObj[answer.id] = answer;
      //       });
      //       qWithA.answers = answersObj;
      //       return qWithA;
      //     });
      //     return qWithA
      //   }),
      // )
      //   .then((response) => {
      //     console.log(response);
      //   });
    }
  });
};

module.exports.getAPhotos = (answer_id, callback) => {
  const query = `SELECT * FROM photos WHERE answer_id = ${answer_id} limit 5`;
  pool.query(query, (err, data) => {
    if (err) {
      console.log('sorry');
    } else {
      const questions = data.rows;
      console.log(data.rows);
      // const reviewList =
      // callback(null, data);
    }
  });
};

// questions.forEach((question) => {
//   const { question_id } = question;
//   const qWithA = question;
//   getAnswers(question_id, (aErr, aData) => {
//     if (aErr) {
//       console.log('no answers');
//     } else {
//       const answers = aData.rows;
//       const answersObj = {};
//       answers.forEach((answer) => {
//         answersObj[answer.id] = answer;
//       });
//       qWithA.answers = answersObj;
//       return qWithA;
//     }
//   });
// });
