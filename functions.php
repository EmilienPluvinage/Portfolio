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


 ?>