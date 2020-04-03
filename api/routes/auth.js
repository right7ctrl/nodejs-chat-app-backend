const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');
const jwt = require('jsonwebtoken');
require('../utils/functions');
const moment = require('moment');
const uid = require('uuid');



router.post('/login', (req, res) => {
    try {
        const b = req.body;
        if (checkObject(b) && checkParam(b.email) && checkParam(b.password)) {
            pool.query('SELECT id, email, uuid, created_at, last_login_ip, profile_pic_url, full_name FROM users WHERE email=? AND password=? LIMIT 1', [b.email.toString(), b.password.toString()], (err, rows, fields) => {
                let rowCount = Object.keys(rows).length;
                if (!err) {
                    if (rowCount == 1) {
                        const d = new Date();
                        const user = rows[0];
                        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        pool.query("UPDATE users SET last_login_ip=?, last_login_at=? WHERE id=?", [ip, moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), user.id], (err, rows, fields) => {

                        });
                        delete user['id'];
                        //to avoid the same tokens
                        user['ca'] = d.getTime();
                        const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);
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
                    res.status(500).json({
                        status: 2
                    });
                }
            });
        } else {
            res.status(400).json({
                response: 2,
                status: "Bad Request"
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 2
        });
    }
});


router.post('/register', (req, res) => {

    try {
        const uuid = uid.v4.apply().split('-').join('');
        const shrinkedUUID = uuid.substring(1, 16);

        const b = req.body;
        if (checkObject(b) && checkParam(b.fullName) && checkParam(b.email) && checkParam(b.password) && checkParam(b.rePassword) && b.password === b.rePassword) {
            pool.query('INSERT INTO users (uuid, full_name, email, password, isActive) VALUES (?,?,?,?,?)', [
                shrinkedUUID, b.fullName, b.email, b.password, 1
            ], (err, rows, fields) => {
                if (!err) {
                    res.status(200).json({
                        status: 1,
                        message: "Kayıt başarılı."
                    });
                } else {
                    console.log(err);
                    if (err.code == 'ER_DUP_ENTRY') {
                        res.status(502).json({
                            status: 2,
                            "message": "Kullanıcı zaten kayıtlı."
                        });
                    } else {
                        res.status(500).json({
                            status: 2,
                        });
                    }
                }
            });
        } else {
            res.status(400).send({
                response: 2,
                status: "Bad Request"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 2
        });
    }
});



module.exports = router;