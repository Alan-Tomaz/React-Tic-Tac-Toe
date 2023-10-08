import { useEffect, useState } from 'react'
import './App.css'

function Board({ xIsNext, squares, onPlay }) {

  const [combination, setCombination] = useState(null);

  function handleClick(i) {

    if (squares[i] || calculateWinner(squares))
      return;

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }


  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    setCombination(winner.combinations);
    status = "Winner: " + winner.square;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function Square({ id, value, onSquareClick, combination }) {

    return (
      <button
        className="square"
        onClick={onSquareClick}
        style={{
          backgroundColor: combination != null
            ? combination.map(comb => comb == id)
              ? '#7FFF00'
              : 'transparent'
            : "transparent"
        }}
      >
        {value}
      </button>
    )
  }

  const rows = [];
  let buttons = [];

  for (let i = 0; i < 9; i++) {
    buttons.push(<Square key={i} id={i} value={squares[i]} onSquareClick={() => handleClick(i)} combination={combination} />)
    if ((i + 1) % 3 === 0) {
      rows.push(<div className="board-row" key={(i + 1) / 3}>{buttons.map(button => button)}</div>);
      buttons = [];
    }

  }


  return (
    <>
      <div className="status">{status}</div>
      {rows.map(row => row)}
    </>
  )
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState("Asc")
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move === 0 ? 'Go to game start' : `Go to Move #${move}`;

    return (
      <li key={move}>
        {move === currentMove
          ?
          <p>You are at move #{move}</p>
          :
          <button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    )
  })

  const sortedMoves = sort === 'Desc' ? moves.slice().reverse() : moves;


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={() => setSort("Asc")}>Asc</button>
          <button onClick={() => setSort("Desc")}>Desc</button>
        </div>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { square: squares[a], combinations: lines[i] };
    }
  }
  return null;
}