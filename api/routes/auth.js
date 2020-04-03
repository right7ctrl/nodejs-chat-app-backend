const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');
const jwt = require('jsonwebtoken');
require('../utils/functions');


router.post('/login', (req, res) => {
    try {
        const b = req.body;
        if (checkObject(b) && checkParam(b.email) && checkParam(b.password)) {

            pool.query('SELECT email, uuid, created_at, last_login_ip, profile_pic_url, full_name FROM users WHERE email=? AND password=? LIMIT 1', [b.email.toString(), b.password.toString()], (err, rows, fields) => {
                let rowCount = Object.keys(rows).length;
                if (!err) {
                    if (rowCount == 1) {
                        var d = new Date();
                        //to avoid the same tokens
                        rows[0]['ca'] = d.getTime();
                        const token = jwt.sign(JSON.stringify(rows[0]), process.env.JWT_SECRET);
                        console.log(rows);
                        res.status(200).json({
                            status: 1,
                            token: token
                        });
                    } else {
                        res.status(200).json({
                            status: 2,
                            message: "Kullanıcı adı veya şifre yanlış"
                        });
                    }
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


router.post('/register', (req, res) => {
   
});



module.exports = router;