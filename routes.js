/* eslint-disable camelcase */
const express = require('express');
const controller = require('./controller/controller.js');

const router = express.Router();

router.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;
  controller.getQuestions(product_id, (err, data) => {
    if (err) {
      res.status(404).send('no questions');
    } else {
      // with json_build_object
      const compiled = {
        product_id,
        results: [],
      };
      const { questions, answers, photos } = data;
      questions.forEach((question) => {
        const newQuestion = question;
        answers.forEach((answer) => {
          if (question.question_id === answer.q_id) {
            const answerObj = answer;
            photos.forEach((photo) => {
              if (photo.answer_id === answer.id) {
                answerObj.photos.push(photo.photo_url);
              }
            });
            newQuestion.answers[answer.id] = answerObj;
          }
        });
        compiled.results.push(newQuestion);
      });
      res.send(compiled);
    }
  });
});

router.get('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  let count = 10;
  if (req.query.count) {
    count = req.query.count;
  }
  controller.getAnswers(question_id, count, (err, data) => {
    if (err) {
      res.status(404).send('no answers');
    } else {
      const response = {
        question: question_id,
        page: 0,
        count,
        results: [],
      };
      const { answers, photos } = data;
      answers.forEach((answer) => {
        const answerObj = answer;
        photos.forEach((photo) => {
          if (photo.answer_id === answer.answer_id) {
            answerObj.photos.push(photo.photo_url);
          }
        });
        response.results.push(answerObj);
      });
      res.status(200).send(response);
    }
  });
});

router.post('/qa/questions', (req, res) => {
  const newQuestion = req.body;
  const now = new Date();
  newQuestion.question_date = now.toISOString();
  controller.addQuestion(newQuestion, (err, data) => {
    if (err) {
      res.status(404).send('NOT CREATED');
    } else {
      res.status(201).send('CREATED');
    }
  });
});

router.post('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const { body } = req;
  const now = new Date();
  body.question_id = Number(question_id);
  body.date = now.toISOString();
  controller.addAnswer(body, (err, data) => {
    if (err) {
      res.status(404).send('NOT CREATED');
    } else {
      res.status(201).send('CREATED');
    }
  });
});

router.put('/qa/questions/:question_id/helpful', (req, res) => {
  const { question_id } = req.params;
  controller.helpfulQuest(question_id, (err, data) => {
    if (err) {
      res.status(404);
    } else {
      res.status(204).send('NO CONTENT');
    }
  });
});

router.put('/qa/questions/:question_id/report', (req, res) => {
  const { question_id } = req.params;
  controller.reportQuest(question_id, (err, data) => {
    if (err) {
      res.status(404);
    } else {
      res.status(204).send('NO CONTENT');
    }
  });
});

router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const { answer_id } = req.params;
  controller.helpfulAns(answer_id, (err, data) => {
    if (err) {
      res.status(404);
    } else if (data) {
      res.status(204).send('NO CONTENT');
    }
  });
});

router.put('/qa/answers/:answer_id/report', (req, res) => {
  const { answer_id } = req.params;
  controller.reportAns(answer_id, (err, data) => {
    if (err) {
      res.status(404);
    } else {
      res.status(204).send('NO CONTENT');
    }
  });
});

module.exports = router;

// get questions with 3 queries
// with aliasing
// const questions = {};
// data.forEach((row) => {
//   const newQuestion = {
//     question_id: row.question_id,
//     question_body: row.question_body,
//     question_date: row.question_date.toISOString(),
//     asker_name: row.asker_name,
//     question_helpfulness: row.question_helpfulness,
//     reported: row.reported,
//     answers: {},
//   };
//   if (!questions[row.question_id]) {
//     questions[row.question_id] = newQuestion;
//   }
//   if (row.a_id) {
//     const newAnswer = {
//       id: row.a_id,
//       body: row.body,
//       date: row.date.toString(),
//       answerer_name: row.answerer_name,
//       helpfulness: row.helpfulness,
//       photos: [],
//     };
//     if (!questions[row.question_id].answers[row.a_id]) {
//       questions[row.question_id].answers[row.a_id] = newAnswer;
//     }
//   }
//   if (row.photo_id) {
//     questions[row.question_id].answers[row.a_id].photos.push(row.photo_url);
//   }
// });
// const response = {
//   product_id,
//   results: [],
// };
// Object.keys(questions).forEach((key) => {
//   response.results.push(questions[key]);
// });
// res.send(response);

// with 3 queries
// const compiled = {};
// const { questions, answers, photos } = data;
// questions.forEach((question) => {
//   const formattedQ = question;
//   formattedQ.answers = {};
//   compiled[question.question_id] = formattedQ;
// });
// answers.forEach((answer) => {
//   const answerObj = answer;
//   answerObj.photos = [];
//   photos.forEach((photo) => {
//     if (photo.answer_id === answer.id) {
//       answerObj.photos.push(photo.photo_url);
//     }
//   });
//   compiled[answer.q_id].answers[answer.id] = answerObj;
//   delete answerObj.q_id;
// });
// const response = {
//   product_id,
//   results: [],
// };
// Object.keys(compiled).forEach((key) => {
//   response.results.push(compiled[key]);
// });
// res.status(200).send(response);

// getAnswers before refactor
// const answersObj = {};
//       const { answers, photos } = data;
//       answers.forEach((answer) => {
//         const answerObj = answer;
//         answerObj.photos = [];
//         photos.forEach((photo) => {
//           if (photo.answer_id === answer.answer_id) {
//             answerObj.photos.push(photo.photo_url);
//           }
//         });
//         answersObj[answer.answer_id] = answerObj;
//       });
//       const response = {
//         question: question_id,
//         page: 0,
//         count,
//         results: [],
//       };
//       Object.keys(answersObj).forEach((key) => {
//         response.results.push(answersObj[key]);
//       });
//       res.status(200).send(response);
