const fs = require('fs');
const client = require('./DB/db.js');

// const nums = [];

// for (let i = 0; i < 10000; i++) {
//   nums.push(i);
// }
// const numStr = nums.join('\n');

const getIds = () => {
  const query = 'SELECT DISTINCT product_id FROM questions limit 10000';
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

getIds();
