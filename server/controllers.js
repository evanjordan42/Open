const axios = require('axios')

module.exports.getMove = (req, res) => {
  axios.get('https://lichess.org/lichess', {
    params:
    {
      'variant': 'standard',
      'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'play': req.data.play, // correct path?
      'moves': req.data.moves
    }
  })
    .then((move) => {
      res.end(move);
    })
}