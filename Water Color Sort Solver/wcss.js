let btn = document.getElementById("button");
let numberOfFlasks = 4;
let numberOfColors = 3; // + white
let globalWon = false;
let iter = 0;
let maxIter = 10;
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
];
// we start with 4 flasks, we'll change it later
let data = new Array(numberOfFlasks);
let data2 = new Array();
let colors = allColors.slice(0, numberOfColors + 1);

init();

btn.addEventListener("click", function (e) {
  e.preventDefault;
  btn.disabled = true;
  getData();
  globalWon = false;
  console.log("Debut de la recursivite");
  iter = 0;
  solve(data, []);
  console.log("Data :");
  console.table(data);
  console.log(globalWon);
  // go through the moves and display them one by one 2 seconds
  nIntervId = setInterval(walkThrough, 2000);
});

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
    console.table(listOfMoves);
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
  console.log("Iteration numero " + iter);
  // find a way to make sure we don't fall into infinite loop, mostly because of the empty flasks.
  // So far I've disabled moving things into an empty flask for now
  if (iter <= maxIter) {
    if (!hasLost(varData) && !hasWon(varData) && !globalWon) {
      var tempData = new Array();
      var tempMoves = new Array();

      // we loop on the flasks i, for each flask i we loop on the flasks j and check canMove, if so, we do.
      research: for (let i = 0; i < varData.length; i++) {
        for (let j = 0; j < 4; j++) {
          if (globalWon) break research;
          if (canMove(varData, i, j)) {
            // as soon as we can move, we do it, and resolve the new array
            tempData = [];
            copyArray(varData, tempData);
            move(tempData, i, j);
            tempMoves = varMoves.slice(0);
            tempMoves.push("(" + i + "=>" + j + ")");
            console.table(tempData);
            solve(tempData, tempMoves);
          }
        }
      }
    } else if (hasWon(varData)) {
      globalWon = true;
      console.table(varMoves);
      listOfMoves = varMoves.slice(0);
      console.log("TROUVE");
      console.table(varData);
    }
  }
}

function hasWon(tempData) {
  // tell you whether the solve function has won, returns true/false
  let won = true;
  for (let i = 0; i < tempData.length; i++) {
    let color = tempData[i][0];
    for (let j = 0; j < 4; j++) {
      if (tempData[i][j] != color) {
        won = false;
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
  for (let i = 0; i < tempData.length; i++) {
    for (let j = 0; j < tempData.length; j++) {
      if (i != j) {
        if (canMove(tempData, i, j)) {
          movePossible = true;
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
    // first, either they have the same top color or J is empty
    //if (topColori[0] == topColorj[0] || topColorj[0] == "white") {
    if (topColori[0] == topColorj[0]) {
      // then we need to check whether there is enough free space in j, or if i is empty
      if (topColori[1] <= freeSlots(tempData, j)) {
        // the it's ok we can do the move
        movePossible = true;
      }
    }
  }
  return movePossible;
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
