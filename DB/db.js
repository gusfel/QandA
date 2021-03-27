const { Pool } = require('pg');

// const db = new Pool({
//   user: 'postgres',
//   host: 'ec2-3-22-225-72.us-east-2.compute.amazonaws.com',
//   database: 'qanda',
//   password: 'postgres',
//   port: 5432,
//   max: 100,
//   idleTImeoutMillis: 30000,
//   connectionTImeoutMillis: 4000,
// });

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  max: 100,
  idleTImeoutMillis: 30000,
  connectionTImeoutMillis: 4000,
});

// db.connect();

// client.query('SELECT * FROM questions WHERE product_id = 1 limit 5', (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message); // Hello World!
//   // console.log(res.rows)
//   client.end();
// });

module.exports = db;
