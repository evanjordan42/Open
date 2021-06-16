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

  const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [numMoves, setNumMoves] = useState(3); // the number of moves that can be picked from at random
  const [tolerance, setTolerance] = useState(100); // the difference in score score between the previous move and the move made required for the learning behavior to occur
  const [learning, setLearning] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  function onDrop(moveObj) { // validates move then calls userMove
    const chess = new Chess(FEN)
    let source = chess.get(moveObj.sourceSquare);
    let target = chess.get(moveObj.targetSquare);
    let castling = (source.type === 'k' && target && target.type === 'r' && moveObj.sourceSquare[0] === 'e')
    if (castling && moveObj.targetSquare[0] === 'h') {
      if (chess.move('O-O')) {
        userMove(chess.fen())
      }
    }
    if (castling && moveObj.targetSquare[0] === 'a') {
      if (chess.move('O-O-O')) {
        userMove(chess.fen())
      }
    }

    if (chess.move({ from: moveObj.sourceSquare, to: moveObj.targetSquare })) {
      userMove(chess.fen())
    }
  }

  function userMove(fen) {
    setFEN(fen);
    scorePosition(fen, true)
  }

  function playResponse(fen) { // calls server with fen then calls lichessMove with one of the x responses
    axios.get('/getMoves', {
      params: {
        fen, moves: numMoves
      }
    })
      .then((res) => {
        let moves = res.data
        if (moves.length) {
          let randomMove = moves[Math.floor(Math.random() * moves.length)].san
          lichessMove(randomMove, fen)
        } else {
          console.log('Recieved no moves')
        }
      })
  }

  function scorePosition(fen, user) { // gets score from lichess API, if user exceeded tolerance stop play
    console.log('fen: ', fen)
    axios.get('/getScore', {
      params: {
        fen: enPassentFix(fen)
      }
    })
      .then((res) => {
        if (res.data === 'not found') {
          console.log('no cloud analysis found')
        }
        let score = res.data.pvs[0].cp
        let badMove = false;
        console.log('score: ', score / 100)
        if (user) {
          if ((score - currentScore) <= -tolerance) {
            badMove = true;
            setLearning(true)
            console.log(`!! went from ${currentScore / 100} to ${score / 100}, a difference of ${(currentScore - score) / 100}`)
          }
          if (!badMove) {
            playResponse(fen);
          }
        }
        setCurrentScore(score)
      })
  }

  function lichessMove(move, fen) {
    const chess = new Chess(fen);
    chess.move(move)
    setFEN(chess.fen())
    scorePosition(chess.fen(), false);
  }

  function enPassentFix(fen) { // lichess analysis API does not take the wiki-defined FEN notation, removing en-passent square fixes this.
    let split = fen.split(' ');
    split[3] = '-';
    return split.join(' ');
  }

  return (
    <div>
      <Chessboard position={FEN} onDrop={onDrop} />
    </div>
  )
}

export default App;