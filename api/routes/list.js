const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');
const jwt = require('jsonwebtoken');
require('../utils/functions');
// get online users
router.post('/shuffle', (req, res) => {
  try {
    const b = req.body;
    if (checkObject(b) && checkParam(b.page)) {
      const query_fields = " uuid, full_name, profile_pic_url, biography as bio, created_at ";
      const sql = "SELECT" + query_fields + "FROM users WHERE isActive = 1 ORDER By rand() LIMIT 4";
      pool.query(sql, (err, rows, fields) => {
        console.log('qwe');
        if (!err) {
          res.status(200).json({
            response: 1,
            items: rows
          });
        } else {
          console.log(err);
          res.status(500).send({
            response: 2
          });
        }
      });
    } else {

      res.status(406).send({
        response: 2,
        status: "Missing parameter(s)"
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      response: 2
    });
  }
});

module.exports = router;