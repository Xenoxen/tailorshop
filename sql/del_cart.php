<?php
    require_once('connection.php');
    $sql = $handler->prepare('DELETE FROM cart WHERE ci_id = ?');
    $sql->execute(array($_POST['id']));
    die();
?>