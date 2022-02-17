<?php  
header('Content-type: application/json');

$return = array("error" => '', 
"defaite" => false,
"victoire" => false,
"prochainCoup" => 'adversaire',
"timestamp" => 0,
"x" => 0,
"y" => 0
);

$pseudo = $_POST['pseudo'];
$idpartie = $_POST['partie'];

error_reporting(E_ALL);
ini_set('display_errors',1);
include('config.php');
include('functions.php');

$db = new PDO(
    'mysql:host='.$host.';dbname=tictactoe;charset=utf8',
    $user,
    $pwd);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

// On commence par récupérer l'id du joueur
$idjoueur = getId($db,$pseudo);

 // et regarder si c'est à lui de jouer, ou bien si l'adversaire à gagné la partie.
$sqlquery = $db->prepare('SELECT prochainCoup, vainqueur FROM partie WHERE id = :partie');
$sqlquery->execute([ 'partie' => $idpartie ]);
$resultsParties = $sqlquery->fetchAll();
     foreach ($resultsParties as $partie) {  
         $prochainCoup = $partie['prochainCoup'];
         $vainqueur = $partie['vainqueur'];
     }

     if($vainqueur != 0)
     {
         if($vainqueur == $idjoueur)
         {
             $return['victoire'] = true;
         }
         else{
         // alors la partie est terminée, l'adversaire a gagné
        $return['defaite'] = true;


         }
     }
     
     if($prochainCoup == $idjoueur || $return['defaite'] == true){
        // alors la partie n'est pas terminée, et c'est à nous de jouer, on récupère donc le dernier coup de l'adversaire.
        // d'abord on doit retrouver l'id de l'adversaire

        $sqlquery = $db->prepare('SELECT joueur FROM estDansLaPartie WHERE joueur<> :joueur AND partie = :partie');
            $sqlquery->execute([ 'joueur' => $idjoueur, 'partie'=>$idpartie ]);
            $resultsAdversaires = $sqlquery->fetchAll();

            foreach ($resultsAdversaires as $adversaire) {  
                $idadversaire = $adversaire['joueur'];
            }
        
            // maintenant on récupère son dernier coup joué
            $sqlquery = $db->prepare('SELECT abscisse, ordonnee, timestamp FROM coup WHERE joueur= :joueur AND partie = :partie ORDER BY id DESC LIMIT 1');
            $sqlquery->execute([ 'joueur' => $idadversaire, 'partie'=>$idpartie ]);
            $resultsCoups = $sqlquery->fetchAll();

            foreach ($resultsCoups as $coup) {  
                $return['x']= $coup['abscisse'];
                $return['y'] = $coup['ordonnee'];
                $return['timestamp'] = $coup['timestamp'];
            }
            $return['prochainCoup'] = $prochainCoup;

     }
     

echo json_encode($return);

 ?>