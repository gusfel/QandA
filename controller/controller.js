const client = require('../DB/db.js');

module.exports.getALL = (product_id, callback) => {
  const query = `SELECT * FROM questions WHERE product_id = ${product_id}`;
  client.query(query, (err, data) => {
    if (err) {
      console.log('sorry');
    } else {
      callback(null, data);
    }
  });
};
