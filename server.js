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

app.get('/qa/questions/:question_id/answers', (req, res) => {
  // console.log(req.params.question_id);
  const { question_id } = req.params;
  let count;
  if (req.query.count) {
    count = req.query.count;
  }
  controller.getAnswers(question_id, count, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const answersObj = {};
      data.forEach((answer) => {
        const newAnswer = {
          id: answer.id,
          body: answer.body,
          date: answer.date.toISOString(),
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpfulness,
          photos: [],
        };
        answersObj[answer.id] = newAnswer;
        if (answer.photo_id) {
          answersObj[answer.id].photos.push(answer.photo_id);
        }
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
// add date key/value to newQuestion
// maybe take out all of the not nulls?

  controller.addQuestion(newQuestion, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
});

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
