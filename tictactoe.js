let btn = document.getElementById("button");
let result = document.getElementById("result");
let pseudo = "";
let ImageChargement =
  '<img src="chargement.gif" alt="Recherche d\'un adversaire..." width="30" height="30" />';
let partieEnCours = false;
let nIntervId = null;
let nIntervGetMove = null;
let idpartie = 0;
let CestMonTour = false;
let timer = 30;

btn.addEventListener("click", function (e) {
  e.preventDefault;
  // Soit c'est la première fois qu'on clique, et il faut choisir un pseudo, newPlayer.php
  // Soit on appelle restart.php
  if (btn.value == "Start") {
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    pseudo = document.getElementById("pseudo").value;
    if (pseudo.length > 2) {
      if (!format.test(pseudo)) {
        fetch("http://localhost:8888/newPlayer.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: "pseudo=" + pseudo,
        })
          .then((response) => response.json())
          .then((response) => retourNewPlayer(response))
          .catch((error) => alert("Erreur : " + error));
      } else {
        result.innerHTML =
          "Your pseudo should contain only letters and numbers.";
      }
    } else {
      result.innerHTML = "Your pseudo must be a least 3 characters.";
    }
  } else if (btn.value == "Restart") {
    // on relance une partie
    result.innerText =
      "One moment " + pseudo + ",\n we're searching for an opponent...";
    document.getElementById("pseudo").disabled = true;
    btn.disabled = true;
    document.getElementById("chargement").innerHTML = ImageChargement;
    newGame();
  }
});

clickInit();

function retourNewPlayer(retour) {
  if (retour["error"]) {
    result.innerText = retour["text"];
  } else {
    result.innerText =
      "Welcome " + pseudo + ",\n we're searching for an opponent...";
    document.getElementById("pseudo").disabled = true;
    btn.disabled = true;
    document.getElementById("chargement").innerHTML = ImageChargement;
    newGame();
  }
}

function newGame() {
  fetch("http://localhost:8888/newGame.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: "pseudo=" + pseudo,
  })
    .then((response) => response.json())
    .then((response) => retourNewGame(response))
    .catch((error) => alert("Erreur : " + error));
}

function retourNewGame(retour) {
  if (retour["error"] == "") {
    if (retour["partie"] != 0) {
      // alors c'est qu'on a débuté une partie
      document.getElementById("timer").innerText = timer;
      partieEnCours = true;
      newGrid();
      idpartie = retour["partie"];
      clearInterval(nIntervId);
      nIntervId = null;
      result.innerText = "Bonne chance !";
      document.getElementById("chargement").innerHTML = "";
      document.getElementById("player1").innerText = pseudo;
      document.getElementById("player2").innerText = retour["adversaire"];
      nIntervTimer = setInterval(countdown, 1000);
      if (retour["prochainCoup"] == pseudo) {
        document.getElementById("player1").style.backgroundColor =
          "rgb(255, 200, 200)";
        CestMonTour = true;
        // Si c'est mon tour, je dois d'abord vérifier si l'autre joueur à joué avant moi ou pas.
        if (retour["abscisse"] != null) {
          x = retour["abscisse"];
          y = retour["ordonnee"];
          document.getElementById("R" + x + "C" + y).innerText = "O";
          document.getElementById("R" + x + "C" + y).style.color = "blue";
        }
      } else {
        document.getElementById("player2").style.backgroundColor =
          "rgb(200,200,255)";
        // ca n'est pas mon tour, donc je vérifie régulièrement si c'est mon tour ou toujours pas
        nIntervGetMove = setInterval(getMove, 1000);
      }
    } else {
      // la partie n'as pas débuté, on lance donc un interval qui va chercher à lancer la partie toutes les 5 secondes.
      if (nIntervId == null) {
        nIntervId = setInterval(newGame, 1000);
      }
    }
  } else {
    alert("Erreur : " + retour["error"]);
  }
}

function countdown() {
  if (timer > 0) {
    timer--;
    document.getElementById("timer").innerText = timer;
  } else {
    clearInterval(nIntervTimer);
    nIntervTimer = null;
    if (CestMonTour == true) {
      outOfTime();
    }
  }
}

function newGrid() {
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      document.getElementById("R" + i + "C" + j).removeAttribute("class");
    }
  }
}

function clickInit() {
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      document
        .getElementById("R" + i + "C" + j)
        .addEventListener("click", function (e) {
          newMove(i, j);
        });
    }
  }
}

function newMove(x, y) {
  // on commence par tester si la case a déjà été jouée ou pas, si oui, on ne fait rien
  if (
    document.getElementById("R" + x + "C" + y).className != "played" &&
    CestMonTour == true
  ) {
    fetch("http://localhost:8888/newMove.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "pseudo=" + pseudo + "&partie=" + idpartie + "&x=" + x + "&y=" + y,
    })
      .then((response) => response.json())
      .then((response) => retourNewMove(response, x, y))
      .catch((error) => alert("Erreur : " + error));
  }
}

function retourNewMove(retour, x, y) {
  // si tout est bon, on affiche la case cliquée. par convention le joueur est X et l'adversaire est O
  if (retour["error"] == "") {
    document.getElementById("R" + x + "C" + y).innerText = "X";
    document.getElementById("R" + x + "C" + y).style.color = "red";
    document.getElementById("R" + x + "C" + y).className = "played";
    document.getElementById("player2").style.backgroundColor =
      "rgb(200,200,255)";
    document.getElementById("player1").style.backgroundColor =
      "rgb(240,240,240)";
    CestMonTour == false;
    // on lance un timer pour savoir si l'adversaire a joué
    nIntervGetMove = setInterval(getMove, 1000);
    // on réinitialise le timer qui nous donnait 30 secondes pour jouer
    timer = 30;
  } else {
    result.innerText = retour["error"];
  }
}

function outOfTime() {
  // on commence par tester si la case a déjà été jouée ou pas, si oui, on ne fait rien
  if (CestMonTour == true) {
    fetch("http://localhost:8888/outOfTime.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: "pseudo=" + pseudo + "&partie=" + idpartie,
    })
      .then((response) => response.json())
      .then((response) => retourOutOfTime(response))
      .catch((error) => alert("Erreur : " + error));
  }
}

function retourOutOfTime(retour) {
  if (retour["error"]) {
    result.innerText = retour["text"];
  } else {
    defaite();
  }
}

function getMove() {
  // fonction dont l'objectif est de vérifier si l'adversaire a joué son tour
  // et si oui de récupérer les coordonnées de la case jouée, s'il a gagné, etc...
  fetch("http://localhost:8888/getMove.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: "pseudo=" + pseudo + "&partie=" + idpartie,
  })
    .then((response) => response.json())
    .then((response) => retourGetMove(response))
    .catch((error) => alert("Erreur : " + error));
}

function retourGetMove(retour) {
  if (retour["defaite"]) {
    defaite();
    // on affiche la case que l'adversaire a joué, on la désactive, on change la couleur des pseudos
    x = retour["x"];
    y = retour["y"];
    document.getElementById("R" + x + "C" + y).innerText = "O";
    document.getElementById("R" + x + "C" + y).style.color = "blue";
  } else if (retour["victoire"]) {
    //alors on a gagné
    clearInterval(nIntervGetMove);
    nIntervGetMove = null;
    clearInterval(nIntervTimer);
    nIntervTimer = null;
    partieEnCours = false;
    btn.disabled = false;
    btn.value = "Restart";
    idpartie = 0;
    result.innerHTML = "C'est gagn&eacute;!";
    for (let i = 0; i <= 2; i++) {
      for (let j = 0; j <= 2; j++) {
        document.getElementById("R" + i + "C" + j).className = "played";
      }
    }
  } else if (retour["prochainCoup"] != "adversaire") {
    // alors c'est à nous, l'adversaire a joué.
    CestMonTour = true;
    clearInterval(nIntervGetMove);
    nIntervGetMove = null;
    // on relance le timer
    timer = 30;
    // on affiche la case que l'adversaire a joué, on la désactive, on change la couleur des pseudos
    x = retour["x"];
    y = retour["y"];
    document.getElementById("R" + x + "C" + y).innerText = "O";
    document.getElementById("R" + x + "C" + y).style.color = "blue";
    document.getElementById("R" + x + "C" + y).className = "played";
    document.getElementById("player1").style.backgroundColor =
      "rgb(255,200,200)";
    document.getElementById("player2").style.backgroundColor =
      "rgb(240,240,240)";
  }

  // sinon c'est toujours à l'adversaire, on ne fait rien.
}

function defaite() {
  // alors on a perdu
  clearInterval(nIntervGetMove);
  nIntervGetMove = null;
  clearInterval(nIntervTimer);
  nIntervTimer = null;
  partieEnCours = false;
  btn.disabled = false;
  btn.value = "Restart";
  idpartie = 0;
  result.innerText = "C'est perdu!";
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2; j++) {
      document.getElementById("R" + i + "C" + j).className = "played";
    }
  }
}
