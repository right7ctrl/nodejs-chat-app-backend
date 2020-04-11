const express = require('express');
const router = express.Router();
const pool = require('../utils/db_pool');
require('../utils/functions');

router.post('/list', (req, res) => {
    try {
        let totalRows = 0;
        let totalPages = 0;
        let offset = 0;
        const limit = 2;
        const b = req.body;
        if (b.offset != null && b.offset != undefined && typeof b.offset == 'number') offset = b.offset;
        pool.query('SELECT COUNT(id) as count FROM chats WHERE receiver_uuid=? OR sender_uuid=?', [req.userData.uuid, req.userData.uuid], (err, rows, fields) => {
            totalRows = rows[0].count;
            totalPages = Math.ceil(totalRows / limit);
            const query_fields = ' chat_uuid as room, created_at, sender_uuid as sender, receiver_uuid as receiver, getUserTitleByID(sender_id) as sender_title, getUserTitleByID(receiver_id) as receiver_title, getProfileImgByUUID(sender_uuid) as sender_profile_pic, getProfileImgByUUID(receiver_uuid) as receiver_profile_pic, getUserIsOnlineByUUID(receiver_uuid) as receiver_status, getUserIsOnlineByUUID(sender_uuid) as sender_status ';
            pool.query('SELECT' + query_fields + 'FROM chats WHERE receiver_uuid=? OR sender_uuid=? ORDER BY UNIX_TIMESTAMP(created_at) DESC LIMIT '
                + limit + ' OFFSET ' + offset * limit, [req.userData.uuid, req.userData.uuid], (err, rows, fields) => {
                    if (!err) {
                        res.json({
                            response: 1,
                            total_pages: totalPages - 1,
                            items: rows
                        });
                    } else {
                        console.log(err);
                        res.status(502).json({
                            response: 2,
                            total_pages: 0,
                            items: []
                        });
                    }
                });
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            response: 2
        });
    }
});

router.post('/detail', (req, res) => {
    try {
        const b = req.body;
        if (checkObject(b) && checkParam(b.room)) {
            let totalRows = 0;
            let totalPages = 0;
            const limit = 2;
            let offset = 0;

            if (b.offset != null && b.offset != undefined && typeof b.offset == 'number') offset = b.offset;
            console.log(offset);
            pool.query('SELECT COUNT(id) as count FROM messages WHERE chat_uuid=?', [b.room], (err, rows, fields) => {
                totalRows = rows[0].count;
                totalPages = Math.ceil(totalRows / limit);
                const query_fields = ' sender_uuid as sender, message, created_at ';
                pool.query('SELECT' + query_fields + 'FROM messages WHERE chat_uuid=? ORDER BY UNIX_TIMESTAMP(created_at) DESC LIMIT '
                    + limit + ' OFFSET ' + offset * limit, [b.room], (err, rows, fields) => {
                        if (!err) {
                            res.json({
                                'response': 1,
                                total_pages: totalPages - 1,
                                items: rows
                            });
                        } else {
                            console.log(err);
                            res.status(502).json({
                                response: 2,
                                total_pages: 0,
                                items: []
                            });
                        }
                    });
            });

        } else {
            res.status(422).json({
                response: 2,
                message: "Missing parameter(s)"
            });
        }
    } catch (e) {
        res.status(500).json({
            response: 2
        });
    }
});

module.exports = router;