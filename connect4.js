/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
//prettier-ignore
class Game {
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.HEIGHT = 6;
    this.WIDTH = 7;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *  board = array of rows, each row is array of cells  (board[y][x]) */
  makeBoard() {
    // this.board = []; // not needed
    // set "board" to empty HEIGHT x WIDTH matrix array
    // array of rows, each row is array of cells  (board[y][x])
    this.board = [...Array(this.WIDTH)].fill(null).map(() => [...Array(this.HEIGHT)].fill(null));
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');
    // board.innerHTML = ''; //to prevent multiple boards if no restart btn

    // CLICKABLE AREA for dropping player pieces to column
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // store a reference to the handleClick bound function
    // so that we can remove the event listener correctly later
    this.handleDropPiece = this.handleClick.bind(this);
    top.addEventListener('click', this.handleDropPiece);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // creates main board based on set WIDTH x HEIGHT
    // creates a tr until the loop has iterated Y-times
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
      // creates a td and appends it to the tr above, loops until itiration is equal to WIDTH
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (this.board[y][x] == null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    // make a div and insert into correct table cell
    const piece = document.createElement('div');
    piece.classList.add('piece');

    // SET PLAYER COLORS FROM COLOR SELECTION FORM
    piece.style.backgroundColor = this.currPlayer.color; //sets selected color as .piece bg color

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    // pop up alert message
    setTimeout(() => alert(msg), 400);

    // won't let anyone keep dropping .piece
    const top = document.getElementById('column-top');
    top.removeEventListener('click', this.handleDropPiece);

    // changes Reset Game button to Play Again
    document.getElementById('restartGame').innerText = 'Play Again!';
    document.getElementById('restartGame').style.fontSize = '50px';
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(e) {
    // get x from ID of clicked cell
    const x = +e.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer; // match cell to player
    this.placeInTable(y, x);

    // CHECK FOR WIN
    if (this.checkForWin()) {
      const arrow = document.getElementById('whose-turn');

      if (this.currPlayer === this.players[0]) {
        this.endGame(`Player 1 is the winner! 🎉`);
        document.getElementById('whose-turn').innerHTML = '🏆'; // arrow changes to trophy for winner
        return (arrow.style.textAlign = 'left');
      } else {
        this.endGame(`Player 2 is the winner! 🎉`);
        document.getElementById('whose-turn').innerHTML = '🏆';
        return (arrow.style.textAlign = 'right');
      }
    }

    // CHECK FOR TIE
    // if no cells are null, call endGame
    // checks top row to see if any are not null
    if (this.board[0].every(cell => cell !== null)) {
      this.endGame(`It's a Tie! 🙀`);
      document.getElementById('whose-turn').innerHTML = ' '; // no one gets a trophy
    }

    // SWITCH PLAYERS
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    // currPlayer = currPlayer === 1 ? 2 : 1;
    this.switchPlayer();
  }

  // INDICATE WHOSE TURN IT IS ^
  switchPlayer() {
    const arrow = document.getElementById('whose-turn');

    if (this.currPlayer === this.players[0]) {
      arrow.style.textAlign = 'left';
      arrow.style.color = document.getElementById('p1-color').value;
    } else {
      arrow.style.textAlign = 'right';
      arrow.style.color = document.getElementById('p2-color').value;
    }
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    // Checks four cells to see if they're all color of current player
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );

    // calculates win possibilities
    //  - cells: list of four (y, x) cells
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        let vert = [[y, x], [y + 1, x],  [y + 2, x], [y + 3, x]];
        let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]
        ];

        //  - returns true if all are legal coordinates & all match currPlayer
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

/*EXTRA*/

//START GAME ON BUTTON CLICK
const form = document.getElementById('pick-color');
form.addEventListener('submit', e => {
  e.preventDefault();
  viewPlayers();
  form.style.display = 'none';
  restartBtn.style.display = 'inline';
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
});

// RESTART GAME BUTTON
const restartBtn = document.getElementById('restartGame');
restartBtn.addEventListener('click', () => {
  location.reload();
});

//SHOW PLAYER NAMES AND COLORS
viewPlayers = () => {
  // adds text
  const players = document.getElementById('players');
  const p1 = document.createElement('p');
  const p2 = document.createElement('p');
  p1.textContent = 'Player 1';
  p2.textContent = 'Player 2';
  players.append(p1, p2);

  // match player to color they picked
  p1.style.color = document.getElementById('p1-color').value;
  p2.style.color = document.getElementById('p2-color').value;

  // add ^ arrow to indicate whose turn
  const turn = document.getElementById('whose-turn');
  turn.style.color = document.getElementById('p1-color').value;
  turn.innerText = '^';
};

//ANIMATE TEXT
randomRGB = () => {
  const r = Math.floor(Math.random() * 256); //put 256 to include 255 bc this will give a num between 0, 254.999~
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};
// change h1 color onmouseover (index.html ln:12)
changeColor = obj => (obj.style.color = randomRGB());
