<?php  
header('Content-type: application/json');

$return = array("error" => '', "victoire" => false);

$pseudo = $_POST['pseudo'];
$idpartie = $_POST['partie'];
$x = $_POST['x'];
$y = $_POST['y'];

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

 // et vérifier que c'est bien à lui de jouer
$sqlquery = $db->prepare('SELECT prochainCoup FROM partie WHERE id = :partie');
$sqlquery->execute([ 'partie' => $idpartie ]);
$resultsParties = $sqlquery->fetchAll();
     foreach ($resultsParties as $partie) {  
         $prochainCoup = $partie['prochainCoup'];
     }
     if($prochainCoup != $idjoueur)
     {
         $return['error'] = 'Erreur : Ce n\'est pas à vous de jouer!';
     }

// ensuite on vérifie que le coup n'as pas déjà été joué et fait bien partie de la grille
// on a déjà vérifié que x et y faisaient partie de la grille en JavaScript, mais par sécurité on le vérifier à nouveau
     if($x >= 0 && $x<=2 && $y>=0 && $y <= 2)
     {
        // on vérifie maintenant que le coup n'as pas encore été joué
        $sqlquery = $db->prepare('SELECT id FROM coup WHERE partie = :partie AND abscisse = :x AND ordonnee = :y');
        $sqlquery->execute([ 'partie' => $idpartie, 'x'=>$x, 'y'=>$y ]);
        $resultsCoups = $sqlquery->fetchAll();
        if(sizeof($resultsCoups) != 0)
        {
            // alors le coup a déjà été joué
            $return['error'] = 'Erreur : Cette case a déjà été jouée.';
        }
     }
     else
     {
        $return['error'] = 'Erreur : Les coordonnées sont incorrectes.';
     }
    

     if($return['error'] == '')
     {
        // alors on peut jouer le coup
        $insertCoup= $db->prepare('INSERT INTO coup (partie,joueur,abscisse,ordonnee,timestamp) VALUES (?,?,?,?,?)');
        $insertCoup->execute([$idpartie,$idjoueur,$x,$y,time()]);

        $coupsJoues = [];

        // pour finir il faut vérifier si jamais on a gagné ou pas, si oui on change le vainqueur de partie, sinon on change quand même prochainCoup
        $sqlquery = $db->prepare('SELECT abscisse,ordonnee FROM coup WHERE partie = :partie AND joueur = :joueur');
        $sqlquery->execute([ 'partie' => $idpartie, 'joueur' => $idjoueur ]);
        $resultsCoups = $sqlquery->fetchAll();
        foreach ($resultsCoups as $coup) 
        {  
            $coupsJoues[] = [$coup['abscisse'],$coup['ordonnee']];
        }

        // les 3 solutions pour gagner c'est:
        // 1 - avoir une ligne, donc 3 cases avec la même abscisse
        // 2 - avoir une colonne, donc 3 cases avec la même ordonnée
        // 3 - avoir une diagonale donc (0,0), (1,1), (2,2) ou bien (0,2), (1,1), (2,0).

        $partieGagnee = false;

        // on commence par vérifier les diagonales
        if( (in_array([0,0],$coupsJoues) && in_array([1,1],$coupsJoues) && in_array([2,2],$coupsJoues)) || 
        (in_array([0,2],$coupsJoues) && in_array([1,1],$coupsJoues) && in_array([2,0],$coupsJoues)))
        {
            // on a une diagonale
            $partieGagnee = true;
        }
        else
        {
            // sinon on va chercher les lignes et les colonnes
            for($i=0;$i<=2;$i++)
            {
                // on vérifie i ème ligne et i ème colonne
                if( (in_array([$i,0],$coupsJoues) && in_array([$i,1],$coupsJoues) && in_array([$i,2],$coupsJoues)) || 
                (in_array([0,$i],$coupsJoues) && in_array([1,$i],$coupsJoues) && in_array([2,$i],$coupsJoues)))
                {
                // on a une ligne ou une colonne
                    $partieGagnee = true;
                }
            }
        }

        // à ce stade, on sait si on a gagné ou pas. Si on a gagné, on peut changer le vainqueur et le prochainCoup.
        if($partieGagnee)
        {
            // on met le prochainCoup à 0 et le vainqueur à idjoueur
            $sqlquery = $db->prepare('UPDATE partie SET prochainCoup=0, vainqueur= :joueur WHERE id= :partie');
            $sqlquery->execute([ 'joueur' => $idjoueur, 'partie' => $idpartie]);
        }
        else
        {
            // on met le prochainCoup à $idadversaire, qu'on ne connait pas... On va donc le chercher.
            $idadversaire = getOpponent($db,$idjoueur,$idpartie);
            
            $sqlquery = $db->prepare('UPDATE partie SET prochainCoup= :adversaire WHERE id= :partie');
            $sqlquery->execute([ 'adversaire' => $idadversaire, 'partie' => $idpartie]);
        }

        $return["victoire"] = $partieGagnee;
     }

echo json_encode($return);

 ?>