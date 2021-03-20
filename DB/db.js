const { Client, Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

pool.connect();

// client.query('SELECT * FROM questions WHERE product_id = 1 limit 5', (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message); // Hello World!
//   // console.log(res.rows)
//   client.end();
// });

module.exports = pool;
