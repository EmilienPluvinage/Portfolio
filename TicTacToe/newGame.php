<?php  

if(isset($_POST['pseudo']))
{

    header('Content-type: application/json');
    error_reporting(E_ALL);
    ini_set('display_errors',1);
    include('config.php');
    include('functions.php');

    $return = array("error" => '', 
    "partie" => 0,
    'adversaire' => '',
    'prochainCoup' => '',
    'abscisse' => null,
    'ordonnee' => null,
    'timestamp' => 0
    );

    $pseudo = $_POST['pseudo'];

    $db = new PDO(
        'mysql:host='.$host.';dbname=tictactoe;charset=utf8',
        $user,
        $pwd);
    $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );


    // On commence par mettre à jour le timestamp
    updateTimestamp($db,$pseudo);

    $idjoueur = getId($db,$pseudo);

    // Ensuite on note qu'on est bien en recherche de partie
    $sqlquery = $db->prepare('UPDATE joueur SET recherche=1 WHERE pseudo= :pseudo');
    $sqlquery->execute([ 'pseudo' => $pseudo]);

    // Ensuite on regarde si on est déjà dans une partie qui aurait été créée par quelqu'un d'autre, et qui n'est pas terminée
    $sqlquery = $db->prepare('SELECT estDansLaPartie.partie AS partie, estDansLaPartie.joueur AS joueur 
    FROM estDansLaPartie 
    LEFT JOIN joueur ON joueur.id=estDansLaPartie.joueur 
    LEFT JOIN partie ON partie.id=estDansLaPartie.partie
    WHERE joueur.pseudo= :pseudo
    AND partie.vainqueur =0');
    $sqlquery->execute([ 'pseudo' => $pseudo ]);
    $results = $sqlquery->fetchAll();
    if(sizeof($results) == 0 )
    { // on est pas encore dans une partie, on va donc chercher un autre joueur pour en créer éventuellement une
        // on commence par chercher tous les id joueurs d'une part qui ont recherche sur true

        $idadversaire = 0;
        $adversaire ="";
        $adversaireDisponible=false;

        $sqlquery = $db->prepare('SELECT id, pseudo FROM joueur WHERE pseudo <> :pseudo AND recherche=1');
        $sqlquery->execute([ 'pseudo' => $pseudo ]);
        $resultsJoueurs = $sqlquery->fetchAll();

        foreach ($resultsJoueurs as $joueur) {  
        
            // alors on a trouvé un adversaire
            $adversaireDisponible = true;
            $idadversaire = $joueur['id'];
            $adversaire = $joueur['pseudo'];
        
        }

        if($adversaireDisponible)
        {
        // Maintenant qu'on a trouvé un adversaire, il nous reste à créer une partie
        // on commence par récupérer l'id de notre joueur (pas de l'adversaire mais bien du joueur qui appelle le script)
        
        
        $insertPartie= $db->prepare('INSERT INTO partie (prochainCoup,vainqueur, timestamp) VALUES (?,0,?)');
        $insertPartie->execute([$idjoueur,time()]);

        //on récupère l'id de notre partie, et ensuite on créé notre entrée dans estDansLaPartie;
        $sqlquery = $db->prepare('SELECT id FROM partie WHERE prochainCoup = :joueur');
        $sqlquery->execute([ 'joueur' => $idjoueur ]);
        $resultsPartie = $sqlquery->fetchAll();

        foreach ($resultsPartie as $partie) {  
            $idpartie = $partie['id'];
        }
        $insertDansPartie= $db->prepare('INSERT INTO estDansLaPartie (partie,joueur) VALUES (:partie,:joueur),(:partie,:adversaire)');    
        $insertDansPartie->execute([ 'partie' => $idpartie, 'joueur' => $idjoueur, 'adversaire' => $idadversaire]);
        
        // on passe sur recherche=false puisqu'on est dans une partie désormais
        $sqlquery = $db->prepare('UPDATE joueur SET recherche=0 WHERE pseudo= :pseudo OR pseudo = :adversaire');
        $sqlquery->execute([ 'pseudo' => $pseudo, 'adversaire' => $idadversaire]);

        

        // on complète maintenant le contenu de $return à renvoyer à notre API Fetch
        $return['partie'] = $idpartie;
        $return['adversaire'] = $adversaire;
        $return['prochainCoup'] = $pseudo;
        }

        

    }
    elseif(sizeof($results) == 1)
    {
        
        // on est dans une partie, on renvoie les infos pour afficher la grille, le nom de l'adversaire, etc...
        // On va chercher qui est l'autre joueur qui host la partie
        $sqlquery = $db->prepare('SELECT pseudo, prochainCoup, abscisse, ordonnee, coup.timestamp, coup.joueur FROM estDansLaPartie 
        LEFT JOIN joueur ON joueur.id=estDansLaPartie.joueur 
        LEFT JOIN coup ON coup.partie = estDansLaPartie.partie
        LEFT JOIN partie ON partie.id = estDansLaPartie.partie
        WHERE joueur.pseudo<> :pseudo AND estDansLaPartie.partie = :partie');
        $sqlquery->execute([ 'pseudo' => $pseudo, 'partie' => $results[0]['partie'] ]);
        $results2 = $sqlquery->fetchAll();
        $return['partie'] = $results[0]['partie'];
        $return['adversaire'] = $results2[0]['pseudo'];
        if($results[0]['joueur'] == $results2[0]['prochainCoup'])
        {$return['prochainCoup'] = $pseudo; }
        else
    {$return['prochainCoup'] = $results2[0]['pseudo']; }

        $return['abscisse'] = $results2[0]['abscisse'];
        $return['ordonnee'] = $results2[0]['ordonnee'];
        $return['timestamp'] = $results2[0]['timestamp'];    

  // on passe sur recherche=false puisqu'on est dans une partie désormais
        $sqlquery = $db->prepare('UPDATE joueur SET recherche=0 WHERE pseudo= :pseudo OR pseudo = :adversaire');
        $sqlquery->execute([ 'pseudo' => $pseudo, 'adversaire' => $return['adversaire']]);

    
        
    }
    else{
        // On est dans plus d'une partie à la fois, donc c'est embêtant. On renvoie une erreur
        $return['error'] = 'There\'s a technical issue since you seem to be in several games simultaneously.';
    }
    echo json_encode($return);

}

 ?>