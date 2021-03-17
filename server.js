const express = require('express');
const controller = require('./controller/controller.js');

const app = express();
const port = 2000;

app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.get('/qa/questions', (req, res) => {
  // console.log(req);
  const { product_id } = req.query;
  controller.getAll(product_id, (err, data) => {
    if (err) {
      res.status(404);
    } else {
      // res.send(data);
      const questions = data;
      controller.getAnswers(product_id, (aErr, aData) => {
        if (aErr) {
          console.log('answer server err');
        } else {
          const answers = aData;
          const answersObj = {};
          // console.log(answers);
          answers.forEach((answer) => {
            answersObj[answer.question_id] = {
              [answer.id]: answer,
            };
          });
          // Object.keys(questions)
          console.log(questions);
          questions.map(question => {
            question.answers = answersObj[question.question_id];
            return question;
          });
          console.log(questions);
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
