var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var numberOfRows = 9;
// definitions
// a cell is the smallest entity.
// A grid is made of a maximum of 9*9=81 cells.
// A square is a "smaller grid" of only 9 cells.
// => A grid is made of 9 squares
////////////
/// CELL ///
////////////
var Cell = /** @class */ (function () {
    function Cell(xy, v) {
        if (!this.isInRange.apply(this, __spreadArray(__spreadArray([], xy, false), [v], false))) {
            throw new Error("Values passed to the constructor are outside of range");
        }
        this.coordinates = xy;
        this.value = v;
    }
    // Check if a set of numbers is within [1,9]
    Cell.prototype.isInRange = function () {
        var n = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            n[_i] = arguments[_i];
        }
        var result = true;
        for (var _a = 0, n_1 = n; _a < n_1.length; _a++) {
            var i = n_1[_a];
            if (i < 1 || i > numberOfRows) {
                result = false;
            }
        }
        return result;
    };
    // return the coordinates of the square in which the cell is
    Cell.prototype.squareCoordinates = function () {
        // this.coordinates.map((e) => Math.floor((e - 1) / 3) + 1); was nice but map doesn't preserve the type of the tuple...
        return [
            Math.floor((this.coordinates[0] - 1) / 3) + 1,
            Math.floor((this.coordinates[1] - 1) / 3) + 1,
        ];
    };
    Cell.prototype.areSquareCoordinatesIdentical = function (coord1) {
        var coord2 = this.squareCoordinates();
        return coord1[0] === coord2[0] && coord1[1] === coord2[1];
    };
    return Cell;
}());
////////////
/// GRID ///
////////////
var Grid = /** @class */ (function () {
    // Creates and empty array and then adds the first value
    function Grid(cell) {
        this.complete = false;
        this.values = [];
        this.addValue(cell);
    }
    // Method that adds a value to the current grid
    Grid.prototype.addValue = function (cell) {
        if (this.isThereADuplicate(cell)) {
            throw new Error("Duplicate value found.");
        }
        else {
            this.values.push(cell);
        }
    };
    // Method that checks if the value already exists on the row, the column, or the smaller square
    Grid.prototype.isThereADuplicate = function (cell) {
        return (this.isThereADuplicateInColumn(cell) ||
            this.isThereADuplicateInRow(cell) ||
            this.isThereADuplicateInSquare(cell));
    };
    Grid.prototype.isThereADuplicateInRow = function (cell) {
        var result = false;
        // We check on the row number (first value of cell coordinate) to see if the value already exists.
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.coordinates[0] === cell.coordinates[0]) {
                // then we check the value
                if (value.value === cell.value) {
                    result = true;
                }
            }
        }
        return result;
    };
    Grid.prototype.isThereADuplicateInColumn = function (cell) {
        var result = false;
        // We check on the row number (first value of cell coordinate) to see if the value already exists.
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.coordinates[1] === cell.coordinates[1]) {
                // then we check the value
                if (value.value === cell.value) {
                    result = true;
                }
            }
        }
        return result;
    };
    Grid.prototype.isThereADuplicateInSquare = function (cell) {
        var result = false;
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var aCell = _a[_i];
            // if we are in the same square
            if (aCell.areSquareCoordinatesIdentical(cell.squareCoordinates())) {
                if (aCell.value === cell.value) {
                    // and the values are the same, we return true;
                    result = true;
                }
            }
        }
        return result;
    };
    Grid.prototype.isComplete = function () {
        // for the grid to be complete, there should be 81 cells, and no duplicates.
        var result = false;
        if (this.values.length === numberOfRows * numberOfRows) {
            // we set result to true. And then we check for duplicates.
            var result = true;
            for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
                var value = _a[_i];
                if (this.isThereADuplicate(value)) {
                    result = false;
                }
            }
        }
        return result;
    };
    return Grid;
}());
