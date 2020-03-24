var app = require('express')();
var http = require('http').createServer(app);
let io = require('socket.io').listen(http);

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

let onlineUsers = {};
let authorizedOnlineCount = 0;
//includes non-authorized
let onlineCount = 0;

/*
{"uuid": 4027292347129, "uname": "Murat"}
file:///Users/right7ctrl/Desktop/proj/chat_socket/client/index.html
*/



io.sockets.on('connect', (socket) => {
    onlineCount += 1;
    console.log('\nCurrent Online Count:', onlineCount);
    let uuid;

    socket.on('register', (user) => {
        try {

            if (user.uuid != undefined && user.uuid != '' && user.uuid != null) {
                uuid = user.uuid;


                if (onlineUsers[uuid] == undefined) {
                    onlineUsers[uuid] = {
                        ID: user.uuid,
                        uname: user.uname,
                        uuid: socket.handshake.query.uuid
                    };
                    console.log('Authorized', user);
                    authorizedOnlineCount += 1;
                    console.log('\nCurrent Authorized Count:', authorizedOnlineCount, '');
                } else {
                    console.log('UUID('+uuid+') already authorizded & online');
                }





            } else {
                console.log('Unauthorized:', user);
            }
        } catch (e) {
            console.log(e);
        }
    });





    socket.on('disconnect', (data) => {
        onlineCount -= 1;
        if (onlineUsers[uuid] != undefined && onlineUsers[uuid] != null && onlineUsers[uuid] != '') {
            delete onlineUsers[uuid];
            authorizedOnlineCount -= 1;
        }
        console.log('\nCurrent Online Count:', onlineCount);
        console.log('\nCurrent Authorized Count:', authorizedOnlineCount);
    });


});







http.listen(3000, function () {
    console.log('listening on *:3000');
});