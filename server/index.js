const express = require('express')
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const controllers = require('./controllers.js')
const app = express();

const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.get('/getMoves', controllers.getMoves)
app.get('/getEval', controllers.getEval)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));