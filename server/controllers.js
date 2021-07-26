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
    .catch((err) => { console.log('Error getting moves: ', err); res.end() })
}

module.exports.lichess = (req, res) => {
  axios.get('https://lichess.org/api/cloud-eval', {
    params: {
      fen: req.query.fen,
      multiPv: 5
    }
  })
    .then((response) => {
      res.send(response.data)
    })
    .catch((err) => {
      console.log('Error getting score: ', err.response.statusText)
      res.end('Not Found')
    })
}

module.exports.stockfish = (req, res) => {
  let pvs = [];
  let depth = '18'

  let fen = req.query.fen;
  let user = req.query.user;
  if (user === 'true') {
    user = true
  } else {
    user = false;
  }
  let multiPv;
  user ? multiPv = 1 : multiPv = 2;
  engine.postMessage('setoption name contempt value 0')

  engine.postMessage(`setoption name multipv value ${multiPv}\\n`)
  engine.postMessage(`position fen ${fen}`)
  engine.onmessage = function (event) {
    if (event.split(' ')[2] === depth) {
      let moves = event.split(' ');
      let pv = moves[moves.indexOf('multipv') + 1]

      moves.splice(0, moves.indexOf('pv') + 1)
      moves.splice(10, moves.length)
      moves = moves.join(' ');

      let cp = Number(event.split(' ')[9])
      // It seems + / - only refers to the other player, not always white/black, i.e. +3.6 after analyzing white's move means black is up 3.6
      if (user) {
        cp = -cp;
      }
      pvs.push({ moves, cp })
      if (pvs.length === multiPv) {
        res.send({ pvs })
      }
    }
  }
  engine.postMessage(`go to depth ${depth}`)
}