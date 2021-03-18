const express = require('express');
const controller = require('./controller/controller.js');

const app = express();
const port = 2000;

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;
  controller.getQuestions(product_id, (err, data) => {
    if (err) {
      res.status(404);
    } else {
      // res.send(data)
      const questions = {};
      data.forEach((row) => {
        const newQuestion = {
          question_id: row.question_id,
          question_body: row.question_body,
          question_date: row.question_date.toString(),
          asker_name: row.asker_name,
          question_helpfulness: row.question_helpfulness,
          reported: row.reported,
          answers: {},
        };
        questions[row.question_id] = newQuestion;
        if (row.id) {
          const newAnswer = {
            id: row.id,
            body: row.body,
            date: row.date.toString(),
            answerer_name: row.answerer_name,
            helpfulness: row.helpfulness,
            photos: [],
          };
          questions[row.question_id].answers[row.id] = newAnswer;
        }
        if (row.photo_id) {
          questions[row.question_id].answers[row.id].photos.push(row.photo_url);
        }
      });
      // console.log(questions);
      // console.log(answers);
      const response = {
        product_id,
        results: [],
      };
      Object.keys(questions).forEach((key) => {
        response.results.push(questions[key]);
      });
      res.send(response);
    }
  });
});

// app.put('/qa/questions/:product_id/helpful', (req, res) => {
//   console.log(req);
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

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
