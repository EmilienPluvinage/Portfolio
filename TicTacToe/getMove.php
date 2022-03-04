<?php  

if(isset($_POST['pseudo']))
{

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
        'mysql:host='.$host.';dbname='.$database.';charset=utf8',
        $user,
        $pwd);
    $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    // On commence par récupérer l'id du joueur
    $idjoueur = getId($db,$pseudo);

    // on met à jour le timestamp
    updateTimestamp($db,$pseudo);

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
        
        $idadversaire = getOpponent($db,$idjoueur,$idpartie);

        if($prochainCoup == $idjoueur || $return['defaite'] == true){
            // alors la partie n'est pas terminée, et c'est à nous de jouer, on récupère donc le dernier coup de l'adversaire.

            
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
        else{
            // alors c'est que c'est toujours à l'adversaire de jouer
            
            // on rajoute une vérification si jamais l'adversaire a dépassé les 30 secondes pour jouer.
            // normalement si c'est le cas il aurait du lui même appeler le script outOfTime.php et passer la partie en perdu
            // Mais s'il s'est déconnecté ca ne s'est pas fait donc on le rajoute ici
            // maintenant on récupère notre dernier coup joué
                
                $derniercoup = time();
                $sqlquery = $db->prepare('SELECT timestamp FROM coup WHERE joueur= :joueur AND partie = :partie ORDER BY id DESC LIMIT 1');
                $sqlquery->execute([ 'joueur' => $idjoueur, 'partie'=>$idpartie ]);
                $resultsTimestamps = $sqlquery->fetchAll();
        foreach ($resultsTimestamps as $timestamp) {  
            $derniercoup = $timestamp['timestamp'];
        }
        $delai = time() - $derniercoup;
        if($delai > 30)
        {
            // Alors c'est que l'adversaire est hors-délai, on lui fait perdre la partie
            // on met le prochainCoup à 0 et le vainqueur à idjoueur
            $sqlquery = $db->prepare('UPDATE partie SET prochainCoup=0, vainqueur= :joueur WHERE id= :partie');
            $sqlquery->execute([ 'joueur' => $idjoueur, 'partie' => $idpartie]);
            $return['victoire'] = true; 

        }

            

        }
        

    echo json_encode($return);

    }

 ?>