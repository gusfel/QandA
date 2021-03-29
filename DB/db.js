const { Pool } = require('pg');

// connect to aws
const db = new Pool({
  user: 'postgres',
  host: 'ec2-3-22-225-72.us-east-2.compute.amazonaws.com',
  database: 'qanda',
  password: 'postgres',
  port: 5432,
  max: 100,
  idleTImeoutMillis: 30000,
  connectionTImeoutMillis: 4000,
});

// connect local
// const db = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
//   max: 100,
//   idleTImeoutMillis: 30000,
//   connectionTImeoutMillis: 4000,
// });

module.exports = db;
