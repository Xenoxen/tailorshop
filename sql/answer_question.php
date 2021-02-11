<?php
    require_once('connection.php');
    $sql = $handler->prepare('UPDATE questions SET answer = ? WHERE id = ?');
    $sql->execute(array($_POST['answer'], $_POST['id']));
    echo $_POST['id'];
    die();
?>