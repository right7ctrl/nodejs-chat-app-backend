const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');


router.get('/', (req, res) => {
  pool.query('SELECT * FROM users', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

module.exports = router;