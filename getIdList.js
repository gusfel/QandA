const fs = require('fs');
const client = require('./DB/db.js');

// from questions
const queryToUse = 'SELECT DISTINCT product_id FROM questions limit 10000';

// from answers
// const queryToUse = 'SELECT DISTINCT q_id FROM answers limit 10000';

const getIds = (query) => {
  client.query(query, (err, data) => {
    if (err) {
      throw err;
    } else {
      let cleanData = data.rows.map((val) => val.product_id);
      cleanData = cleanData.join('\n');
      fs.writeFile('productIds.csv', cleanData, (err2, data2) => {
        if (err2) throw err2;
        return data2;
      });
    }
  });
};

getIds(queryToUse);
