const pool = require('../DB/db.js');

const runQuery = (query, callback) => {
  pool.query(query, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      callback(null, response);
    }
  });
};

module.exports.getAnswers = (question_id, count, callback) => {
  // const query = `SELECT
  // a.*,
  // p.* FROM answers a, photos p
  // WHERE a.q_id = ${question_id} AND p.answer_id = a.a_id
  // limit ${count}`;
  const query = `SELECT
    *
    FROM answers
    WHERE q_id = ${question_id} AND answer_reported IS false
    LIMIT ${count}`;
  pool.query(query, (aErr, aData) => {
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
      pool.query(pQuery, (pErr, pData) => {
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

module.exports.getQuestions = (product_id, callback) => {
  const query = `SELECT
    question_id,
    question_body,
    question_date,
    asker_name,
    reported,
    question_helpfulness
      FROM questions
      WHERE product_id = ${product_id} AND reported IS false
      `;
  pool.query(query, (err, qData) => {
    if (err) {
      console.log(err);
    } else {
      const questions = qData.rows;
      const questionIds = questions.map((question) => question.question_id);
      const aQuery = `SELECT
        a_id,
        q_id,
        body,
        date,
        answerer_name,
        helpfulness
          FROM answers
          WHERE q_id = ANY(Array[${questionIds}]) AND answer_reported IS false`;
      pool.query(aQuery, (aErr, aData) => {
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
          pool.query(pQuery, (pErr, pData) => {
            if (pErr) {
              console.log(pErr);
            } else {
              const photos = pData.rows;
              const sendObj = {
                photos,
                questions,
                answers,
              };
              callback(null, sendObj);
            }
          });
        }
      });
    }
  });
};

module.exports.addQuestion = (questionObj, callback) => {
  const query = `INSERT INTO questions(
    question_body,
    asker_name,
    question_email,
    product_id,
    question_date,
    question_helpfulness,
    reported
  ) VALUES (
    '${questionObj.body}',
    '${questionObj.name}',
    '${questionObj.email}',
    ${questionObj.product_id},
    '${questionObj.question_date}',
    0,
    ${false}
  );`;
  runQuery(query, callback);
  // pool.query(query, (err, response) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     callback(null, response);
  //   }
  // });
};

module.exports.addAnswer = (answerObj, callback) => {
  console.log(answerObj);
  const query = `INSERT INTO answers (
    q_id,
    body,
    date,
    answerer_name,
    answer_email,
    helpfulness,
    answer_reported
  ) VALUES (
    ${answerObj.question_id},
    '${answerObj.body}',
    '${answerObj.date}',
    '${answerObj.name}',
    '${answerObj.email}',
    0,
    ${false}
  )
  RETURNING a_id;`;
  pool.query(query, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      const newAnswerId = response.rows[0].a_id;
      let addPhotoQuery = '';
      if (answerObj.photos.length) {
        answerObj.photos.forEach((photo) => {
          const photoQuery = `INSERT INTO photos (
            answer_id, photo_url
            ) VALUES (
              ${newAnswerId},
              '${photo}'
          );`;
          addPhotoQuery += photoQuery;
        });

        runQuery(addPhotoQuery, callback);
        // pool.query(addPhotoQuery, (pErr, pResponse) => {
        //   if (pErr) {
        //     console.log(pErr);
        //   } else {
        //     callback(null, pResponse);
        //   }
        // });
      } else {
        callback(null, response);
      }
    }
  });
};

// module.exports.getQuestions = (product_id, callback) => {
//   const query = `SELECT
//   q.*,
//   a.*,
//   p.*
//   FROM questions q, answers a, photos p
//   WHERE q.product_id = ${product_id} AND a.q_id = q.question_id AND p.answer_id = a.a_id AND q.reported IS false AND a.answer_reported IS false`;

//   // const query = `SELECT
//   //     q.*,
//   //     a.*,
//   //     p.*
//   //     FROM questions q
//   //     LEFT JOIN answers a on a.q_id = q.question_id
//   //     LEFT JOIN photos p on p.answer_id = a.a_id
//   //     WHERE q.product_id = ${product_id}
//   //     LIMIT 10`;
//   // runQuery(query, callback);
//   pool.query(query, (err, qData) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const questions = qData.rows;
//       console.log(questions);
//       callback(null, questions);
//     }
//   });
// };
