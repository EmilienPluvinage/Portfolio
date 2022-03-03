<?php  
header('Content-type: application/json');
error_reporting(E_ALL);
ini_set('display_errors',1);
include('config.php');
include('functions.php');

$return = array("error" => false, "text" => '');

    $db = new PDO(
        'mysql:host='.$host.';dbname='.$database.';charset=utf8',
        $user,
        $pwd);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

// On supprime tout ce qui concerne les joueurs déconnectés depuis plus de 2 minutes
$return["text"] = cleanDatabase($db,120);

echo json_encode($return);

 ?>