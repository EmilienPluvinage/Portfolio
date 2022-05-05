const numberOfRows = 9;

// definitions
// a cell is the smallest entity.
// A grid is made of a maximum of 9*9=81 cells.
// A square is a "smaller grid" of only 9 cells.
// => A grid is made of 9 squares

////////////
/// CELL ///
////////////

class Cell {
  coordinates: [number, number];
  value: number;
  private disabled: boolean = false;
  constructor(xy: [number, number], v: number) {
    if (!this.isInRange(...xy, v)) {
      throw new Error("Values passed to the constructor are outside of range");
    }
    this.coordinates = xy;
    this.value = v;
  }
  // Check if a set of numbers is within [1,9]
  isInRange(...n: number[]) {
    let result = true;
    for (const i of n) {
      if (i < 0 || i > numberOfRows) {
        result = false;
      }
    }
    return result;
  }

  disable() {
    this.disabled = true;
  }

  // return the coordinates of the square in which the cell is
  squareCoordinates(): [number, number] {
    // this.coordinates.map((e) => Math.floor((e - 1) / 3) + 1); was nice but map doesn't preserve the type of the tuple...
    return [
      Math.floor((this.coordinates[0] - 1) / 3) + 1,
      Math.floor((this.coordinates[1] - 1) / 3) + 1,
    ];
  }

  areSquareCoordinatesIdentical(coord1: [number, number]) {
    const coord2 = this.squareCoordinates();
    return coord1[0] === coord2[0] && coord1[1] === coord2[1];
  }

  hasTheSameCoordinates(cell: Cell) {
    return (
      this.coordinates[0] === cell.coordinates[0] &&
      this.coordinates[1] === cell.coordinates[1]
    );
  }
}

////////////
/// GRID ///
////////////

class Grid {
  protected complete: boolean;
  protected values: Cell[];

  // Creates and empty array
  constructor() {
    this.complete = false;
    this.values = [];
  }

  // Method that adds a value to the current grid
  addValue(cell: Cell) {
    // we start by removing any pre-existing value
    this.removeValue(cell);

    if (this.isThereADuplicate(cell)) {
      throw new Error("Duplicate value found.");
    } else {
      this.values.push(cell);
    }
  }

  removeValue(cell: Cell) {
    var index = this.values.findIndex((c) => c.hasTheSameCoordinates(cell));
    if (index !== -1) {
      this.values.splice(index, 1);
    }
  }

  disableAll() {
    for (const value of this.values) {
      value.disable();
      (
        document.getElementById(
          value.coordinates[0] + "-" + value.coordinates[1]
        ) as HTMLInputElement
      ).disabled = true;
    }
  }

  // Method that checks if the value already exists on the row, the column, or the smaller square
  isThereADuplicate(cell: Cell) {
    return (
      this.isThereADuplicateInColumn(cell) ||
      this.isThereADuplicateInRow(cell) ||
      this.isThereADuplicateInSquare(cell)
    );
  }

  isThereADuplicateInRow(cell: Cell) {
    var result = false;
    // We check on the row number (first value of cell coordinate) to see if the value already exists.
    for (let value of this.values) {
      if (value.coordinates[0] === cell.coordinates[0]) {
        // then we check the value
        if (value.value === cell.value) {
          result = true;
        }
      }
    }
    return result;
  }

  isThereADuplicateInColumn(cell: Cell) {
    var result = false;
    // We check on the row number (first value of cell coordinate) to see if the value already exists.
    for (let value of this.values) {
      if (value.coordinates[1] === cell.coordinates[1]) {
        // then we check the value
        if (value.value === cell.value) {
          result = true;
        }
      }
    }
    return result;
  }

  isThereADuplicateInSquare(cell: Cell) {
    var result = false;
    for (let aCell of this.values) {
      // if we are in the same square
      if (aCell.areSquareCoordinatesIdentical(cell.squareCoordinates())) {
        if (aCell.value === cell.value) {
          // and the values are the same, we return true;
          result = true;
        }
      }
    }
    return result;
  }

  isComplete() {
    // for the grid to be complete, there should be 81 cells, and no duplicates.
    var result = false;
    if (this.values.length === numberOfRows * numberOfRows) {
      // we set result to true. And then we check for duplicates.
      var result = true;
      for (const value of this.values) {
        if (this.isThereADuplicate(value)) {
          result = false;
        }
      }
    }
    this.complete = result;
    return result;
  }

  updateDisplay() {
    var cell: Cell | undefined;
    var input: HTMLInputElement | null;
    for (let i = 1; i <= numberOfRows; i++) {
      for (let j = 1; j <= numberOfRows; j++) {
        cell = this.values.find(
          (c) => c.coordinates[0] === i && c.coordinates[1] === j
        );
        if (cell) {
          input = document.getElementById(
            cell.coordinates[0] + "-" + cell.coordinates[1]
          ) as HTMLInputElement;
          if (input) {
            input.value = cell.value.toString();
          }
        }
      }
    }
  }
}

/////////////////////
/// SOLVABLE GRID ///
/////////////////////

class SolvableGrid extends Grid {
  constructor() {
    super();
  }

  solveOne() {
    // we go through all the rows
    var found = false;
    loop: for (let i = 1; i <= numberOfRows; i++) {
      if (this.solveRowColumn(i, true)) {
        found = true;
        break loop;
      }
    }
    if (!found) {
      // we go through all the columns
      loop: for (let i = 1; i <= numberOfRows; i++) {
        if (this.solveRowColumn(i, false)) {
          found = true;
          break loop;
        }
      }
    }

    if (!found) {
      // we go through all the squares
      loop: for (let i = 1; i <= numberOfRows / 3; i++) {
        loop2: for (let j = 1; j <= numberOfRows / 3; j++) {
          if (this.solveSquare(i, j)) {
            found = true;
            break loop;
            break loop2;
          }
        }
      }
    }

    if (!found) {
      // we go through all the values
      loop: for (let i = 1; i <= numberOfRows; i++) {
        if (this.solveValue(i)) {
          found = true;
          break loop;
        }
      }
    }
  }

  solveSquare(i: number, j: number) {
    // we check the cells  i*3-2, i*3-1, i*3
    const starter: Cell[] = [];
    // cells in the square
    const cells = this.values.reduce(
      (acc, item) =>
        item.coordinates[0] >= i * 3 - 2 &&
        item.coordinates[0] <= i * 3 &&
        item.coordinates[1] >= j * 3 - 2 &&
        item.coordinates[1] <= j * 3
          ? acc.concat([item])
          : acc,
      starter
    );
    if (cells.length === numberOfRows - 1) {
      // then we can complete it
      // we need to find the coordinates
      var index = 0;
      var value = 0;
      for (let x = i * 3 - 2; x <= i * 3; x++) {
        for (let y = j * 3 - 2; y <= j * 3; y++) {
          index = cells.findIndex(
            (c) => c.coordinates[0] === x && c.coordinates[1] === y
          );
          if (index === -1) {
            // it means x and y are our coordinates
            // we loop from 1 to 9 and check which one would not result in a duplicate in our square
            value = 0;
            for (let k = 1; k <= numberOfRows; k++) {
              if (!this.isThereADuplicateInSquare(new Cell([x, y], k))) {
                value = k;
              }
            }
            this.addValue(new Cell([x, y], value));
            this.updateDisplay();
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }

  solveRowColumn(n: number, row: boolean) {
    var x = row === true ? 0 : 1;
    var y = row === true ? 1 : 0;
    // check row n and see if there is one missing value
    const starter: Cell[] = [];
    const cells = this.values.reduce(
      (acc, item) => (item.coordinates[x] === n ? acc.concat([item]) : acc),
      starter
    );
    if (cells.length === numberOfRows - 1) {
      // we add the missing value
      var index = 0;
      var value = 0;
      // first we look for the missing value
      for (let i = 1; i <= numberOfRows; i++) {
        index = cells.findIndex((c) => c.value === i);
        if (index === -1) {
          value = i;
        }
      }
      // then look for the empty columnn number
      index = 0;
      var column = 0;
      for (let i = 1; i <= numberOfRows; i++) {
        index = cells.findIndex((c) => c.coordinates[y] === i);
        if (index === -1) {
          column = i;
        }
      }
      // finally we add our new value
      if (row === true) {
        this.addValue(new Cell([n, column], value));
      } else {
        this.addValue(new Cell([column, n], value));
      }

      // and we update the display
      this.updateDisplay();

      return true;
    } else {
      return false;
    }
  }

  solveValue(n: number) {
    for (let i = 1; i <= numberOfRows / 3; i++) {
      for (let j = 1; j <= numberOfRows / 3; j++) {
        if (this.solveValueInSquare(n, [i, j])) {
          return true;
        }
      }
    }
    return false;
  }

  solveValueInSquare(n: number, coord: [number, number]) {
    const [i, j] = coord;

    // we get all the empty cells from the square

    var emptyCells: Cell[] = [];
    var index = 0;
    for (let x = i * 3 - 2; x <= i * 3; x++) {
      for (let y = j * 3 - 2; y <= j * 3; y++) {
        index = this.values.findIndex(
          (c) => c.coordinates[0] === x && c.coordinates[1] === y
        );
        if (index === -1) {
          // then it's an empty cell

          emptyCells.push(new Cell([x, y], n));
        }
      }
    }

    var potentialCells: Cell[] = [];
    // now, out of all the empty cells, we need to get all the cells for which could receive number n.
    // if it's only one, then we can solve this one.
    emptyCells.forEach((cell) => {
      if (
        !this.isThereADuplicateInColumn(cell) &&
        !this.isThereADuplicateInRow(cell) &&
        !this.isThereADuplicateInSquare(cell)
      ) {
        potentialCells.push(cell);
      }
    });

    if (potentialCells.length === 1) {
      this.addValue(potentialCells[0]);
      this.updateDisplay();
      return true;
    }

    return false;
  }
}
/////////////////////
///   FUNCTIONS   ///
/////////////////////

function displayInputs() {
  const grid = document.getElementById("grid");
  var inputs = "";
  for (let i = 1; i <= numberOfRows; i++) {
    inputs += "<div>";
    for (let j = 1; j <= numberOfRows; j++) {
      inputs += `<input onchange="update(+this.value, this.id.split('-').map((e)=> +e));" type="number" id="${i}-${j}" />`;
    }
    inputs += "</div>";
  }
  if (grid) grid.innerHTML = inputs;
}

const sudoku = new SolvableGrid();

function update(value: number, id: [number, number]) {
  const cell = new Cell(id, value);
  if (value !== 0) {
    sudoku.addValue(cell);
  } else {
    sudoku.removeValue(cell);
  }
  console.log(sudoku);
  if (sudoku.isComplete()) alert("Gagné");
}

function start(button: HTMLButtonElement) {
  // function whose point is to go through the grid and disable all values since we now start the game
  // and we don't want the player to modify the "template"
  sudoku.disableAll();
  button.disabled = true;
}

function solveOne() {
  sudoku.solveOne();
  console.log(sudoku);
}

displayInputs();
