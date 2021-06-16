const axios = require('axios')

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