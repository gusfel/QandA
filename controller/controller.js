const client = require('../DB/db.js');
// const { Client } = require('pg');

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
// });

// client.connect();

module.exports.getAll = (product_id, callback) => {
  const query = `SELECT * FROM questions WHERE product_id = ${product_id} limit 5`;
  client.query(query, (err, data) => {
    if (err) {
      console.log('sorry');
    } else {
      callback(null, data);
    }
  });
};
