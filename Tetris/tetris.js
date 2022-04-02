var NumberOfRows = 18;
var NumberOfColumns = 12;
const tableau = document.getElementById("grid");
var partieEnCours = false;
var tetriminos = new Array(7);
let nIntervId;
let nIntervId2;
var pause = false;
var currentPosition = 0;
var currentTetrimino = 0;
var speed = 1;
var score = 0;
var nbLignes = 0;
var partiePerso = false;
var tetriminosChoisis = new Array();
var log = "";

// On créé le tableau vide
var Cells = "";
for (let i = 0; i < NumberOfRows; i++) {
  Cells = Cells + '<tr id="R' + i + '">';
  for (let j = 0; j < NumberOfColumns; j++) {
    Cells = Cells + '<td id="R' + i + "C" + j + '">' + "</td>";
  }
  Cells = Cells + "<tr>";
}
tableau.innerHTML = Cells;

// on initialise notre grille
function init() {
  Grid = new Array(NumberOfRows);
  for (i = 0; i < NumberOfRows; i++) {
    Grid[i] = new Array(NumberOfColumns);
    for (let j = 0; j < NumberOfColumns; j++) {
      // 0 c'est case vide, 1 c'est case fixe, 2 c'est case en mouvement
      Grid[i][j] = [0, "rgb(255,255,255)"];
    }
  }
}

init();
// démarre la partie quand on clic
document.getElementById("button").addEventListener("click", function (e) {
  e.preventDefault;
  start();
});

// affiche / cache le menu détaillé.
document.getElementById("classique").addEventListener("change", function (e) {
  if (document.getElementById("classique").checked) {
    document.getElementById("choixPerso").hidden = true;
  } else {
    document.getElementById("choixPerso").hidden = false;
  }
});
document.getElementById("perso").addEventListener("change", function (e) {
  if (document.getElementById("classique").checked) {
    document.getElementById("choixPerso").hidden = true;
  } else {
    document.getElementById("choixPerso").hidden = false;
  }
});

document.addEventListener("keydown", function (e) {
  switch (e.code) {
    case "ArrowRight":
      deplacerADroite();
      break;
    case "ArrowLeft":
      deplacerAGauche();
      break;
    case "ArrowDown":
      descendreTetrimino();
      break;
    case "KeyP":
      metPause();
      break;
    case "ArrowUp":
      tournerTetrimino();
      break;
    // case "KeyL":
    //   document.getElementById("log").innerText = log;
    //   break;
  }
});

// on désactive la scroll bar quand on appuie sur les flèches
var keys = {};
window.addEventListener(
  "keydown",
  function (e) {
    keys[e.keyCode] = true;
    switch (e.keyCode) {
      case 37:
      case 39:
      case 38:
      case 40: // Arrow keys
        e.preventDefault();
        break;
      default:
        break; // do not block other keys
    }
  },
  false
);
window.addEventListener(
  "keyup",
  function (e) {
    keys[e.keyCode] = false;
  },
  false
);

function metPause() {
  if (pause == true) {
    nIntervId = setInterval(descendreTetrimino, 500 / speed);
    pause = false;
  } else {
    clearInterval(nIntervId);
    pause = true;
  }
}

function start() {
  partiePerso = document.getElementById("perso").checked;

  // on définit quels tetrimino on été sélectionnés
  if (partiePerso == true) {
    tetriminosChoisis = [];
    // on s'intéresse au formulaire
    for (x = 0; x < 7; x++) {
      if (document.getElementById("piece" + x).checked) {
        tetriminosChoisis.push(x);
      }
    }
  } else {
    // par défaut on les met tous
    tetriminosChoisis = [0, 1, 2, 3, 4, 5, 6];
  }
  if (tetriminosChoisis.length != 0) {
    if (partieEnCours == true) {
      arreterPartie();
    }
    partieEnCours = true;
    score = 0;

    if (partiePerso == false) {
      speed = 1;
    } else {
      var select = document.getElementById("Vitesse");
      speed = select.options[select.selectedIndex].value;
      if (speed == "Croissante") {
        speed = 1;
        partiePerso = false;
      }
    }
    nbLignes = 0;
    init();
    nouveauTetrimino();
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function afficher() {
  // met à jour l'affichage en fonction du contenu de Grid
  for (i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      document.getElementById("R" + i + "C" + j).style.backgroundColor =
        Grid[i][j][1];
    }
  }
  document.getElementById("points").innerText = score;
}

function nouveauTetrimino() {
  if (partieEnCours == true) {
    var perdu = false;
    var tetrminoOK = false;
    while (tetrminoOK == false) {
      i = Math.floor(tetriminos.length * Math.random());
      tetrminoOK = tetriminosChoisis.includes(i);
    }
    currentTetrimino = i;
    currentPosition = 1;
    // on charge les nouvelles pièces en colonne 4, ligne 0
    for (let x = 0; x < tetriminos[i][1].length; x++) {
      if (Grid[tetriminos[i][1][x][0]][tetriminos[i][1][x][1] + 4][0] == 0) {
        Grid[tetriminos[i][1][x][0]][tetriminos[i][1][x][1] + 4] = [
          2,
          tetriminos[i][0],
        ];
      } else {
        // alors c'est qu'on a perdu
        clearInterval(nIntervId);
        nIntervId = null;
        perdu = true;
      }
    }
    if (perdu) {
      afficher();
      alert("You Lose");
      partieEnCours = false;
    }
    clearInterval(nIntervId);
    nIntervId = null;
    nIntervId = setInterval(descendreTetrimino, 500 / speed);
    afficher();
  }
}

function tournerTetrimino() {
  var newPosition = currentPosition + 1;
  // y a sans doute un moyen avec la fonction modulo (%) mais sinon ça ça marche position
  if (newPosition == 5) newPosition = 1;
  // On va commencer par localiser la piece, c'est à dire connaitre sa premiere et derniere ligne, et premiere et derniere colonne
  var premiereLigne = NumberOfRows - 1;
  var derniereLigne = 0;
  var premiereColonne = NumberOfColumns - 1;
  var derniereColonne = 0;
  var coordonnees = new Array();
  var nouvellesCoordonnees = new Array();
  var rotationPossible = true;
  var couleur = "";

  for (i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      if (Grid[i][j][0] == 2) {
        coordonnees.push([i, j]);
        couleur = Grid[i][j][1];
        if (i > derniereLigne) derniereLigne = i;
        if (i < premiereLigne) premiereLigne = i;
        if (j > derniereColonne) derniereColonne = j;
        if (j < premiereColonne) premiereColonne = j;
      }
    }
  }
  for (
    let x = 0;
    x < tetriminos[currentTetrimino][currentPosition].length;
    x++
  ) {
    // pour toute les coordonnées, on fait la différent entre la nouvelle position et l'ancienne, et on ajoute ca à notre coordonnée sur le Grid
    // si quelqu'un d'autre que moi comprends cette phrase, bravo!
    var translateX =
      tetriminos[currentTetrimino][newPosition][x][0] -
      tetriminos[currentTetrimino][currentPosition][x][0];
    var translateY =
      tetriminos[currentTetrimino][newPosition][x][1] -
      tetriminos[currentTetrimino][currentPosition][x][1];
    // on calcul nos nouvelles coordonnées
    nouvellesCoordonnees.push([
      coordonnees[x][0] + translateX,
      coordonnees[x][1] + translateY,
    ]);
    // on vérifie si la rotation est possible
    if (
      nouvellesCoordonnees[x][0] < 0 ||
      nouvellesCoordonnees[x][0] >= NumberOfRows ||
      nouvellesCoordonnees[x][1] < 0 ||
      nouvellesCoordonnees[x][1] >= NumberOfColumns
    ) {
      rotationPossible = false;
    } else if (
      Grid[nouvellesCoordonnees[x][0]][nouvellesCoordonnees[x][1]][0] == 1
    ) {
      rotationPossible = false;
    }
  }
  // maintenant qu'on connait nos anciennes coordonées, nos nouvelles, et qu'on sait si la rotation est possible ou pas, y a plus qu'à...
  if (rotationPossible == true && pause == false) {
    // on commence par efface l'ancienne pièce
    for (
      let x = 0;
      x < tetriminos[currentTetrimino][currentPosition].length;
      x++
    ) {
      i = coordonnees[x][0];
      j = coordonnees[x][1];
      Grid[i][j] = [0, "rgb(255,255,255)"];
    }
    // on affiche la nouvelle
    for (
      let x = 0;
      x < tetriminos[currentTetrimino][currentPosition].length;
      x++
    ) {
      i = nouvellesCoordonnees[x][0];
      j = nouvellesCoordonnees[x][1];
      Grid[i][j][0] = 2;
      Grid[i][j][1] = couleur;
    }
    currentPosition = newPosition;
  }
  afficher();
}

function deplacerADroite() {
  // on commence par vérifier si la pièce peut aller à droite
  var impossible = false;
  for (i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      if (Grid[i][j][0] == 2) {
        // on a trouvé une case en mouvement
        if (j == NumberOfColumns - 1) {
          // on est à droite de la grille on ne peut plus bouger
          impossible = true;
        } else if (Grid[i][j + 1][0] == 1) {
          // on est bloqué car il y a quelque chose à droite, on est arrivé aussi.
          impossible = true;
        }
      }
    }
  }
  if (impossible == false && pause == false) {
    // alors on le fait aller à droite
    for (i = 0; i < NumberOfRows; i++) {
      for (let j = NumberOfColumns - 1; j >= 0; j--) {
        if (Grid[i][j][0] == 2) {
          // d'abord on modifie le grid, après on modifie l'affichage
          Grid[i][j + 1] = Grid[i][j];
          if (j > 0) {
            // on vérifie si c'est la plus à gauche de la pièce qu'on fait bouger
            // si oui on la passe en blanc
            if (Grid[i][j - 1][0] == 0 || Grid[i][j - 1][0] == 1) {
              Grid[i][j] = [0, "rgb(255,255,255)"];
            }
          } // Alors on est sur la première colonne, on met en blanc aussi
          else {
            Grid[i][j] = [0, "rgb(255,255,255)"];
          }
        }
      }
    }
  }
  afficher();
}

function deplacerAGauche() {
  // on commence par vérifier si la pièce peut aller à gauche
  var impossible = false;
  for (i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      if (Grid[i][j][0] == 2) {
        // on a trouvé une case en mouvement
        if (j == 0) {
          // on est à gauche de la grille on ne peut plus bouger
          impossible = true;
        } else if (Grid[i][j - 1][0] == 1) {
          // on est bloqué car il y a quelque chose à gauche, on est arrivé aussi.
          impossible = true;
        }
      }
    }
  }
  if (impossible == false && pause == false) {
    // alors on le fait aller à gauche
    for (i = 0; i < NumberOfRows; i++) {
      for (let j = 0; j < NumberOfColumns; j++) {
        if (Grid[i][j][0] == 2) {
          // d'abord on modifie le grid, après on modifie l'affichage
          Grid[i][j - 1] = Grid[i][j];
          if (j < NumberOfColumns - 1) {
            // on vérifie si c'est la plus à droite de la pièce qu'on fait bouger
            // si oui on la passe en blanc
            if (Grid[i][j + 1][0] == 0 || Grid[i][j + 1][0] == 1) {
              Grid[i][j] = [0, "rgb(255,255,255)"];
            }
          } // Alors on est sur la dernière colonne, on met en blanc aussi
          else {
            Grid[i][j] = [0, "rgb(255,255,255)"];
          }
        }
      }
    }
  }
  afficher();
}

function descendreTetrimino() {
  if (partieEnCours == true) {
    // function dont le but est de parcourir le grid et de faire descendre la pièce en cours (si c'est possible)
    var arrivee = false;
    // on commence par vérifier si la pièce peut effectivement descendre ou bien si elle est arrivée
    for (i = 0; i < NumberOfRows; i++) {
      for (let j = 0; j < NumberOfColumns; j++) {
        if (Grid[i][j][0] == 2) {
          // on a trouvé une case en mouvement
          if (i == NumberOfRows - 1) {
            // on est en bas de la grille la pièce ne peut plus bouger
            arrivee = true;
          } else if (Grid[i + 1][j][0] == 1) {
            // on est bloqué car il y a quelque chose en dessous, on est arrivé aussi.
            arrivee = true;
          }
        }
      }
    }

    // on sait maintenant si on est arrivé ou pas.
    // si on est arrivé, on bloque le tetrimino, et on en lance un nouveau
    if (arrivee == true) {
      for (i = 0; i < NumberOfRows; i++) {
        for (let j = 0; j < NumberOfColumns; j++) {
          if (Grid[i][j][0] == 2) {
            Grid[i][j][0] = 1;
          }
        }
      }
      // avant d'envoyer le nouveau on regarde s'il y a des lignes pleines, et si oui on les vire
      var lignes = new Array();
      lignes = lignesPleines();
      lignes.forEach((e) => enleverLigne(e));
      score = score + lignes.length * 100;
      if (partiePerso == false) {
        speed = Math.min(Math.floor(nbLignes / 10) + 1, 4);
      }
      if (lignes.length > 0) {
        var delai = 1500;
      } else {
        delai = 300;
      }
      myTimeout2 = setTimeout(nouveauTetrimino, delai);
    } else {
      if (pause == false) {
        // alors on le fait descendre
        for (i = NumberOfRows - 1; i >= 0; i--) {
          for (let j = 0; j < NumberOfColumns; j++) {
            if (Grid[i][j][0] == 2) {
              // d'abord on modifie le grid, après on modifie l'affichage
              Grid[i + 1][j] = Grid[i][j];
              if (i > 0) {
                // on vérifie si c'est la plus haute de la pièce qu'on a fait descendre
                // si oui on la passe en blanc
                if (Grid[i - 1][j][0] != 2) {
                  Grid[i][j] = [0, "rgb(255,255,255)"];
                }
              } // Alors on est sur la première ligne, on met en blanc aussi
              else {
                Grid[i][j] = [0, "rgb(255,255,255)"];
              }
            }
          }
        }
      }
    }
    afficher();
  }
}

function lignesPleines() {
  var lignes = new Array();
  // fonction qui parcourt le grid pour savoir si les lignes sont pleines
  // et renvoie les numéros de lignes dans un array
  for (let i = 0; i < NumberOfRows; i++) {
    var lignePleine = true;
    for (let j = 0; j < NumberOfColumns; j++) {
      if (Grid[i][j][0] == 0) {
        lignePleine = false;
      }
      if (j == NumberOfColumns - 1 && lignePleine == true) {
        lignes.push(i);
      }
    }
  }
  return lignes;
}

function enleverLigne(i) {
  // fonction qui enlève une ligne passée en paramètre

  //rajoute petite animation cool qui clignote
  clignoterLigne(i);
  // tout s'arrête pendant 1 second.
  nbLignes++;
  // on pars de la ligne i jusqu'à la ligne 1 et on décale
  myTimeout3 = setTimeout(decalerLigne, 1060, i);
}

function decalerLigne(i) {
  for (x = i; x > 0; x--) {
    for (let j = 0; j < NumberOfColumns; j++) {
      valeur = Grid[x - 1][j][0];
      couleur = Grid[x - 1][j][1];
      Grid[x][j] = [valeur, couleur];
    }
  }
}
function clignoterLigne(i) {
  for (x = 1; x < 21; x++) {
    myTimeout = setTimeout(colorerLigne, 50 * x, i);
  }
}

function colorerLigne(i) {
  if (Grid[i][0][1] != "rgb(255,170,255)") {
    Grid[i][0][1] = "rgb(255,170,255)";
  } else {
    Grid[i][0][1] = "rgb(255,255,255)";
  }
  for (j = 1; j < NumberOfColumns; j++) {
    Grid[i][j][1] = Grid[i][0][1];
  }
  afficher();
}

function arreterPartie() {
  // fonction qui reset le jeu
  partieEnCours = false;
  clearInterval(nIntervId);
  for (i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      Grid[i][j] = [0, "rgb(255,255,255)"];
    }
  }
  pause = false;
  afficher();
}

function debug() {
  // fonction qui vérifie qu'elle a toujours une forme "normale"
  // et sinon arrête le jeu et lève une alerte

  // on récupère les coordonnées du tetrimino actuellement en jeu
  var coordonnees = new Array();
  for (let i = 0; i < NumberOfRows; i++) {
    for (let j = 0; j < NumberOfColumns; j++) {
      if (Grid[i][j][0] == 2) {
        coordonnees.push([i, j]);
      }
    }
  }

  // puis on compare ces coordonnées avec ce qui est stockés dans tetriminos.
  if (
    coordonnees.length !=
      tetriminos[currentTetrimino][currentPosition].length &&
    coordonnees.length != 0
  ) {
    log =
      log +
      "\n Error : Incorrect number of boxes" +
      coordonnees.length +
      ":" +
      tetriminos[currentTetrimino][currentPosition].length;
    alert("Error");
    partieEnCours = false;
  }
}

// On définit les 7 Tétriminos possibles
// le premier c'est le baton, aussi appelé tetrimino I, on fait une liste avec les coordonnées.
// Sachant qu'il a 4 positions + 1 couleur
tetriminos[0] = new Array(5);
tetriminos[0][0] = "rgb(0,195,255)";
tetriminos[0][1] = [
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
];
tetriminos[0][2] = [
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
];
tetriminos[0][3] = [
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
];
tetriminos[0][4] = [
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
];

// carré jaune
tetriminos[1] = new Array(5);
tetriminos[1][0] = "rgb(255,255,0)";
tetriminos[1][1] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];
tetriminos[1][2] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];
tetriminos[1][3] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];
tetriminos[1][4] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
];

// T Violet
tetriminos[2] = new Array(5);
tetriminos[2][0] = "rgb(140,0,255)";
tetriminos[2][1] = [
  [1, 0],
  [1, 1],
  [1, 2],
  [2, 1],
];
tetriminos[2][2] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [2, 1],
];
tetriminos[2][3] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, 2],
];
tetriminos[2][4] = [
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 1],
];

// L Orange
tetriminos[3] = new Array(5);
tetriminos[3][0] = "rgb(255,165,0)";
tetriminos[3][1] = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
];
tetriminos[3][2] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];
tetriminos[3][3] = [
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];
tetriminos[3][4] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
];

// J Bleu
tetriminos[4] = new Array(5);
tetriminos[4][0] = "rgb(0,0,255)";
tetriminos[4][1] = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 2],
];
tetriminos[4][2] = [
  [0, 2],
  [1, 2],
  [2, 1],
  [2, 2],
];
tetriminos[4][3] = [
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
];
tetriminos[4][4] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [2, 0],
];

// Z rouge
tetriminos[5] = new Array(5);
tetriminos[5][0] = "rgb(255,0,0)";
tetriminos[5][1] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
];
tetriminos[5][2] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [2, 0],
];
tetriminos[5][3] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 2],
];
tetriminos[5][4] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [2, 0],
];

// S vert
tetriminos[6] = new Array(5);
tetriminos[6][0] = "rgb(0,255,0)";
tetriminos[6][1] = [
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
];
tetriminos[6][2] = [
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 2],
];
tetriminos[6][3] = [
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
];
tetriminos[6][4] = [
  [0, 1],
  [1, 1],
  [1, 2],
  [2, 2],
];
