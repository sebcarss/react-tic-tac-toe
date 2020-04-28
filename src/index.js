import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// This is a function component, which is the same as creating a class as shown
// below but is less verbose.
function Square(props) {
  console.log("Square() -> " + JSON.stringify(props));
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  getSquareClassName(i) {
    let className = null;
    const winningLine = this.props.winningLine;

    if (winningLine.includes(i)) {
      className = "winning-square";
    } else {
      className = "square";
    }

    console.log("Board.getSquareClassName() -> " + className);
    return className;
  }

  renderSquare(i) {
    console.log("Board.renderSquare() -> " + i);
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={this.getSquareClassName(i)}
      />
    );
  }

  render() {
    console.log("Board.render() -> " + JSON.stringify(this.props));
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    console.log("Game.constructor() -> " + JSON.stringify(this.state));
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      winner: undefined,
    };
  }

  handleClick(i) {
    console.log(
      "Game.handleClick() -> " +
        JSON.stringify(this.state) +
        " & square clicked = " +
        i
    );

    // In React state needs to be treated as immutable, so to update the array we need
    // to create a new array and set the state to be this - we cannot alter the original
    // array.

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // slice creates a new mutable array

    // Stop the game when a winner is found and stop people from overwriting a previous turn
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    console.log("Game.jumpTo() -> " + JSON.stringify(this.state));
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    console.log("Game.render() -> " + JSON.stringify(this.state));
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Setup the time travel
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // Update status
    let status;
    let winningLine = Array(3).fill(null);
    if (winner) {
      status = "Player " + winner + " wins!";
      winningLine = calculateWinningLine(current.squares);
    } else if (this.state.stepNumber === 9) {
      status = "Game drawn";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winningLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinningLine(squares) {
  console.log("calculateWinningList() -> " + JSON.stringify(JSON));
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
}

function calculateWinner(squares) {
  console.log("calculateWinner() -> " + JSON.stringify(squares));
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
