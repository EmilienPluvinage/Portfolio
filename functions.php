<?php  
function getId(PDO $db, $pseudo) {
    $sqlquery = $db->prepare('SELECT id FROM joueur WHERE pseudo = :pseudo');
    $sqlquery->execute([ 'pseudo' => $pseudo ]);
    $resultsJoueurs = $sqlquery->fetchAll();

    foreach ($resultsJoueurs as $joueur) {  
            $idjoueur = $joueur['id'];
        }
    return $idjoueur;
}

function getOpponent(PDO $db, $idjoueur, $idpartie) {
    $sqlquery = $db->prepare('SELECT joueur FROM estDansLaPartie WHERE joueur<> :joueur AND partie = :partie'); 
    $sqlquery->execute([ 'joueur' => $idjoueur, 'partie'=>$idpartie ]);
    $resultsAdversaires = $sqlquery->fetchAll();

    foreach ($resultsAdversaires as $adversaire) {  
                $idadversaire = $adversaire['joueur'];
    }
    return $idadversaire;
}

 ?>