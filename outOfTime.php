<?php  
header('Content-type: application/json');

$return = array("error" => false, "text" => '');

$pseudo = $_POST['pseudo'];
$idpartie = $_POST['partie'];
error_reporting(E_ALL);
ini_set('display_errors',1);
include('config.php');

$db = new PDO(
    'mysql:host='.$host.';dbname=tictactoe;charset=utf8',
    $user,
    $pwd);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );


// On commence par récupérer l'id du joueur
$sqlquery = $db->prepare('SELECT id FROM joueur WHERE pseudo = :pseudo');
$sqlquery->execute([ 'pseudo' => $pseudo ]);
$resultsJoueurs = $sqlquery->fetchAll();

foreach ($resultsJoueurs as $joueur) {  
         $idjoueur = $joueur['id'];
     }

     // Ensuite on vérifie que c'est bien à lui de jouer le prochain coup
$sqlquery = $db->prepare('SELECT * FROM partie WHERE prochainCoup= :joueur AND id= :partie');
$sqlquery->execute(['joueur' => $idjoueur, 'partie' => $idpartie]);
$results = $sqlquery->fetchAll();

if(sizeof($results) >1 )
{
    $return['error'] = true;
    $return['text'] = 'Error : Several games are being played at the same time with the same pseudo.';
}
elseif(sizeof($results) == 0)
{
    $return['error'] = true;
    $return['text'] = "Error : It's not your turn to play.";
}
else
{
    // d'abord on doit retrouver l'id de l'adversaire

    $sqlquery = $db->prepare('SELECT joueur FROM estDansLaPartie WHERE joueur<> :joueur AND partie = :partie');
    $sqlquery->execute([ 'joueur' => $idjoueur, 'partie'=>$idpartie ]);
    $resultsAdversaires = $sqlquery->fetchAll();

    foreach ($resultsAdversaires as $adversaire) {  
        $idadversaire = $adversaire['joueur'];
    }

    // on va maintenant vérifier que le delai de 30 secondes est effectivement dépassé

    // cas particulier à prendre en compte : aucun coup n'a encore été joué

    $sqlquery = $db->prepare('SELECT timestamp FROM coup WHERE partie = :partie AND joueur= :adversaire ORDER BY id DESC LIMIT 1');
    $sqlquery->execute([ 'partie' => $idpartie, 'adversaire' => $idadversaire]);
    $resultsTime = $sqlquery->fetchAll();
    foreach ($resultsTime as $time) {  
        $timestamp = $time['timestamp'];
    }
    
    $delai = time() - $timestamp;

    if($delai < 30)
    {
        $return['error'] = true;
        $return['text'] = "Error : Hurry up ! You've still got time to play.";
    }
    else
    {
        // le délai est effectivement dépassé, le joueur a perdu, on met à jour les tables.
        // on met le prochainCoup à 0 et le vainqueur à idadversaire
        $sqlquery = $db->prepare('UPDATE partie SET prochainCoup=0, vainqueur= :joueur WHERE id= :partie');
        $sqlquery->execute([ 'joueur' => $idadversaire, 'partie' => $idpartie]);

    }
    
}

$return['text'] = $return['text'] . " pseudo = " . $pseudo . " partie = " . $idpartie;
echo json_encode($return);

 ?>