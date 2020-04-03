const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');
const jwt = require('jsonwebtoken');
require('../utils/functions');
// get online users
router.post('/list/shuffle', (req, res) => {
  console.log(process.env);
  try {
    if (checkObject(req.body)) {
      pool.query('SELECT uuid, full_name, profile_pic_url, isOnline FROM users ORDER BY RAND() LIMIT 20', (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
          res.sendStatus(500);
        }
      });
    } else {
      res.status(400).send({
        response: 2,
        status: "Bad Request"
      });
    }
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;