let btn = document.getElementById("button");
let pseudo = "";
let ImageChargement =
  '<img src="chargement.gif" alt="Recherche d\'un adversaire..." width="30" height="30" />';
let partieEnCours = false;
let nIntervId = null;

btn.addEventListener("click", function () {
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
    document.getElementById("result").innerHTML =
      "Your pseudo must be a least 3 characters.";
  }
});

function retourNewPlayer(retour) {
  if (retour["error"]) {
    document.getElementById("result").innerText = retour["text"];
  } else {
    document.getElementById("result").innerText =
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
      nIntervId = null;
      document.getElementById("result").innerText = "Bonne chance !";
      document.getElementById("chargement").innerHTML = "";
      document.getElementById("player1").innerText = pseudo;
      document.getElementById("player2").innerText = retour["adversaire"];
      if (retour["prochainCoup"] == pseudo) {
        document.getElementById("player1").style.backgroundColor =
          "rgb(255, 200, 200)";
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
