import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// This is a function component, which is the same as creating a class as shown
// below but is less verbose.
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
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
  constructor() {
      super();
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true,
      };
  }

  handleClick(i) {
    console.log("Square clicked: " + i);
    // In React state needs to be treated as immutable, so to update the array we need
    // to create a new array and set the state to be this - we cannot alter the original
    // array. 

    // Below shows a succint way of doing this: 
    // slice() returns a new array with the values of the this.state.squares array
    // const squares = this.state.squares.slice();
    // // we can then change one of the values
    // squares[i] = this.state.xIsNext ? 'X' : 'O';
    // // and set the state to the new array
    // this.setState({
    //     squares: squares,
    //     xIsNext: !this.state.xIsNext,
    // });

    // Stop the game when a winner is found and stop people from overwriting a previous
    // turn
    if (calculateWinner(this.state.squares) || this.state.squares[i]) {
        return;
    }

    // Another longer way to do this is as follows:
    this.setState(state => {

        // Create a new array called squares from the values in this.state.squares
        const squares = state.squares.map((square, index) => {
            // map loops through the objects in the array, so create a function to 
            // be invoked immediately for each object in the array.

            if (index === i) {
                // When the index is the same as the number of the square clicked, 
                // set the square object to 'X' and return it to the map
                square = (this.state.xIsNext) ? 'X' : 'O';
            }
            
            // return all squares to be added to the new array
            return square;
        });

        // Return the new squares array to the setState function
        return {
            squares: squares,
            xIsNext: !this.state.xIsNext,
        };
        
    });

  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status; 
    if (winner) {
        status = "Player " + winner + " wins!";
    } else {
        status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
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
    this.state = {
        history: [{
            squares: Array(9).fill(null),
        }],
    }
  }
    
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
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
