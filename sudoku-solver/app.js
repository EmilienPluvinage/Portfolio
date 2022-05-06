var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        this.disabled = false;
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
            if (i < 0 || i > numberOfRows) {
                result = false;
            }
        }
        return result;
    };
    Cell.prototype.disable = function () {
        this.disabled = true;
        document.getElementById(this.coordinates[0] + "-" + this.coordinates[1]).disabled = true;
    };
    Cell.prototype.save = function (name) {
        localStorage.setItem(name + "-coordinates", JSON.stringify(this.coordinates));
        localStorage.setItem(name + "-value", this.value.toString());
        localStorage.setItem(name + "-disabled", this.disabled.toString());
    };
    Cell.prototype.load = function (name) {
        var storedCoordinates = localStorage.getItem("".concat(name, "-coordinates"));
        var disabled = localStorage.getItem("".concat(name, "-disabled")) === "true";
        if (storedCoordinates) {
            this.coordinates = JSON.parse(storedCoordinates);
        }
        var storedValue = localStorage.getItem("".concat(name, "-value"));
        if (storedValue) {
            this.value = +storedValue;
        }
        if (disabled) {
            this.disable();
        }
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
    Cell.prototype.hasTheSameCoordinates = function (cell) {
        return (this.coordinates[0] === cell.coordinates[0] &&
            this.coordinates[1] === cell.coordinates[1]);
    };
    return Cell;
}());
////////////
/// GRID ///
////////////
var Grid = /** @class */ (function () {
    // Creates and empty array
    function Grid() {
        this.complete = false;
        this.values = [];
    }
    // Method that adds a value to the current grid
    Grid.prototype.addValue = function (cell) {
        // we start by removing any pre-existing value
        this.removeValue(cell);
        if (this.isThereADuplicate(cell)) {
            throw new Error("Duplicate value found.");
        }
        else {
            this.values.push(cell);
        }
    };
    Grid.prototype.removeValue = function (cell) {
        var index = this.values.findIndex(function (c) { return c.hasTheSameCoordinates(cell); });
        if (index !== -1) {
            this.values.splice(index, 1);
        }
    };
    Grid.prototype.disableAll = function () {
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var value = _a[_i];
            value.disable();
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
        this.complete = result;
        return result;
    };
    Grid.prototype.updateDisplay = function () {
        var cell;
        var input;
        var _loop_1 = function (i) {
            var _loop_2 = function (j) {
                cell = this_1.values.find(function (c) { return c.coordinates[0] === i && c.coordinates[1] === j; });
                if (cell) {
                    input = document.getElementById(cell.coordinates[0] + "-" + cell.coordinates[1]);
                    if (input) {
                        input.value = cell.value.toString();
                    }
                }
            };
            for (var j = 1; j <= numberOfRows; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 1; i <= numberOfRows; i++) {
            _loop_1(i);
        }
    };
    Grid.prototype.save = function () {
        for (var i = 0; i < this.values.length; i++) {
            this.values[i].save(i.toString());
        }
        localStorage.setItem("complete", this.complete.toString());
        localStorage.setItem("length", this.values.length.toString());
    };
    Grid.prototype.load = function () {
        var length = localStorage.getItem("length");
        var cell;
        if (length) {
            this.complete = localStorage.getItem("complete") === "true";
            this.values = [];
            for (var i = 0; i < +length; i++) {
                cell = new Cell([0, 0], 0);
                cell.load(i.toString());
                this.values.push(cell);
            }
        }
    };
    return Grid;
}());
/////////////////////
/// SOLVABLE GRID ///
/////////////////////
var SolvableGrid = /** @class */ (function (_super) {
    __extends(SolvableGrid, _super);
    function SolvableGrid() {
        return _super.call(this) || this;
    }
    SolvableGrid.prototype.solveOne = function () {
        // we go through all the rows
        var found = false;
        loop: for (var i = 1; i <= numberOfRows; i++) {
            if (this.solveRowColumn(i, true)) {
                found = true;
                break loop;
            }
        }
        if (!found) {
            // we go through all the columns
            loop: for (var i = 1; i <= numberOfRows; i++) {
                if (this.solveRowColumn(i, false)) {
                    found = true;
                    break loop;
                }
            }
        }
        if (!found) {
            // we go through all the squares
            loop: for (var i = 1; i <= numberOfRows / 3; i++) {
                loop2: for (var j = 1; j <= numberOfRows / 3; j++) {
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
            loop: for (var i = 1; i <= numberOfRows; i++) {
                if (this.solveValue(i)) {
                    found = true;
                    break loop;
                }
            }
        }
        return found;
    };
    SolvableGrid.prototype.solveSquare = function (i, j) {
        // we check the cells  i*3-2, i*3-1, i*3
        var starter = [];
        // cells in the square
        var cells = this.values.reduce(function (acc, item) {
            return item.coordinates[0] >= i * 3 - 2 &&
                item.coordinates[0] <= i * 3 &&
                item.coordinates[1] >= j * 3 - 2 &&
                item.coordinates[1] <= j * 3
                ? acc.concat([item])
                : acc;
        }, starter);
        if (cells.length === numberOfRows - 1) {
            // then we can complete it
            // we need to find the coordinates
            var index = 0;
            var value = 0;
            var _loop_3 = function (x) {
                var _loop_4 = function (y) {
                    index = cells.findIndex(function (c) { return c.coordinates[0] === x && c.coordinates[1] === y; });
                    if (index === -1) {
                        // it means x and y are our coordinates
                        // we loop from 1 to 9 and check which one would not result in a duplicate in our square
                        value = 0;
                        for (var k = 1; k <= numberOfRows; k++) {
                            if (!this_2.isThereADuplicateInSquare(new Cell([x, y], k))) {
                                value = k;
                            }
                        }
                        this_2.addValue(new Cell([x, y], value));
                        this_2.updateDisplay();
                    }
                };
                for (var y = j * 3 - 2; y <= j * 3; y++) {
                    _loop_4(y);
                }
            };
            var this_2 = this;
            for (var x = i * 3 - 2; x <= i * 3; x++) {
                _loop_3(x);
            }
            return true;
        }
        else {
            return false;
        }
    };
    SolvableGrid.prototype.solveRowColumn = function (n, row, power) {
        if (power === void 0) { power = 1; }
        var x = row === true ? 0 : 1;
        var y = row === true ? 1 : 0;
        // check row n and see if there is one missing value
        var starter = [];
        var cells = this.values.reduce(function (acc, item) { return (item.coordinates[x] === n ? acc.concat([item]) : acc); }, starter);
        //
        if (cells.length === numberOfRows - 1) {
            // we add the missing value
            var index = 0;
            var value = 0;
            var _loop_5 = function (i) {
                index = cells.findIndex(function (c) { return c.value === i; });
                if (index === -1) {
                    value = i;
                }
            };
            // first we look for the missing value
            for (var i = 1; i <= numberOfRows; i++) {
                _loop_5(i);
            }
            // then look for the empty columnn number
            index = 0;
            var column = 0;
            var _loop_6 = function (i) {
                index = cells.findIndex(function (c) { return c.coordinates[y] === i; });
                if (index === -1) {
                    column = i;
                }
            };
            for (var i = 1; i <= numberOfRows; i++) {
                _loop_6(i);
            }
            // finally we add our new value
            if (row === true) {
                this.addValue(new Cell([n, column], value));
            }
            else {
                this.addValue(new Cell([column, n], value));
            }
            // and we update the display
            this.updateDisplay();
            return true;
        }
        else {
            return false;
        }
    };
    SolvableGrid.prototype.solveValue = function (n) {
        for (var i = 1; i <= numberOfRows / 3; i++) {
            for (var j = 1; j <= numberOfRows / 3; j++) {
                if (this.solveValueInSquare(n, [i, j])) {
                    return true;
                }
            }
        }
        return false;
    };
    SolvableGrid.prototype.solveValueInSquare = function (n, coord) {
        var _this = this;
        var i = coord[0], j = coord[1];
        // we get all the empty cells from the square
        var emptyCells = [];
        var index = 0;
        var _loop_7 = function (x) {
            var _loop_8 = function (y) {
                index = this_3.values.findIndex(function (c) { return c.coordinates[0] === x && c.coordinates[1] === y; });
                if (index === -1) {
                    // then it's an empty cell
                    emptyCells.push(new Cell([x, y], n));
                }
            };
            for (var y = j * 3 - 2; y <= j * 3; y++) {
                _loop_8(y);
            }
        };
        var this_3 = this;
        for (var x = i * 3 - 2; x <= i * 3; x++) {
            _loop_7(x);
        }
        var potentialCells = [];
        // now, out of all the empty cells, we need to get all the cells for which could receive number n.
        // if it's only one, then we can solve this one.
        emptyCells.forEach(function (cell) {
            if (!_this.isThereADuplicateInColumn(cell) &&
                !_this.isThereADuplicateInRow(cell) &&
                !_this.isThereADuplicateInSquare(cell)) {
                potentialCells.push(cell);
            }
        });
        if (potentialCells.length === 1) {
            this.addValue(potentialCells[0]);
            this.updateDisplay();
            return true;
        }
        return false;
    };
    return SolvableGrid;
}(Grid));
/////////////////////
///   FUNCTIONS   ///
/////////////////////
function displayInputs() {
    var grid = document.getElementById("grid");
    var inputs = "";
    for (var i = 1; i <= numberOfRows; i++) {
        inputs += "<div>";
        for (var j = 1; j <= numberOfRows; j++) {
            inputs += "<input onchange=\"update(+this.value, this.id.split('-').map((e)=> +e));\" type=\"number\" id=\"".concat(i, "-").concat(j, "\" />");
        }
        inputs += "</div>";
    }
    if (grid)
        grid.innerHTML = inputs;
}
var sudoku = new SolvableGrid();
function update(value, id) {
    var cell = new Cell(id, value);
    if (value !== 0) {
        sudoku.addValue(cell);
    }
    else {
        sudoku.removeValue(cell);
    }
    console.log(sudoku);
    if (sudoku.isComplete())
        alert("Gagné");
}
function start(button) {
    // function whose point is to go through the grid and disable all values since we now start the game
    // and we don't want the player to modify the "template"
    sudoku.disableAll();
    button.disabled = true;
}
function solveOne() {
    sudoku.solveOne();
    console.log(sudoku);
}
function solveGrid(grid) {
    // start by solving the grid with "level 1" technics, for as long as we can
    while (grid.solveOne()) { }
    grid.updateDisplay();
}
function save() {
    sudoku.save();
}
function reload() {
    displayInputs();
    sudoku.load();
    sudoku.updateDisplay();
}
displayInputs();
