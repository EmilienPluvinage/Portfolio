<?php  

if(isset($_POST['pseudo']))
{

    header('Content-type: application/json');
    error_reporting(E_ALL);
    ini_set('display_errors',1);
    include('config.php');
    include('functions.php');

    $return = array("error" => false, "text" => '');

    $pseudo = $_POST['pseudo'];

    $db = new PDO(
        'mysql:host='.$host.';dbname=tictactoe;charset=utf8',
        $user,
        $pwd);
    $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    // On met à jour le timestamp
    updateTimestamp($db,$pseudo);

    echo json_encode($return);

}
 ?>