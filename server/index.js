const express = require('express')
const cors = require('cors');
const controllers = require('./controllers.js')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.get('/move', controllers.getMove)