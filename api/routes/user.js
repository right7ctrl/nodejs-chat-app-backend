const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');
const jwt = require('jsonwebtoken');
require('../utils/functions');
// get online users
router.post('/list/shuffle', (req, res) => {
  try {
    const b = req.body;
    if (checkObject(b) && checkParam(b.page)) {
      let queryFilter = '';
      let genderFilter = '';
      let sql_fields = " uuid as UUID, full_name, profile_pic_url, isOnline, biography, gender ";
      if (checkParam(b.queryy)) queryFilter = ' AND biography LIKE "' + b.queryy + '%" ';
      var sql = "SELECT" + sql_fields + "FROM users WHERE isActive = 1 AND biography LIKE "+"da%"+" AND gender = ?";

      pool.query(sql, [b.filter.gender], (err, rows, fields) => {
        if (!err) {

          res.status(200).json({
            items: rows,
            sql: sql
          });

        } else {

          console.log(err);
          res.status(500).send({
            response: 2,
            aa: sql,
            data: sql,
            err: err,
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