<?php  
header('Content-type: application/json');

$return = array("error" => false, "text" => '');

$pseudo = $_POST['pseudo'];
error_reporting(E_ALL);
ini_set('display_errors',1);
include('config.php');

$db = new PDO(
    'mysql:host='.$host.';dbname=tictactoe;charset=utf8',
    $user,
    $pwd);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );


// On commence par voir si le pseudo existe déjà
$sqlquery = $db->prepare('SELECT * FROM joueur WHERE pseudo= :pseudo');
$sqlquery->execute([ 'pseudo' => $pseudo ]);
$results = $sqlquery->fetchAll();

if(sizeof($results) >0 )
{
    $return['error'] = true;
    $return['text'] = 'This pseudo already exists.';
}
else
{
    // alors le pseudo n'existe pas, on va l'ajouter
    $sqlinsert ='INSERT INTO joueur (pseudo,timestamp) VALUES (?,?)';
    $insertPseudo= $db->prepare($sqlinsert);
    $insertPseudo->execute([$pseudo,time()]);
    
}

echo json_encode($return);

 ?>