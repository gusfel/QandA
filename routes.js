/* eslint-disable camelcase */
const express = require('express');
const controller = require('./controller/controller.js');

const router = express.Router();

router.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;
  controller.getQuestions(product_id, (err, data) => {
    if (err) {
      res.status(404).send('no questions');
    }
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
    }
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
  });
});

router.post('/qa/questions', (req, res) => {
  const newQuestion = req.body;
  const now = new Date();
  newQuestion.question_date = now.toISOString();
  controller.addQuestion(newQuestion, (err, data) => {
    if (err) {
      res.status(404).send('NOT CREATED');
    }
    res.status(201).send('CREATED');
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
    }
    res.status(201).send('CREATED');
  });
});

router.put('/qa/questions/:question_id/helpful', (req, res) => {
  const { question_id } = req.params;
  controller.helpfulQuest(question_id, (err, data) => {
    if (err) {
      res.status(404);
    }
    res.status(204).send('NO CONTENT');
  });
});

router.put('/qa/questions/:question_id/report', (req, res) => {
  const { question_id } = req.params;
  controller.reportQuest(question_id, (err, data) => {
    if (err) {
      res.status(404);
    }
    res.status(204).send('NO CONTENT');
  });
});

router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const { answer_id } = req.params;
  controller.helpfulAns(answer_id, (err, data) => {
    if (err) {
      res.status(404);
    }
    res.status(204).send('NO CONTENT');
  });
});

router.put('/qa/answers/:answer_id/report', (req, res) => {
  const { answer_id } = req.params;
  controller.reportAns(answer_id, (err, data) => {
    if (err) {
      res.status(404);
    }
    res.status(204).send('NO CONTENT');
  });
});

router.get('/loaderio-29c502b60720759f45d8f3fcd2c5cdc7', (req, res) => {
  res.send('loaderio-29c502b60720759f45d8f3fcd2c5cdc7');
});

module.exports = router;
