let btn = document.getElementById("button");

// we start with 4 flasks, we'll change it later
let data = new Array(4);

btn.addEventListener("click", function (e) {
  e.preventDefault;
  btn.disabled = true;
  getData();
  solve();
  display();
  btn.disabled = false;
});

function getData() {
  // look at the colors in the flasks and put them in a array so that we can work
  console.log(data.length);
  for (let i = 0; i < data.length; i++) {
    var table = document.getElementById("flask" + i);
    for (let x in table.rows) {
      let row = table.rows[x];
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      for (let y in row.cells) {
        let col = row.cells[y];

        if (col?.style?.backgroundColor != null) {
          console.log(x + " : " + y);
          console.log(col?.style?.backgroundColor);
          data[i][x] = col?.style?.backgroundColor;
        }
        //iterate through columns
        //columns would be accessed using the "col" variable assigned in the for loop
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
  // tell you whether the solve function has won, return true/false
}

function hasLost() {
  // tell you wheter the solve function has lost, return true/false
}
