var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function (req, res) {
    res.send('<h1>Hello 22222</h1>');
});

app.listen(3308, () => {
    console.log('App serving on port 3308');
});