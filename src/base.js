let fs = require('fs');
let conf = require('./config.json');
let http = require(conf.sslsup);//.Server(app);
let mysql = require("mysql");
const uuidv1 = require('uuid/v1');

let pool = mysql.createPool({
    host: conf.dbhost,
    port: conf.dbport,
    user: conf.dbuser,
    password: conf.dbpass,
    database: 'ChatDB',
    multipleStatements: true,
    waitForConnections: true, // Default value.
    queueLimit: 0 // Unlimited - default value.
});
let options = {};
if (conf.sslsup == 'https') {
    options = {
        key: fs.readFileSync('/APIS/iosystem/certs/localhost.key'),
        cert: fs.readFileSync('/APIS/iosystem/certs/localhost.cert'),
        passphrase: '64D&N3+I&t#R!l53'
    }
}

let server = http.createServer(options);
let io = require('socket.io').listen(server);
let usernames = {};
let users = [];
let a=0;
let webci='';
io.sockets.on('connect', function (socket) {
    let par = '';
    let usr = '';
    let ky = '';
    let turu = 0;
    let tkn = {};
    let conlist = [];
    a=a+1;
    console.log('Yeni kişi :'+a);
    socket.on('adduser', function (token) {
        try {
            if (token.Parent != undefined && token.Parent != '' && token.Parent != null) {
                socket.username = token.Parent + '-' + token.UserName;
                par = 'p' + token.Parent;
                Parent = token.Parent;
                tkn = token;
                usr = token.UserName;
                ky = token.UserName;

                pool.query('Update userlist set realstatus=1 where userid=' + usr + ';', function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error);
                    }
                });
                if (usernames[ky] != undefined && usernames[ky].imza != socket.handshake.query.token) {
                    console.log(usernames[ky].imza);
                    socket.broadcast.to(usr).emit('login', {user: usr, durum: 1});
                    socket.emit('alreadylogin', usernames[ky].IP);
                    delete usernames[ky];
                }
                socket.join(par);
                socket.join(usr);
                socket.join('public');
                socket.join('t' + usr);
                socket.emit('log', 'tamam');
                console.log("++Giriş Yaptı : " + token.Unvan + " : " + usr + " : " + par)
                //console.log(socket.adapter.rooms);
                if (token.Tur == undefined) {
                    token.Tur = 1;
                }
                /*
                * Tur 1= DAP
                * Tur 2= Mobil
                *
                * */
                turu = token.Tur;
                usernames[ky] = {
                    ID: socket.id,
                    Parent: token.Parent,
                    UserName: token.UserName,
                    SUnvan: token.SUnvan,
                    Unvan: token.Unvan,
                    Mobile: token.Mobile,
                    IL: token.IL,
                    EMail: token.EMail,
                    AcenteID: token.AcenteID,
                    Tur: token.Tur,
                    IP: 'ipsi',
                    imza: socket.handshake.query.token
                };
                socket.broadcast.to('d' + usr).emit('durum', {user: usr, durum: 1});
            }
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('addweb', function (wtoken) {
        try {
            console.log('Webden: '+wtoken);
            socket.join(wtoken);
            socket.join('web');
            webci=wtoken
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('sendmessage', function (x) {
        try {
            /*
                        pool.query('Insert Ignore  Into relations (usera,userb)values(' + x.to + ',' + usr + ');Insert Ignore  Into relations (usera,userb)values(' + usr + ',' + x.to + ');Update userlist set realstatus=1 where userid=' + x.to + '' + ';' +
                            'Insert Into messages (usera,userb,message)values(' + usr + ',' + x.to + ',"' + x.data + '");', function (error, result) {
                            pool.release;
                            if (error) {
                                console.log(error);
                            }
                        });*/
            console.log(x);
            if (x.tip == 1) {//m-m
                pool.query('Insert into meslist (cid,tip,usera,firma,mess,onsend)values(?,?,?,?,?,?) ;', [x.cid, 2, usr, Parent, x.data, x.tarih], function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error);
                    }
                });
                socket.broadcast.to(x.to).emit('getmessage', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: usr,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: x.to
                });
                socket.emit('sended', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: x.to,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: usr
                });
            }
            else if (x.tip == 2) {//m-f
                console.log('222222222222222');
                pool.query('Insert into meslist (cid,tip,usera,firma,mess,onsend)values(?,?,?,?,?,?) ;', [x.cid, 2, usr, Parent, x.data, x.tarih], function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error);
                    }
                });
                socket.broadcast.to(x.to).emit('getmessage', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: usr,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: x.to
                });
                socket.emit('sended', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: x.to,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: usr
                });

            }
            else if (x.tip == 3) {//f-f
                console.log('222222222222222');
                pool.query('Insert into meslist (cid,tip,usera,firma,mess,onsend)values(?,?,?,?,?,?) ;', [x.cid, 1, usr, Parent, x.data, x.tarih], function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error);
                    }
                });
                socket.broadcast.to(x.to).emit('getmessage', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: usr,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: x.to
                });
                socket.emit('sended', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: x.to,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: usr
                });

            }
            else if (x.tip == 4) {//f-m
                console.log('222222222222222');
                pool.query('Insert into meslist (cid,tip,usera,firma,mess,onsend)values(?,?,?,?,?,?) ;', [x.cid, 1, usr, Parent, x.data, x.tarih], function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error);
                    }
                });
                socket.broadcast.to(x.to).emit('getmessage', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: usr,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: x.to
                });
                socket.emit('sended', {
                    id: x.cid,
                    message: x.data,
                    oncreate: x.tarih,
                    tip: x.tip,
                    usera: x.to,
                    firma: Parent,
                    username: tkn.Unvan,
                    userb: usr
                });

            }
            else if (x.tip == 5) {
                x.to.forEach(dd => {
                    pool.query('Insert into meslist (cid,tip,usera,firma,mess,onsend)values(?,?,?,?,?,?) ;', [x.cid, 2, usr, Parent, x.data, x.tarih], function (error, result) {
                        pool.release;
                        if (error) {
                            console.log(error);
                        }
                    });
                    socket.broadcast.to(dd).emit('getmessage', {
                        id: x.cid,
                        message: x.data,
                        oncreate: x.tarih,
                        tip: x.tip,
                        usera: usr,
                        firma: Parent,
                        username: tkn.Unvan,
                        userb: dd
                    });
                    socket.emit('sended', {
                        id: x.cid,
                        message: x.data,
                        oncreate: x.tarih,
                        tip: x.tip,
                        usera: dd,
                        firma: Parent,
                        username: tkn.Unvan,
                        userb: usr
                    });
                });
            }
        } catch (e) {
            console.log(e);
        }

    });
    socket.on('addcontact', function (x) {
        /*       try {
                   pool.query('Insert Ignore  Into relations (usera,userb)values(' + usr + ',' + x + ');', function (error, result) {
                       pool.release;
                       if (error) {
                           console.log(error.sqlMessage);
                       }
                   });
               } catch (e) {
                   console.log(e);
               }*/
    });
    socket.on('isactive', function (x) {
        try {
            socket.join('d' + x);
        } catch (e) {
            console.log(e);
        }

    });
    socket.on('setinfo', function (x) {
        try {
            socket.broadcast.to('d' + usr).emit('getinfo', x);
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('upall', function (x) {
        try {
            socket.broadcast.to('public').emit('appreset', '1');
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('setreaded', function (x) {
        try {
            pool.query('Update meslist set readby=JSON_ARRAY_APPEND(readby, "$", ' + usr + ') where cid=' + x + ';', function (error, result) {
                pool.release;
                if (error) {
                    console.log(error.sqlMessage);
                }
            });


        } catch (e) {
            console.log(e);
        }

    });
    socket.on('istyping', function (x) {
        try {
            console.log(x);
            socket.broadcast.to('t' + x.user).emit('typing', {user: usr, durum: x.durum});
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('blockcontact', function (x) {
        try {
            pool.query('INSERT INTO Ignore (usera,userb,blocked) VALUES (' + usr + ',' + x.to + ',' + x.block + ') ON DUPLICATE KEY UPDATE blocked=' + x.block + '; ', function (error, result) {
                pool.release;
                if (error) {
                    console.log(error.sqlMessage);
                }
            });
            socket.broadcast.to(x).emit('getblocked', {from: usr, blocked: x.block});
        } catch (e) {
            console.log(e);
        }

    });
    socket.on('delmessage', function (x) {
        try {
            pool.query('DELETE FROM relations WHERE usera =' + usr + ' and userb=' + x + ';Update messages set dela=1 where usera=' + usr + ' and userb=' + x + ' ;Update messages set delb=1 where userb=' + usr + ' and usera=' + x + ' ;', function (error, result) {
                pool.release;
                if (error) {
                    console.log(error.sqlMessage);
                }
            });
        } catch (e) {
            console.log(e);
        }

    });
    socket.on('sendnotify', function (data) {
        try {

            dd = JSON.parse(data);
            if (dd.Data.NType == 2) {
                console.log("+++++++++++Teklif Alduk:" + dd.Data.SKodu + ":"+dd.Data.Data);
            }
            else if (dd.Data.NType == 3) {
                console.log("-----------Teklif Alamaduk:"+ dd.Data.SKodu + ":" + dd.Data.Data);
            }

            if (dd.Data.NType == 2 || dd.Data.NType == 3) {
                /*  pool.query('Insert  Into id_'+dd.Parent+'.Set_Notify (ProcID,NotifyType,NotifyCont,uq,StaffID)values(' + dd.Data.ID + ',' + dd.Data.NType + ',"' + dd.Data.Data + '", ' + dd.Data.uq + ',' + dd.Data.StaffID + ');', function (error, result) {
                      pool.release;
                      if (error) {console.log(error.sqlMessage); }
                  });*/
                socket.broadcast.to('p' + dd.Parent).emit('bildirim', dd.Data);
            }
            else if (dd.Data.NType == 8) {
                pool.query("Insert  Into id_" + dd.Parent + ".Set_Notify (NotifyType,Detay)values(" + dd.Data.NType + ",'"
                    + JSON.stringify(dd.Data.Data) + "');", function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error.sqlMessage);
                    }
                });
                socket.broadcast.to('p' + dd.Parent).emit('bildirim', dd.Data);

            }
            else if (dd.Data.NType == 9) {
                pool.query("Insert  Into id_" + dd.Parent + ".Set_Notify (NotifyType,Detay)values(" + dd.Data.NType + ",'"
                    + JSON.stringify(dd.Data.Data) + "');", function (error, result) {
                    pool.release;
                    if (error) {
                        console.log(error.sqlMessage);
                    }
                });
                socket.broadcast.to(dd.User).emit('dosya', dd.Data);

            }
            else if (dd.Data.NType == 10) {
                socket.broadcast.to(dd.Parent).emit('bildirim', dd.Data);

            }

            //  socket.emit(dd.Parent, dd.Data);
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('notifyweb', function (data) {
        try {
            dd = JSON.parse(data);
            io.emit(dd.Parent, JSON.stringify(dd.Data));
            //  console.log(data)
        } catch (e) {
            console.log(e);
        }

    });
    socket.on('disconnect', function (data) {

        a=a-1;
        console.log('Çıkış :'+a);
        try {
            if (usr != '') {
                if (usernames[ky] != undefined && usernames[ky].imza != undefined && usernames[ky].imza == socket.handshake.query.token) {
                    delete usernames[ky];
                    pool.query('Update userlist set realstatus=0 where userid=' + usr + ';', function (error) {
                        pool.release;
                        if (error) {
                            console.log(error.sqlMessage);
                        }
                    });
                    console.log("--Çıkış Yaptı : " + tkn.Unvan + " : " + usr + " : " + par);
                    socket.broadcast.to('d' + usr).emit('durum', {user: usr, durum: 0});
                }
                else {
                    console.log("-++-Çıkış Yaptı : " + tkn.Unvan + " : " + usr + " : " + par);
                }
            }
            else {
                console.log('teklif çıkışı');
            }
        } catch (e) {
            console.log(e);
        }
    });
    socket.on('msg_user', function (mesdet) {
    });

});
server.listen(3501);
