import React, { useState, useEffect } from 'react';
import { Chessboard } from 'chessboardjsx';

function App() {
  /* configurable metrics:
  1. number of top replies to consider picking a move from, e.g. pick one of the top 3 most frequent responses
  2. biggest drop in analysis standing to stop line
  */
  const [play, setPlay] = useState(''); // the list of moves played
  const [moves, setMoves] = useState(3); // the number of moves that can be picked from at random

  function onDrop(sourceSquare, targetSquare, piece) {
    let newPlay = play;
    //newPlay += sourceSquare + targetSquare

    // update play string
    // call getMove
    console.log('sourceSquare: ', sourceSquare);
    console.log('targetSquare: ', targetSquare);
    console.log('piece: ', piece);
  }

  function getMove() {
    // call server with play and moves then update board
  }

  function updateBoard() {
    // update position object
  }

  return (
    <div>
      <Chessboard position="start" onDrop={onDrop} />
    </div>
  )
}

export default App;