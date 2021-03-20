const express = require('express');
const controller = require('./controller/controller.js');

const app = express();
const port = 2000;

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// product_id=34032, questiion_id=119967
app.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;
  controller.getQuestions(product_id, (err, data) => {
    if (err) {
      res.status(404);
    } else {
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
      //   // if (row.photo_id) {
      //   //   questions[row.question_id].answers[row.a_id].photos.push(row.photo_url);
      //   // }
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
          if (photo.answer_id === answer.a_id) {
            answerObj.photos.push(photo.photo_url);
          }
        });
        compiled[answer.q_id].answers[answer.a_id] = answerObj;
      });
      const response = {
        product_id,
        results: [],
      };
      Object.keys(compiled).forEach((key) => {
        response.results.push(compiled[key]);
      });

      res.send(response);
    }
  });
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  let count = 10;
  if (req.query.count) {
    count = req.query.count;
  }
  controller.getAnswers(question_id, count, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const answersObj = {};
      const { answers, photos } = data;
      answers.forEach((answer) => {
        const answerObj = answer;
        answerObj.photos = [];

        photos.forEach((photo) => {
          if (photo.answer_id === answer.a_id) {
            answerObj.photos.push(photo.photo_url);
          }
        });
        answersObj[answer.a_id] = answerObj;
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
      res.send(response);
    }
  });
});

app.post('/qa/questions', (req, res) => {
  const newQuestion = req.body;
  console.log(newQuestion);
  const now = new Date();
  newQuestion.question_date = now.toISOString();
  controller.addQuestion(newQuestion, (err, data) => {
    if (err) {
      console.log('server err');
    } else {
      res.status(201).send('CREATED');
    }
  });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const { body } = req;
  const now = new Date();
  body.question_id = Number(question_id);
  body.date = now.toISOString();
  // console.log(body);
  controller.addAnswer(body, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      res.status(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

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
//     questions[row.question_id].answers[row.a_id] = newAnswer;
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

// app.get('/qa/questions', (req, res) => {
//   const { product_id } = req.query;
//   controller.getQuestions(product_id, (err, data) => {
//     if (err) {
//       res.status(404);
//     } else {
//       controller.getPhotos(product_id, (pErr, pData) => {
//         if (pErr) {
//           console.log('photo server error');
//         } else {
//           const photoObj = {};
//           pData.forEach((photo) => {
//             if (photoObj[photo.answer_id]) {
//               photoObj[photo.answer_id].push(photo.photo_url);
//             } else {
//               photoObj[photo.answer_id] = [photo.photo_url];
//             }
//           });
//           const questions = data;
//           controller.getAnswers(product_id, (aErr, aData) => {
//             if (aErr) {
//               console.log('answer server err');
//             } else {
//               const answers = aData;
//               const answersObj = {};
//               answers.forEach((answer) => {
//                 if (photoObj[answer.id]) {
//                   answer.photos = photoObj[answer.id];
//                 } else {
//                   answer.photos = [];
//                 }
//                 answersObj[answer.question_id] = {
//                   [answer.id]: answer,
//                 };
//               });
//               questions.map((question) => {
//                 question.answers = answersObj[question.question_id];
//                 return question;
//               });
//               const sendObj = {
//                 product_id,
//                 results: questions,
//               };
//               res.send(sendObj);
//             }
//           });
//         }
//       });
//     }
//   });
// });

// old answers
// data.rows.forEach((answer) => {
//   const newAnswer = {
//     id: answer.a_id,
//     body: answer.body,
//     date: answer.date.toISOString(),
//     answerer_name: answer.answerer_name,
//     helpfulness: answer.helpfulness,
//     photos: [],
//   };
//   if (!answersObj[answer.a_id]) {
//     answersObj[answer.a_id] = newAnswer;
//   }
//   if (answer.photo_id) {
//     answersObj[answer.a_id].photos.push(answer.photo_url);
//   }
// });
