var NumberOfColumns = 0;
var NumberOfRows = 0;
const tableau = document.getElementById("grid");
var NumberOfMines = 0;
var Grid = new Array();
var partieEnCours = false;
var numberOfClics = 0;

document.getElementById("button").addEventListener("click", function (e) {
  e.preventDefault;
  if (checkValues()) {
    start();
  }
});

function checkValues() {
  NumberOfColumns = document.getElementById("columns").value;
  NumberOfRows = document.getElementById("rows").value;
  NumberOfMines = document.getElementById("mines").value;
  if (
    NumberOfColumns <= 20 &&
    NumberOfColumns >= 5 &&
    NumberOfRows <= 20 &&
    NumberOfRows >= 5
  ) {
    if (NumberOfMines <= 0.5 * NumberOfColumns * NumberOfRows) {
      document.getElementById("error-msg").innerText = "";
      return true;
    } else {
      document.getElementById("error-msg").innerText =
        "I see you like challenge, but may I suggest slightly less mines?";
      return false;
    }
  } else {
    document.getElementById("error-msg").innerText =
      "Please make sure to check the selected number of rows and columns.";
    return false;
  }
}

function start() {
  partieEnCours = true;
  numberOfClics = 0;
  Grid = new Array(NumberOfRows);
  // d'abord on créé et initilise nos tableaux
  for (let i = 0; i < NumberOfRows; i++) {
    Grid[i] = new Array(NumberOfColumns);
    for (let j = 0; j < NumberOfColumns; j++) {
      // [nombre de mines voisines,cliqué ou pas,protégée ou pas]
      Grid[i][j] = [0, false, false];
    }
  }
  // Ensuite on détermine la grille
  for (let i = 0; i < NumberOfMines; i++) {
    addMine();
  }
  // ensuite on affiche la grille
  var Cells = "";
  for (let i = 0; i < NumberOfRows; i++) {
    Cells = Cells + '<tr id="R' + i + '">';
    for (let j = 0; j < NumberOfColumns; j++) {
      Cells = Cells + '<td id="R' + i + "C" + j + '">' + "</td>";
    }
    Cells = Cells + "<tr>";
  }
  tableau.innerHTML = Cells;
  // on ajoute nos évènements pour le double clic et le clic droit
  for (let i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      document
        .getElementById("R" + i + "C" + j)
        .addEventListener("dblclick", function (e) {
          demine(i, j);
        });

      document
        .getElementById("R" + i + "C" + j)
        .addEventListener("contextmenu", function (e) {
          e.preventDefault();
          // si la cellule n'est pas protégée (drapeau), on la protége, sinon on la déprotège
          if (
            Grid[i][j][2] == false &&
            Grid[i][j][1] == false &&
            partieEnCours == true
          ) {
            Grid[i][j][2] = true;
            document.getElementById("R" + i + "C" + j).style.backgroundColor =
              "rgb(150,150,150)";
          } else if (Grid[i][j][1] == false && partieEnCours == true) {
            Grid[i][j][2] = false;
            document.getElementById("R" + i + "C" + j).style.backgroundColor =
              "rgb(200,200,200)";
          }
          return false;
        });
    }
  }
}

//on écrit la function démine qui prends en paramètres les coordonnées de la case cliquée
function demine(i, j) {
  var cellule = document.getElementById("R" + i + "C" + j);
  //déjà on teste si elle a déjà été cliquée ou pas, si oui on ne fait rien.
  if (
    Grid[i][j][1] == false &&
    partieEnCours == true &&
    Grid[i][j][2] == false
  ) {
    if (Grid[i][j][0] == 9) {
      Grid[i][j][1] = true;
      // C'est une mine
      // On passe la case en rouge
      cellule.style.backgroundColor = "rgb(255,0,0)";
      alert("PERDU");
      partieEnCours = false;
    } else if (Grid[i][j][0] == 0 && Grid[i][j][1] == false) {
      cellule.style.backgroundColor = "rgb(255,255,255)";
      // on en profite pour augmenter le nombre de cases cliquées
      numberOfClics++;
      Grid[i][j][1] = true;
      // Alors on va propager le clic aux cases voisines
      // en surveillant les effets de bords
      for (let a = 0; a < 3; a++) {
        for (let b = 0; b < 3; b++) {
          if (
            (a != 1 || b != 1) &&
            i + a > 0 &&
            i + a - 1 < NumberOfRows &&
            j + b > 0 &&
            j + b - 1 < NumberOfColumns
          ) {
            demine(i + a - 1, j + b - 1);
          }
        }
      }
    } else if (Grid[i][j][1] == false) {
      numberOfClics++;
      Grid[i][j][1] = true;
      cellule.style.backgroundColor = "rgb(255,255,255)";
      // alors on se contente de révéler la case
      cellule.innerText = Grid[i][j][0];
    }
    if (
      numberOfClics == NumberOfColumns * NumberOfRows - NumberOfMines &&
      partieEnCours == true
    ) {
      alert("GAGNE");
      partieEnCours = false;
    }
  }
}

// ajoute une mine à la grille
function addMine() {
  // on choisit des coordonnées au hasard entre 0 et nombre de ligne/colonne -1
  i = Math.floor(NumberOfRows * Math.random());
  j = Math.floor(NumberOfColumns * Math.random());
  // s'il y a déjà une mine à cet endroit là, on rappelle la fonction
  if (Grid[i][j][0] == 9) {
    addMine();
  } else {
    Grid[i][j][0] = 9;
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        increaseByOne(i + a - 1, j + b - 1);
      }
    }
  }
}

function increaseByOne(i, j) {
  // on test qu'on soit bien dans la grille, et si on y est bien, et qu'on est pas sur une mine, alors on augmente de 1
  if (i >= 0 && j >= 0 && i < NumberOfRows && j < NumberOfColumns) {
    if (Grid[i][j][0] != 9) {
      Grid[i][j][0]++;
    }
  }
}
