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
      controller.getPhotos(product_id, (pErr, pData) => {
        if (pErr) {
          console.log('photo server error');
        } else {
          const photoObj = {};
          pData.forEach((photo) => {
            if (photoObj[photo.answer_id]) {
              photoObj[photo.answer_id].push(photo.photo_url);
            } else {
              photoObj[photo.answer_id] = [photo.photo_url];
            }
          });
          const questions = data;
          controller.getAnswers(product_id, (aErr, aData) => {
            if (aErr) {
              console.log('answer server err');
            } else {
              const answers = aData;
              const answersObj = {};
              answers.forEach((answer) => {
                if (photoObj[answer.id]) {
                  answer.photos = photoObj[answer.id];
                } else {
                  answer.photos = [];
                }
                answersObj[answer.question_id] = {
                  [answer.id]: answer,
                };
              });
              questions.map((question) => {
                question.answers = answersObj[question.question_id];
                return question;
              });
              const sendObj = {
                product_id,
                results: questions,
              };
              res.send(sendObj);
            }
          });
        }
      });
    }
  });
});

// app.put('/qa/questions/:product_id/helpful', (req, res) => {
//   console.log(req);
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
