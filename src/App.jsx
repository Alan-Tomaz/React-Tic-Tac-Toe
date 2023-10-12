import { useEffect, useState } from 'react'
import './App.css'

function Board({ xIsNext, squares, onPlay, currentMovement }) {


  const [combination, setCombination] = useState([]);
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


  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setCombination(winner.combinations);
    } else {
      setCombination([]);
    }
  }, squares);

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.square;
  }
  else if (currentMovement == 9) {
    status = `Draw`;

  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function Square({ id, value, onSquareClick }) {

    return (
      <button
        className={`square ${combination[0] == id ? " winner" : combination[1] == id ? "winner" : combination[2] == id ? "winner" : ""}`}
        onClick={onSquareClick}
        id={`square-${id}`}
      >
        {value}
      </button>
    )
  }

  const rows = [];
  let buttons = [];

  for (let i = 0; i < 9; i++) {
    buttons.push(<Square key={i} id={i} value={squares[i]} onSquareClick={() => handleClick(i)} />)
    if ((i + 1) % 3 === 0) {
      rows.push(<div className="board-row" key={(i + 1) / 3}>{buttons.map(button => button)}</div>);
      buttons = [];
    }

  }


  return (
    <>
      <div className="status">{status}</div>
      <div className='board-grid'>
        {rows.map(row => row)}
      </div>
    </>
  )
}

export default function Game() {
  const [newMove, setNewMove] = useState([]);
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState("Asc")
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function getNewMove(newMove, oldMove) {
    for (let i = 0; i < oldMove.length; i++) {
      if (newMove[i] != oldMove[i]) {
        let moveY = 1;
        let moveX = 1;
        const index = i + 1;
        switch (index) {
          case 1:
            moveX = 1;
            moveY = 1
            break;
          case 2:
            moveX = 1;
            moveY = 2;
            break;
          case 3:
            moveX = 1;
            moveY = 3;
            break;
          case 4:
            moveX = 2;
            moveY = 1;
            break;
          case 5:
            moveX = 2;
            moveY = 2;
            break;
          case 6:
            moveX = 2;
            moveY = 3;
            break;
          case 7:
            moveX = 3;
            moveY = 1;
            break;
          case 8:
            moveX = 3;
            moveY = 2;
            break;
          case 9:
            moveX = 3;
            moveY = 3;
            break;
        }
        return `(Y:${moveY};X:${moveX})`;
      }

    }
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
    const historic = history[history.length - 2] != undefined ? history[history.length - 2] : history[history.length - 1];
    setNewMove([...newMove.slice(0, currentMove), getNewMove(nextSquares, history[currentMove])]);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move === 0 ? 'Go to game start' : `Go to Move #${move} ${newMove[move - 1]}`;

    return (
      <li key={move} className='move'>
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMovement={currentMove} />
      </div>
      <div className="game-info">
        <h1>Movements</h1>
        <div className='sort'>
          <button onClick={() => setSort("Asc")}>Asc</button>
          <button onClick={() => setSort("Desc")}>Desc</button>
        </div>
        <ol className='movements'>{sortedMoves}</ol>
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