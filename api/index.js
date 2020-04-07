const express = require('express');
const app = express();
const List = require('./routes/list');
const User = require('./routes/user');
const Chat = require('./routes/chat');
const Auth = require('./routes/auth');
const reqLogger = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');

dotenv.config();

app.set('port', process.env.PORT || 3008);
app.use(bodyParser.json())
console.log(process.env.JWT_SECRET);
// Middlewares
app.use(reqLogger);

// Routes
app.use('/list', authMiddleware, List);
app.use('/user', authMiddleware, User);
app.use('/chat', authMiddleware, Chat);
app.use('/auth', Auth);

app.get('/', (req, res) => {
    res.send('Index');
});

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});