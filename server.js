require('newrelic');
const express = require('express');
const router = require('./routes.js');

const app = express();
const port = 2000;

app.use(express.json());
// for testing product_id=34032, questiion_id=119967
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
