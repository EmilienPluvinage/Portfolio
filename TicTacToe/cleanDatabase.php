<?php  
header('Content-type: application/json');
error_reporting(E_ALL);
ini_set('display_errors',1);
include('config.php');
include('functions.php');

$return = array("error" => false, "text" => '');

$db = new PDO(
    'mysql:host='.$host.';dbname=tictactoe;charset=utf8',
    $user,
    $pwd);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

// On supprime tout ce qui concerne les joueurs déconnectés depuis plus d'une minute
cleanDatabase($db,60);

echo json_encode($return);

 ?>