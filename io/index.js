var app = require('express')();
var http = require('http').createServer(app);
let io = require('socket.io').listen(http);
let mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

let authorizedUsers = {};
let authorizedUserCount = 0;
//includes non-authorized
let onlineCount = 0;

/*
USERMODEL -  {"uuid": 4027292347129, "uname": "Murat"}
MSGMODEL - {"to": 93583094, message": "msg content", "onCreate": ""}
*/

io.sockets.on('connect', (socket) => {
    onlineCount += 1;
    console.log('\nCurrent Online Count:', onlineCount);
    let uuid;


    //authorize user to get notify by socket server
    socket.on('register', (user) => {
        try {
            if (user.uuid != undefined && user.uuid != '' && user.uuid != null) {
                uuid = user.uuid;
                if (authorizedUsers[uuid] == undefined || authorizedUsers[uuid] == null || authorizedUsers[uuid] == '' && socket.handshake.query.uuid != undefined && socket.handshake.query.uuid == user.uuid) {
                    authorizedUsers[uuid] = {
                        ID: user.uuid,
                        uname: user.uname,
                        uuid: socket.handshake.query.uuid
                    };
                    uuid = socket.handshake.query.uuid;
                    socket.join(uuid);
                    console.log('Authorized', user);
                    authorizedUserCount += 1;
                    console.log('\nCurrent Authorized Count:', authorizedUserCount, '');
                    socket.broadcast.emit('active_users', authorizedUsers);

                } else {
                    console.log('UUID(' + uuid + ') already authorized & online');
                    //TODO: first session has to be destroyed??
                }
            } else {
                console.log('Unauthorized:', user);
            }
        } catch (e) {
            console.log(e);
        }
    });


    socket.on('send_msg', (data) => {
        console.log(data);
        try {
            if (uuid != undefined && uuid != '' && uuid != null && authorizedUsers[uuid] != undefined && authorizedUsers[uuid] != '' && authorizedUsers[uuid] != '') {
                //insert DB
                /*   pool.query("SELECT field FROM atable", function(err, rows, fields) {
                      // Connection is automatically released when query resolves
                   }) */
                socket.to(data.to).emit('receive_msg', {
                    "from": uuid,
                    "message": data.message,
                    "onCreate": data.onCreate
                });
                // TODO: handle message sent and seen status
            } else {
                console.log('Unauthorized msg attempt', data);
            }
        } catch (e) {
            console.log(e);
        }
    });


    socket.on('seen_msg', (data) => {
        //TODO
    });

    socket.on('typing_status', (data) => {
        //TODO
    });


    socket.on('disconnect', (data) => {
        try {
            onlineCount -= 1;
            if (authorizedUsers[uuid] != undefined && authorizedUsers[uuid] != null && authorizedUsers[uuid] != '') {
                delete authorizedUsers[uuid];
                authorizedUserCount -= 1;
            }
            console.log('\nCurrent Online Count:', onlineCount);
            console.log('\nCurrent Authorized Count:', authorizedUserCount);
            socket.broadcast.emit('active_users', authorizedUsers);
        } catch (e) {
            console.log(e);
        }

    });


});

http.listen(3000, function () {
    console.log('listening on *:3000');
});