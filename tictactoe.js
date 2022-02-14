let btn = document.getElementById("button");
let result = document.getElementById("result");
let pseudo = "";
let ImageChargement =
  '<img src="chargement.gif" alt="Recherche d\'un adversaire..." width="30" height="30" />';
let partieEnCours = false;
let nIntervId = null;
let idpartie = 0;
let CestMonTour = false;

btn.addEventListener("click", function (e) {
  e.preventDefault;
  pseudo = document.getElementById("pseudo").value;
  if (pseudo.length > 2) {
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
    result.innerHTML = "Your pseudo must be a least 3 characters.";
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
      partieEnCours = true;
      newGrid();
      idpartie = retour["partie"];
      nIntervId = null;
      result.innerText = "Bonne chance !";
      document.getElementById("chargement").innerHTML = "";
      document.getElementById("player1").innerText = pseudo;
      document.getElementById("player2").innerText = retour["adversaire"];
      if (retour["prochainCoup"] == pseudo) {
        document.getElementById("player1").style.backgroundColor =
          "rgb(255, 200, 200)";
        CestMonTour = true;
      } else {
        document.getElementById("player2").style.backgroundColor =
          "rgb(255,200,200)";
      }
    } else {
      // la partie n'as pas débuté, on lance donc un interval qui va chercher à lancer la partie toutes les 5 secondes.
      if (nIntervId == null) {
        nIntervId = setInterval(newGame, 5000);
      }
    }
  } else {
    alert("Erreur : " + retour["error"]);
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
    document.getElementById("player2").style.backgroundColor =
      "rgb(255,200,200)";
    document.getElementById("player2").style.backgroundColor =
      "rgb(240,240,240)";
    CestMonTour == false;
  } else {
    result.innerText = retour["error"];
  }
}
