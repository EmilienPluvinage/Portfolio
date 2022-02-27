let btn = document.getElementById("button");
let numberOfFlasks = 4;
// we start with 4 flasks, we'll change it later
let data = new Array(numberOfFlasks);

btn.addEventListener("click", function (e) {
  e.preventDefault;
  btn.disabled = true;
  getData();
  console.log(hasWon());
  console.log(hasLost());
  // for (let i = 0; i < 4; i++) {
  //   console.log(topColor(i));
  // }
  // console.log("2 => 3 " + canMove(2, 3));
  // console.log("3 => 2 " + canMove(3, 2));
  // console.log("0 => 1 " + canMove(0, 1));
  // console.log("1 => 0 " + canMove(1, 0));
  solve();
  display();
  btn.disabled = false;
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
  console.table(data);
}

function solve() {
  // find the solution and re-arrange the array
}

function display() {
  // display the content of the array
}

function hasWon() {
  // tell you whether the solve function has won, returns true/false
  let won = true;
  for (let i = 0; i < data.length; i++) {
    let color = data[i][0];
    for (let j = 0; j < 4; j++) {
      if (data[i][j] != color) {
        won = false;
      }
      color = data[i][j];
    }
  }
  return won;
}

function hasLost() {
  // tell you whether the solve function has lost, returns true/false
  // for each flask, we check whether we can move its top content somewhere else
  let movePossible = false;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; i < data.length; i++) {
      if (i != j) {
        if (canMove(i, j)) {
          movePossible = true;
        }
      }
    }
  }
  return !movePossible;
}

function topColor(i) {
  // returns the topColor of flask number i, and how many levels of that color there are
  let color = "white";
  let height = 0;
  for (let j = 3; j >= 0; j--) {
    if (data[i][j] != "white") {
      if (data[i][j] == color) {
        height++;
      } else {
        height = 1;
      }
      color = data[i][j];
    }
  }
  return [color, height];
}

function canMove(i, j) {
  // check whether we can move the content of flask i into flask j and returns true/false
  movePossible = false;
  topColori = topColor(i);
  topColorj = topColor(j);
  // first, either they have the same top color or J is empty
  if (topColori[0] == topColorj[0] || topColorj[0] == "white") {
    // then we need to check whether there is enough free space in j, or if i is empty
    if (topColori[1] <= freeSlots(j)) {
      // the it's ok we can do the move
      movePossible = true;
    }
  }
  return movePossible;
}

function freeSlots(i) {
  let numberOfSlots = 0;
  // check how much empty space there is at the top of the flask and returns it
  for (let j = 0; j < 4; j++) {
    if (data[i][j] == "white") {
      numberOfSlots++;
    }
  }
  return numberOfSlots;
}
