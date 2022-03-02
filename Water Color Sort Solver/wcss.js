let btn = document.getElementById("button");
let plus = document.getElementById("plus");
let minus = document.getElementById("minus");
let message = document.getElementById("message");
let numberOfFlasks = 4;
let numberOfColors = numberOfFlasks - 1; // + white
let globalWon = false;
let iter = 0;
let maxIter = 2000;
let listOfMoves = new Array();
let nIntervId;
let allColors = [
  "white",
  "gold",
  "hotpink",
  "lightgreen",
  "darkcyan",
  "mediumblue",
  "darkslategray",
  "mediumpurple",
  "red",
  "darkorange",
  "antiquewhite",
  "saddlebrown",
  "deepskyblue",
  "forestgreen",
  "indigo",
  "lightcoral",
];
let minFlasks = 3;
let maxFlasks = allColors.length;
// we start with 4 flasks, we'll change it later
let data = new Array(numberOfFlasks);
let savedData = new Array(numberOfFlasks);
let savedNumberOfFlasks = numberOfFlasks;
let data2 = new Array();
let colors = allColors.slice(0, numberOfColors + 1);

init();

btn.addEventListener("click", function (e) {
  e.preventDefault;
  btn.disabled = true;
  removesWhiteInTheMiddle(3);
  if (checkNumberOfEachColor()) {
    message.innerText = "Starting to resolve...";
    getData();
    globalWon = false;
    iter = 0;
    var start = Date.now();
    solve(data, []);
    var end = Date.now();
    var time = (end - start) / 1000;
    if (globalWon == true) {
      message.innerText = "Solution found in " + time + " seconds.";
      nIntervId = setInterval(walkThrough, 1000);
    } else {
      message.innerText = "Solution could not be found.";
    }
  } else {
    message.innerText =
      "Not the right number of blocks for each color (either 0 or 4).";

    btn.disabled = false;
  }
});

plus.addEventListener("click", function (e) {
  e.preventDefault;
  addOneFlask();
});

minus.addEventListener("click", function (e) {
  e.preventDefault;
  removeOneFlask();
});

document.getElementById("save").addEventListener("click", function (e) {
  e.preventDefault;
  saveGame();
});

document.getElementById("reload").addEventListener("click", function (e) {
  e.preventDefault;
  reloadGame();
});

function saveGame() {
  getData();
  // savedNumberOfFlasks = numberOfFlasks;
  // savedData = [];
  // copyArray(data, savedData);
  localStorage.setItem("save", JSON.stringify(data));
  localStorage.setItem("numberOfFlasks", numberOfFlasks);
  message.innerText = "Game saved.";
}

function reloadGame() {
  // we're going for a simple version of this one and assume that if the number of flasks has changed since the save, we can't reload it
  var savedNumberOfFlasks = localStorage.getItem("numberOfFlasks");
  if (numberOfFlasks == savedNumberOfFlasks) {
    // data = [];
    // copyArray(savedData, data);
    data = JSON.parse(localStorage.getItem("save"));
    display();
    message.innerText = "Game reloaded.";
  } else {
    message.innerText =
      "Your game had " +
      savedNumberOfFlasks +
      " flasks. \n Try changing the number of flasks before reloading.";
  }
}

function addOneFlask() {
  savedData = [];
  if (numberOfFlasks < maxFlasks) {
    numberOfFlasks++;
    numberOfColors++;
    data = new Array(numberOfFlasks);
    colors = allColors.slice(0, numberOfColors + 1);
    // we add one empty flask on the right
    var parent = document.getElementById("flasks");
    var id = numberOfFlasks - 1;
    parent.innerHTML +=
      '<table id="flask' +
      id +
      '" class="flask"><tr><td style="background-color: white;"></td></tr><tr><td style="background-color: white;"></td></tr><tr><td style="background-color: white;"></td></tr><tr><td style="background-color: white;"></td></tr></table>';
    init();
  }
}

function removesWhiteInTheMiddle(iteration) {
  // we tend to run iteration = 3 because they are 4 levels in each flask (so potentially 3 blanks below one color)
  for (let x = 0; x <= iteration; x++) {
    var previousColor = "white";
    var previousCell = null;
    // if there's a white cell with color above, it moves the color down
    for (let i = 0; i < data.length; i++) {
      var table = document.getElementById("flask" + i);
      previousColor = "white";
      for (let x in table.rows) {
        let row = table.rows[x];
        //iterate through rows
        for (let y in row.cells) {
          //iterate through columns
          let col = row.cells[y];
          if (col?.style?.backgroundColor != null) {
            if (
              col?.style?.backgroundColor == "white" &&
              previousColor != "white"
            ) {
              previousCell.style.backgroundColor = col.style.backgroundColor;
              col.style.backgroundColor = previousColor;
            }
            previousColor = col.style.backgroundColor;
            previousCell = col;
          }
        }
      }
    }
  }
}

function checkNumberOfEachColor() {
  // the point of this function is to check whether there is either 0 or 4 blocks of each colour
  // otherwise the puzzle cannot be solved
  // returns true or false
  var numberOfColors = new Array(colors.length).fill(0);
  var check = true;
  for (let i = 0; i < data.length; i++) {
    var table = document.getElementById("flask" + i);
    for (let x in table.rows) {
      let row = table.rows[x];
      //iterate through rows
      for (let y in row.cells) {
        //iterate through columns
        let col = row.cells[y];
        if (col?.style?.backgroundColor != null) {
          numberOfColors[colors.indexOf(col.style.backgroundColor)]++;
        }
      }
    }
  }
  // we know want to check that there are only 0s and 4s in this table, apart from the whites which we don't care about
  numberOfColors.shift();
  for (let i = 0; i < numberOfColors.length; i++) {
    if (numberOfColors[i] != 0 && numberOfColors[i] != 4) {
      check = false;
    }
  }
  return check;
}

function removeOneFlask() {
  savedData = [];
  if (numberOfFlasks > minFlasks) {
    var removedColor = colors[colors.length - 1];
    numberOfFlasks--;
    numberOfColors--;
    data = new Array(numberOfFlasks);
    colors = allColors.slice(0, numberOfColors + 1);
    // we remove the flask on the right
    var element = document.getElementById("flask" + numberOfFlasks);
    element.parentNode.removeChild(element);
    // we also need to go through all the flask to remove the last color
    for (let i = 0; i < data.length; i++) {
      var table = document.getElementById("flask" + i);
      for (let x in table.rows) {
        let row = table.rows[x];
        //iterate through rows
        for (let y in row.cells) {
          //iterate through columns
          let col = row.cells[y];
          if (col?.style?.backgroundColor == removedColor) {
            col.style.backgroundColor = colors[colors.length - 1];
          }
        }
      }
    }
  }
}

function getData() {
  // look at the colors in the flasks and put them in a array so that we can work
  for (let i = 0; i < data.length; i++) {
    var table = document.getElementById("flask" + i);
    data[i] = new Array(4);
    for (let x in table.rows) {
      let row = table.rows[x];
      //iterate through rows
      for (let y in row.cells) {
        //iterate through columns
        let col = row.cells[y];
        if (col?.style?.backgroundColor != null) {
          data[i][x] = col?.style?.backgroundColor;
        }
      }
    }
  }
}

function init() {
  for (let i = 0; i < data.length; i++) {
    var table = document.getElementById("flask" + i);
    for (let x in table.rows) {
      let row = table.rows[x];
      //iterate through rows
      for (let y in row.cells) {
        //iterate through columns
        let col = row.cells[y];
        if (col?.style?.backgroundColor != null) {
          col?.addEventListener("click", function (e) {
            let currentColor = col?.style?.backgroundColor;
            let index =
              (colors.indexOf(currentColor) + 1) % (numberOfColors + 1);
            col.style.backgroundColor = colors[index];
          });
        }
      }
    }
  }
}

function display() {
  // display the content of data
  for (let i = 0; i < data.length; i++) {
    var table = document.getElementById("flask" + i);
    for (let x in table.rows) {
      let row = table.rows[x];
      //iterate through rows
      for (let y in row.cells) {
        //iterate through columns
        let col = row.cells[y];
        if (col?.style?.backgroundColor != null) {
          col.style.backgroundColor = data[i][x];
        }
      }
    }
  }
}

function walkThrough() {
  // check that listOfMoves isn't empty. if it is we stop the walk through
  if (listOfMoves.length > 0) {
    // then we take the first move, do it, display it, and update list of moves
    // get i and j with RegExp. ListOfMoves[0] looks like (i=>j)
    coordinates = listOfMoves.shift();
    var match = coordinates.match(/^\(([0-9]*)=>([0-9]*)\)$/);
    i = match[1];
    j = match[2];

    move(data, i, j);
    display();
  } else {
    clearInterval(nIntervId);
    nIntervId = null;
    btn.disabled = false;
  }
}

function solve(varData, varMoves) {
  iter++;
  // find a way to make sure we don't fall into infinite loop, mostly because of the empty flasks.
  // So far I've disabled moving things into an empty flask for now
  if (iter <= maxIter) {
    if (!hasLost(varData) && !hasWon(varData) && !globalWon) {
      var tempData = new Array();
      var tempMoves = new Array();

      // we loop on the flasks i, for each flask i we loop on the flasks j and check canMove, if so, we do.
      search: for (let i = 0; i < varData.length; i++) {
        for (let j = 0; j < varData.length; j++) {
          if (globalWon) break search;
          if (canMove(varData, i, j)) {
            // we do one final check to make sure we're not doing the opposite move from previous one
            if (varMoves.length > 0) {
              // if it's not the first move
              var lastMove = varMoves[varMoves.length - 1];
              var match = lastMove.match(/^\(([0-9]*)=>([0-9]*)\)$/);
              x = match[1];
              y = match[2];
            } else {
              x = 0;
              y = 0;
            }

            if (i != y || j != x || varMoves.length == 0) {
              // as soon as we can move, we do it, and resolve the new array
              tempData = [];
              copyArray(varData, tempData);
              move(tempData, i, j);
              tempMoves = varMoves.slice(0);
              tempMoves.push("(" + i + "=>" + j + ")");
              solve(tempData, tempMoves);
            }
          }
        }
      }
    } else if (hasWon(varData)) {
      globalWon = true;
      listOfMoves = varMoves.slice(0);
    }
  }
}

function hasWon(tempData) {
  // tell you whether the solve function has won, returns true/false
  let won = true;
  search: for (let i = 0; i < tempData.length; i++) {
    let color = tempData[i][0];
    for (let j = 0; j < 4; j++) {
      if (tempData[i][j] != color) {
        won = false;
        break search;
      }
      color = tempData[i][j];
    }
  }
  return won;
}

function hasLost(tempData) {
  // tell you whether the solve function has lost, returns true/false
  // for each flask, we check whether we can move its top content somewhere else
  var movePossible = false;
  searchMove: for (let i = 0; i < tempData.length; i++) {
    for (let j = 0; j < tempData.length; j++) {
      if (i != j) {
        if (canMove(tempData, i, j)) {
          movePossible = true;
          break searchMove;
        }
      }
    }
  }
  return !movePossible;
}

function topColor(tempData, i) {
  // returns the topColor of flask number i, and how many levels of that color there are
  let color = "white";
  let height = 0;
  for (let j = 3; j >= 0; j--) {
    if (tempData[i][j] != "white") {
      if (tempData[i][j] == color) {
        height++;
      } else {
        height = 1;
      }
      color = tempData[i][j];
    }
  }
  return [color, height];
}

function canMove(tempData, i, j) {
  // check whether we can move the content of flask i into flask j and returns true/false
  movePossible = false;
  if (i != j) {
    topColori = topColor(tempData, i);
    topColorj = topColor(tempData, j);
    // first, either they have the same top color or J is empty and there's at least 2 colors in i
    if (topColori[0] != "white") {
      if (
        topColori[0] == topColorj[0] ||
        (topColorj[0] == "white" && howManyColors(tempData, i) >= 2)
      ) {
        // then we need to check whether there is enough free space in j, or if i is empty
        if (topColori[1] <= freeSlots(tempData, j)) {
          // the it's ok we can do the move
          movePossible = true;
        }
      }
    }
  }
  return movePossible;
}

function howManyColors(tempData, i) {
  // returns the number of colors (except white) in flask number i
  var tempColor = [];
  count = 0;
  for (let j = 0; j < 4; j++) {
    if (tempData[i][j] != "white") {
      if (!tempColor.includes(tempData[i][j])) {
        count++;
        tempColor.push(tempData[i][j]);
      }
    }
  }
  return count;
}

function move(tempData, i, j) {
  // moves the top color of i into j
  if (canMove(tempData, i, j)) {
    topColori = topColor(tempData, i);

    // lets start by emptying i,
    // we know it's not empty because we checked canMove(i,j)
    let x = 0;
    while (tempData[i][x] == "white") {
      x++;
    }
    // x is the first 'not-empty' line, we empty it and also the ones below
    for (let y = 0; y < topColori[1]; y++) {
      tempData[i][x + y] = "white";
    }

    // now we fill j, again, we know it's not full because we checked canMove(i,j)
    x = 3;
    while (tempData[j][x] != "white") {
      x--;
    }
    // so the first emtpy line, we start filling
    for (let y = 0; y < topColori[1]; y++) {
      tempData[j][x - y] = topColori[0];
    }
  }
}

function freeSlots(tempData, i) {
  let numberOfSlots = 0;
  // check how much empty space there is at the top of the flask and returns it
  for (let j = 0; j < 4; j++) {
    if (tempData[i][j] == "white") {
      numberOfSlots++;
    }
  }
  return numberOfSlots;
}

function copyArray(array1, array2) {
  // copies the content of a 2-dimensionnal array array1 into array2 (empty array passed as a parameter)

  for (let i = 0; i < array1.length; i++) {
    array2[i] = new Array(array1[i].length);

    for (let j = 0; j < array1[i].length; j++) {
      array2[i][j] = array1[i][j];
    }
  }
}
