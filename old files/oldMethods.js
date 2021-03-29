// controller query options

// json_build
getQuestions: (product_id, callback) => {
  const query = `SELECT json_build_object(
    'product_id', ${product_id},
    'results', json_agg(
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
      callback(err);
    } else {
      client.query(query, (e2, data) => {
        if (e2) {
          callback(e2);
        } else {
          const questions = data.rows[0].json_build_object;
          const { question_ids } = questions;
          delete questions.question_ids;
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
            done();
            if (err) {
              callback(aerr);
            } else {
              const answers = adata.rows[0].json_build_object;
              const { answer_ids } = answers;
              delete answers.answer_ids;
              console.log(answers)
              const pQuery = `SELECT json_build_object(

                'answer_id', answer_id,
                'photo_id', photo_id
              ) answer_id
              FROM photos
              WHERE answer_id = ANY(Array[${answer_ids}])`;
              client.query(pQuery, (pErr, pData) => {
                if (pErr) {
                  callback(pErr);
                } else {
                  console.log(pData.rows);
                }
              })
            }
          });
        }
      });
    }
  });
},

// 3 joins
getQuestions: (product_id, callback) => {
  // const query = `SELECT
  // q.*
  // FROM questions q
  // WHERE q.product_id = ${product_id}`;
  const query = `SELECT
  q.question_id,
  q.question_body,
  q.question_date,
  q.asker_name,
  q.reported,
  q.question_helpfulness,
  a.a_id,
  a.q_id,
  a.body,
  a.date,
  a.answerer_name,
  a.helpfulness,
  p.*
  FROM questions q
  LEFT JOIN answers a on a.q_id = q.question_id
  LEFT JOIN photos p on p.answer_id = a.a_id
  WHERE q.product_id = ${product_id} AND q.reported IS false AND a.answer_reported IS false
  `;
  db.connect((err, client, done) => {
    if (err) {
      callback(err);
    } else {
      client.query(query, (terr, data) => {
        done();
        if (terr) {
          callback(terr);
        } else {
          console.log(data.rows)
          callback(null, data.rows);
        }
      });
    }
  });
},

// 3 queries 1.0
getQuestions: (product_id, callback) => {
  const query = `SELECT
  question_id,
  question_body,
  question_date,
  asker_name,
  reported,
  question_helpfulness
    FROM questions
    WHERE product_id = ${product_id} AND reported IS false`;
  db.connect((err, client, done) => {
    if (err) {
      callback(err);
    } else {
      client.query(query, (qErr, qData) => {
        if (qErr) {
          callback(qErr);
        } else {
          const questions = qData.rows;
          const questionIds = questions.map((question) => question.question_id);
          const aQuery = `SELECT
            a_id as id,
            q_id,
            body,
            date,
            answerer_name,
            helpfulness
              FROM answers
              WHERE q_id = ANY(Array[${questionIds}]) AND answer_reported IS false`;
          client.query(aQuery, (aErr, aData) => {
            if (aErr) {
              callback(aErr);
            } else {
              const answers = aData.rows;
              const answerIds = answers.map((answer) => answer.id);
              const pQuery = `SELECT
                    answer_id,
                    photo_url
                      FROM photos
                      WHERE answer_id = ANY(Array[${answerIds}])`;
              client.query(pQuery, (pErr, pData) => {
                done();
                if (pErr) {
                  callback(pErr);
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
    }
  });
},

// old routes

// get questions with 3 queries
// with aliasing
const questions = {};
data.forEach((row) => {
  const newQuestion = {
    question_id: row.question_id,
    question_body: row.question_body,
    question_date: row.question_date.toISOString(),
    asker_name: row.asker_name,
    question_helpfulness: row.question_helpfulness,
    reported: row.reported,
    answers: {},
  };
  if (!questions[row.question_id]) {
    questions[row.question_id] = newQuestion;
  }
  if (row.a_id) {
    const newAnswer = {
      id: row.a_id,
      body: row.body,
      date: row.date.toString(),
      answerer_name: row.answerer_name,
      helpfulness: row.helpfulness,
      photos: [],
    };
    if (!questions[row.question_id].answers[row.a_id]) {
      questions[row.question_id].answers[row.a_id] = newAnswer;
    }
  }
  if (row.photo_id) {
    questions[row.question_id].answers[row.a_id].photos.push(row.photo_url);
  }
});
const response = {
  product_id,
  results: [],
};
Object.keys(questions).forEach((key) => {
  response.results.push(questions[key]);
});
res.send(response);

// with 3 queries
const compiled = {};
const { questions, answers, photos } = data;
questions.forEach((question) => {
  const formattedQ = question;
  formattedQ.answers = {};
  compiled[question.question_id] = formattedQ;
});
answers.forEach((answer) => {
  const answerObj = answer;
  answerObj.photos = [];
  photos.forEach((photo) => {
    if (photo.answer_id === answer.id) {
      answerObj.photos.push(photo.photo_url);
    }
  });
  compiled[answer.q_id].answers[answer.id] = answerObj;
  delete answerObj.q_id;
});
const response = {
  product_id,
  results: [],
};
Object.keys(compiled).forEach((key) => {
  response.results.push(compiled[key]);
});
res.status(200).send(response);

getAnswers before refactor
const answersObj = {};
      const { answers, photos } = data;
      answers.forEach((answer) => {
        const answerObj = answer;
        answerObj.photos = [];
        photos.forEach((photo) => {
          if (photo.answer_id === answer.answer_id) {
            answerObj.photos.push(photo.photo_url);
          }
        });
        answersObj[answer.answer_id] = answerObj;
      });
      const response = {
        question: question_id,
        page: 0,
        count,
        results: [],
      };
      Object.keys(answersObj).forEach((key) => {
        response.results.push(answersObj[key]);
      });
      res.status(200).send(response);
