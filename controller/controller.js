/* eslint-disable camelcase */
const db = require('../DB/db.js');
require('newrelic');

const runQuery = (query, callback) => {
  db.connect((err, client, done) => {
    if (err) {
      callback(err);
    } else {
      client.query(query, (err2, response) => {
        done();
        if (err2) {
          callback(err2);
        } else {
          callback(null, response);
        }
      });
    }
  });
};

module.exports = {
  getAnswers: (question_id, count, callback) => {
    const query = `SELECT json_build_object(
      'answers', json_agg(
        json_build_object(
        'answer_id', a_id,
        'q_id',q_id,
        'body', body,
        'date', date,
        'answerer_name',answerer_name,
        'helpfulness',helpfulness,
        'photos', coalesce(null::jsonb, '[]'::jsonb)
        )
      ),
      'answer_ids', json_agg(a_id)
      ) FROM answers
      WHERE q_id = ${question_id} AND answer_reported IS false
      LIMIT ${count}`;
    db.connect((err, client, done) => {
      if (err) {
        callback(err);
      } else {
        client.query(query, (aErr, aData) => {
          const result = aData.rows[0].json_build_object.questions;
          if (aErr || result === null) {
            callback('aErr');
          } else {
            const { answers } = aData.rows[0].json_build_object;
            const { answer_ids } = aData.rows[0].json_build_object;
            const pQuery = `SELECT
            answer_id,
            photo_url
              FROM photos
              WHERE answer_id = ANY(Array[${answer_ids}])`;
            client.query(pQuery, (pErr, pData) => {
              done();
              if (pErr) {
                callback(pErr);
              } else {
                const photos = pData.rows;
                const sendObj = {
                  photos,
                  answers,
                };
                // console.log(answers);
                callback(null, sendObj);
              }
            });
          }
        });
      }
    });
  },

  getQuestions: (product_id, callback) => {
    const query = `SELECT json_build_object(
      'questions', json_agg(
        json_build_object(
        'question_id', question_id,
        'question_body', question_body,
        'question_date', question_date,
        'asker_name', asker_name,
        'reported', reported,
        'question_helpfulness', question_helpfulness,
        'answers', json_build_object()
        )
      ),
      'question_ids', json_agg(question_id)
      ) FROM questions
      WHERE product_id = ${product_id} AND reported IS false`;
    db.connect((err, client, done) => {
      if (err) {
        console.log('aws?' + err);
        callback(err);
      } else {
        client.query(query, (e2, data) => {
          const result = data.rows[0].json_build_object.questions;
          if (e2 || result === null) {
            callback('error');
          } else {
            const { questions } = data.rows[0].json_build_object;
            const { question_ids } = data.rows[0].json_build_object;
            const aQuery = `SELECT json_build_object(
              'answers', json_agg(
                json_build_object(
                'id', a_id,
                'q_id',q_id,
                'body', body,
                'date', date,
                'answerer_name',answerer_name,
                'helpfulness',helpfulness,
                'photos', coalesce(null::jsonb, '[]'::jsonb)
                )
              ),
              'answer_ids', json_agg(a_id)
              ) FROM answers
              WHERE q_id = ANY(Array[${question_ids}]) AND answer_reported IS false`;
            client.query(aQuery, (aerr, adata) => {
              if (err) {
                callback(aerr);
              } else {
                const { answers } = adata.rows[0].json_build_object;
                const { answer_ids } = adata.rows[0].json_build_object;
                const pQuery = `SELECT
                    answer_id,
                    photo_url
                  FROM photos
                  WHERE answer_id = ANY(Array[${answer_ids}])`;
                client.query(pQuery, (pErr, pData) => {
                  done();
                  if (pErr) {
                    callback(pErr);
                  } else {
                    const photos = pData.rows;
                    const allData = {
                      questions,
                      answers,
                      photos,
                    };
                    callback(null, allData);
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  addQuestion: (questionObj, callback) => {
    const query = `INSERT INTO questions(
      question_body,
      asker_name,
      question_email,
      product_id,
      question_date
      ) VALUES (
        '${questionObj.body}',
        '${questionObj.name}',
        '${questionObj.email}',
        ${questionObj.product_id},
        '${questionObj.question_date}'
      );`;
    runQuery(query, callback);
  },
  addAnswer: (answerObj, callback) => {
    const query = `INSERT INTO answers (
      q_id,
      body,
      date,
      answerer_name,
      answer_email
      ) VALUES (
        ${answerObj.question_id},
        '${answerObj.body}',
        '${answerObj.date}',
        '${answerObj.name}',
        '${answerObj.email}'
      )
      RETURNING a_id;`;
    db.connect((err, client, done) => {
      if (err) {
        callback(err);
      } else {
        client.query(query, (err2, response) => {
          done();
          if (err2) {
            callback(err2);
          } else {
            const newAnswerId = response.rows[0].a_id;
            let addPhotoQuery = '';
            if (answerObj.photos) {
              answerObj.photos.forEach((photo) => {
                const photoQuery = `INSERT INTO photos (
                    answer_id,
                    photo_url
                    ) VALUES (
                      ${newAnswerId},
                      '${photo}'
                    );`;
                addPhotoQuery += photoQuery;
              });

              runQuery(addPhotoQuery, callback);
            } else {
              callback(null, response);
            }
          }
        });
      }
    });
  },
  helpfulQuest: (question_id, callback) => {
    const query = `UPDATE questions
      SET question_helpfulness = question_helpfulness + 1
      WHERE question_id = ${question_id}`;
    runQuery(query, callback);
  },
  reportQuest: (question_id, callback) => {
    const query = `UPDATE questions
      SET reported = ${true}
      WHERE question_id = ${question_id}`;
    runQuery(query, callback);
  },
  helpfulAns: (answer_id, callback) => {
    const query = `UPDATE answers
      SET helpfulness = helpfulness + 1
      WHERE a_id = ${answer_id}`;
    runQuery(query, callback);
  },
  reportAns: (answer_id, callback) => {
    const query = `UPDATE answers
      SET answer_reported = ${true}
      WHERE a_id = ${answer_id}`;
    runQuery(query, callback);
  },
};
// json_build
// getQuestions: (product_id, callback) => {
//   const query = `SELECT json_build_object(
//     'product_id', ${product_id},
//     'results', json_agg(
//       json_build_object(
//         'question_id', question_id,
//    'question_body', question_body,
//    'question_date', question_date,
//    'asker_name', asker_name,
//    'reported', reported,
//    'question_helpfulness', question_helpfulness,
//    'answers', json_build_object()
//       )
//     ),
//     'question_ids', json_agg(question_id)
//   ) FROM questions
//   WHERE product_id = ${product_id} AND reported IS false`;
//   db.connect((err, client, done) => {
//     if (err) {
//       callback(err);
//     } else {
//       client.query(query, (e2, data) => {
//         if (e2) {
//           callback(e2);
//         } else {
//           const questions = data.rows[0].json_build_object;
//           const { question_ids } = questions;
//           delete questions.question_ids;
//           const aQuery = `SELECT json_build_object(
//             'answers', json_agg(
//               json_build_object(
//               'id', a_id,
//              'q_id',q_id,
//              'body', body,
//              'date', date,
//              'answerer_name',answerer_name,
//              'helpfulness',helpfulness,
//              'photos', coalesce(null::jsonb, '[]'::jsonb)
//               )
//             ),
//             'answer_ids', json_agg(a_id)
//           ) FROM answers
//             WHERE q_id = ANY(Array[${question_ids}]) AND answer_reported IS false`;
//           client.query(aQuery, (aerr, adata) => {
//             done();
//             if (err) {
//               callback(aerr);
//             } else {
//               const answers = adata.rows[0].json_build_object;
//               const { answer_ids } = answers;
//               delete answers.answer_ids;
//               console.log(answers)
//               const pQuery = `SELECT json_build_object(

//                 'answer_id', answer_id,
//                 'photo_id', photo_id
//               ) answer_id
//               FROM photos
//               WHERE answer_id = ANY(Array[${answer_ids}])`;
//               client.query(pQuery, (pErr, pData) => {
//                 if (pErr) {
//                   callback(pErr);
//                 } else {
//                   console.log(pData.rows);
//                 }
//               })
//             }
//           });
//         }
//       });
//     }
//   });
// },

// 3 joins
// getQuestions: (product_id, callback) => {
//   // const query = `SELECT
//   // q.*
//   // FROM questions q
//   // WHERE q.product_id = ${product_id}`;
//   const query = `SELECT
//   q.question_id,
//   q.question_body,
//   q.question_date,
//   q.asker_name,
//   q.reported,
//   q.question_helpfulness,
//   a.a_id,
//   a.q_id,
//   a.body,
//   a.date,
//   a.answerer_name,
//   a.helpfulness,
//   p.*
//   FROM questions q
//   LEFT JOIN answers a on a.q_id = q.question_id
//   LEFT JOIN photos p on p.answer_id = a.a_id
//   WHERE q.product_id = ${product_id} AND q.reported IS false AND a.answer_reported IS false
//   `;
//   db.connect((err, client, done) => {
//     if (err) {
//       callback(err);
//     } else {
//       client.query(query, (terr, data) => {
//         done();
//         if (terr) {
//           callback(terr);
//         } else {
//           console.log(data.rows)
//           callback(null, data.rows);
//         }
//       });
//     }
//   });
// },

// 3 queries 1.0

// getQuestions: (product_id, callback) => {
//   const query = `SELECT
//   question_id,
//   question_body,
//   question_date,
//   asker_name,
//   reported,
//   question_helpfulness
//     FROM questions
//     WHERE product_id = ${product_id} AND reported IS false`;
//   db.connect((err, client, done) => {
//     if (err) {
//       callback(err);
//     } else {
//       client.query(query, (qErr, qData) => {
//         if (qErr) {
//           callback(qErr);
//         } else {
//           const questions = qData.rows;
//           const questionIds = questions.map((question) => question.question_id);
//           const aQuery = `SELECT
//             a_id as id,
//             q_id,
//             body,
//             date,
//             answerer_name,
//             helpfulness
//               FROM answers
//               WHERE q_id = ANY(Array[${questionIds}]) AND answer_reported IS false`;
//           client.query(aQuery, (aErr, aData) => {
//             if (aErr) {
//               callback(aErr);
//             } else {
//               const answers = aData.rows;
//               const answerIds = answers.map((answer) => answer.id);
//               const pQuery = `SELECT
//                     answer_id,
//                     photo_url
//                       FROM photos
//                       WHERE answer_id = ANY(Array[${answerIds}])`;
//               client.query(pQuery, (pErr, pData) => {
//                 done();
//                 if (pErr) {
//                   callback(pErr);
//                 } else {
//                   const photos = pData.rows;
//                   const sendObj = {
//                     photos,
//                     questions,
//                     answers,
//                   };
//                   callback(null, sendObj);
//                 }
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// },
