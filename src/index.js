var app = require('express')();
var http = require('http').createServer(app);
let io = require('socket.io').listen(http);

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

let authorizedUsers = {};
let authorizedUserCount = 0;
//includes non-authorized
let onlineCount = 0;

/*
USERMODEL -  {"uuid": 4027292347129, "uname": "Murat"}
MSGMODEL - {"to": 93583094, "from": 492349203, "message": "msg content", "onCreate": ""}
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
                if (authorizedUsers[uuid] == undefined || authorizedUsers[uuid] == null || authorizedUsers[uuid] == '') {
                    authorizedUsers[uuid] = {
                        ID: user.uuid,
                        uname: user.uname,
                        uuid: socket.handshake.query.uuid
                    };
                    socket.join(uuid);
                    console.log('Authorized', user);
                    authorizedUserCount += 1;
                    console.log('\nCurrent Authorized Count:', authorizedUserCount, '');
                } else {
                    console.log('UUID(' + uuid + ') already authorized & online');
                }
            } else {
                console.log('Unauthorized:', user);
            }
        } catch (e) {
            console.log(e);
        }
    });


    socket.on('send_msg', (data) => {
        try {
            if (data.from == uuid && authorizedUsers[data.from] != undefined && authorizedUsers[data.from] != '' && authorizedUsers[data.from] != '') {
                socket.to(data.to).emit('receive_msg', data);
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
        } catch (e) {
            console.log(e);
        }

    });


});

http.listen(3000, function () {
    console.log('listening on *:3000');
});