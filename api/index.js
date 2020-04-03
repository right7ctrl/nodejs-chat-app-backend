const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Routes
app.use(require('./routes/user'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});