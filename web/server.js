const express = require('express');
const path = require('path');
const PORT = process.env.WEB_PORT || 3001;
const app = express();

app.use('/static', express.static(path.join(__dirname, '/build/static')))

app.get('*', (req, res) => {
    res.sendfile(__dirname + '/build/index.html');
});

app.listen(PORT);

console.log('web running on port: ' + PORT);