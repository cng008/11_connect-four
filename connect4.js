/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = [...Array(WIDTH)].fill(null).map(() => [...Array(HEIGHT)].fill(null));
  // board = [...Array(WIDTH)].fill(null).map(function () {
  //   return [...Array(HEIGHT)].fill(null);
  // })
};

/** makeHtmlBoard: make HTML table and row of column tops. */
makeHtmlBoard = () => {
  const htmlBoard = document.getElementById('board');

  // adds clickable area for dropping player pieces to column
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // creates main board based on set WIDTH x HEIGHT
  // creates a tr until the loop has iterated Y-times
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    // creates a td and appends it to the tr above, loops until itiration is equal to WIDTH
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */
findSpotForCol = x => {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] == null) {
      return y;
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */
placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
};

/** endGame: announce game end */
endGame = msg => {
  // pop up alert message
  alert(msg);
  // won't let anyone keep dropping .piece
  const top = document.getElementById('column-top');
  top.removeEventListener('click', handleClick);
};

/** handleClick: handle click of column top to play piece */
handleClick = e => {
  // get x from ID of clicked cell
  const x = +e.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer; // match cell to player
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    endGame(`Player ${currPlayer} is the winner! 🎉`);
  }

  // check for tie
  //if no cells are null, call endGame
  if (board[0].every(val => val !== null)) {
    return endGame(`It's a Tie! 🙀`);
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */
checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // calculates win possibilities
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

/*EXTRA*/
//START GAME ON BUTTON CLICK
// const startBtn = document.getElementById('startGame');
const startBtn = document.getElementById('startGame');
// const p1ColorInput = document.querySelector("input[name='p1-color']");
// const p2ColorInput = document.querySelector("input[name='p2-color']");
startBtn.addEventListener('click', startGame);

function startGame() {
  makeBoard();
  makeHtmlBoard();
  // p1ColorInput.value = p1;
  // p2ColorInput.value = p2;
  startBtn.style.display = 'none';
  restartBtn.style.display = 'inline';
}

// RESTART GAME BUTTON
const restartBtn = document.getElementById('restartGame');
restartBtn.addEventListener('click', restartGame);

function restartGame() {
  location.reload();
  // const board = document.getElementById('board');
  // board.innerHTML = '';
  // makeBoard();
  // makeHtmlBoard();
  // restartBtn.removeEventListener('click', restartGame);
}
