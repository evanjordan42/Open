import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import Chess from 'chess.js'
import axios from 'axios'

function App() {
  /* configurable metrics:
  1. number of top replies to consider picking a move from, e.g. pick one of the top 3 most frequent responses
  2. biggest drop in analysis standing to stop line

  Order of operations:
  -----------------------
  1. Player drags and drops a piece
  2. Chessboard.jsx exports move
  3. Chess.js validates, if impossible move nothing happens
  4. If possible move, Chess.js will export fen to
    4a. update Chessboard.jsx
    4b. send to Lichess to get x moves
  5. A move is chosen at random and entered into Chess.js
  6. Chess.js exports fen which is then entered into Chessboard.jsx - possibly after a delay


  When a player "loses":
  1. Repeat the previous move sequence
  2. Show following lines?

  */
  let chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [numMoves, setNumMoves] = useState(3); // the number of moves that can be picked from at random
  const [tolerance, setTolerance] = useState(1); // the difference in pawn units between the previous move and the move made required for the losing behavior to occur


  function onDrop(moveObj) { // validates move, then sets fen and calls getMoves
    const chess = new Chess(fen)
    // castling

    if (chess.move({ from: moveObj.sourceSquare, to: moveObj.targetSquare })) {
      let fen = chess.fen();
      setFen(fen);
      getMoves(fen);
    }
  }

  function getMoves(fen) { // calls server with fen then calls updateBoard with one of the x responses
    axios.get('/getMoves', {
      params: {
        fen, moves: numMoves
      }
    })
      .then((res) => {
        let moves = res.data
        if (moves.length) {
          let randomMove = moves[Math.floor(Math.random() * moves.length)].san
          console.log('randomMove: ', randomMove)
          updateBoard(randomMove, fen)
        } else {
          console.log('Recieved no moves')
        }
      })
  }

  function updateBoard(move, fen) {
    const chess = new Chess(fen);
    chess.move(move)
    setFen(chess.fen());
  }

  return (
    <div>
      <Chessboard position={fen} onDrop={onDrop} />
    </div>
  )
}

export default App;