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
      if (i < 1 || i > numberOfRows) {
        result = false;
      }
    }
    return result;
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
}

////////////
/// GRID ///
////////////

class Grid {
  complete: boolean = false;
  values: Cell[];

  // Creates and empty array and then adds the first value
  constructor(cell: Cell) {
    this.values = [];
    this.addValue(cell);
  }

  // Method that adds a value to the current grid
  addValue(cell: Cell) {
    if (this.isThereADuplicate(cell)) {
      throw new Error("Duplicate value found.");
    } else {
      this.values.push(cell);
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
    return result;
  }
}
