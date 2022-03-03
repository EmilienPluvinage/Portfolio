<?php  
function getId(PDO $db, $pseudo) {
    // récupère l'id du joueur à partir de son pseudo
    $sqlquery = $db->prepare('SELECT id FROM joueur WHERE pseudo = :pseudo');
    $sqlquery->execute([ 'pseudo' => $pseudo ]);
    $resultsJoueurs = $sqlquery->fetchAll();

    foreach ($resultsJoueurs as $joueur) {  
            $idjoueur = $joueur['id'];
        }
    return $idjoueur;
}

function getOpponent(PDO $db, $idjoueur, $idpartie) {
    // récupère l'id de l'adversaire à partir de l'id du joueur et de la partie
    $sqlquery = $db->prepare('SELECT joueur FROM estDansLaPartie WHERE joueur<> :joueur AND partie = :partie'); 
    $sqlquery->execute([ 'joueur' => $idjoueur, 'partie'=>$idpartie ]);
    $resultsAdversaires = $sqlquery->fetchAll();

    foreach ($resultsAdversaires as $adversaire) {  
                $idadversaire = $adversaire['joueur'];
    }
    return $idadversaire;
}

function updateTimestamp(PDO $db, $pseudo){
    // met à jour le timestamp du joueur
$sqlquery = $db->prepare('UPDATE joueur SET timestamp= :timestamp WHERE pseudo= :pseudo');
$sqlquery->execute([ 'pseudo' => $pseudo, 'timestamp' => time()]);
}

function cleanDatabase(PDO $db, $secondes){
    // récupère les joueurs qui ne sont plus actifs (dont le timestamp est vieux d'au moins x secondes)
    // supprime tout ce qui les concerne (coups, estDansLaPartie, partie et joueur)
    $timeLimit = time() - $secondes;
    $sqlquery = $db->prepare('DELETE joueur, coup, partie, estDansLaPartie FROM estDansLaPartie 
    LEFT JOIN joueur ON joueur.id=estDansLaPartie.joueur 
    LEFT JOIN coup ON coup.partie = estDansLaPartie.partie
    LEFT JOIN partie ON partie.id = estDansLaPartie.partie
    WHERE joueur.timestamp < :timeLimit'); 
    $sqlquery->execute([ 'timeLimit' => $timeLimit]);
    $sqlquery = $db->prepare('DELETE FROM joueur
    WHERE joueur.timestamp < :timeLimit'); 
    $sqlquery->execute([ 'timeLimit' => $timeLimit]);
    return $timeLimit;
}
 ?>