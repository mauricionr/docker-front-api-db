const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index')
const pool = require('./settings')
const PORT = process.env.API_PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api', routes)

app.get('/', (req, res) => {
  res
    .status(200)
    .send(true);
});

app.get('*', (req, res) => res.status(401).json({ fail: true }))
app.post('*', (req, res) => res.status(401).json({ fail: true }))

app.listen(PORT);

console.log('api running on port: ' + PORT);
console.log('HOST : ', process.env.DB_HOST)