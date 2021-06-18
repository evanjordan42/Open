const axios = require('axios')
var stockfish = require('stockfish')
var engine = stockfish();

module.exports.getMoves = (req, res) => {
  axios.get('https://explorer.lichess.ovh/lichess', {
    params:
    {
      variant: 'standard',
      fen: req.query.fen,
      moves: req.query.moves,
      speeds: ["bullet", "blitz", "rapid", "classical"], // should be able to be set by user
      ratings: [1600, 1800, 2000, 2200, 2500] // ^
    }
  })
    .then((response) => {
      res.send(response.data.moves);
    })
    .catch((err) => { console.log('Error getting moves: ', err) })
}

module.exports.getScore = (req, res) => {
  axios.get('https://lichess.org/api/cloud-eval', {
    params: {
      fen: req.query.fen
    }
  })
    .then((response) => {
      res.send(response.data)
    })
    .catch((err) => {
      console.log('Error getting score: ', err.response.statusText)
      res.end('not found')
    })
}

module.exports.stockfish = (req, res) => {
  engine.onmessage = function (event) {
    if (event.split(' ')[2] === '18') {
      let score = (event.split(' ')[9] / 100)
      console.log('score: ' + score)
      res.send({ score })
    }
  }
  engine.postMessage("position fen " + req.query.fen)
  engine.postMessage("go to depth 18")
}