<?php
    require_once('connection.php');
    $sql = $handler->prepare('UPDATE `order-items` SET status = ?, updated = now() WHERE id = ?');
    $sql->execute(array($_POST['status'], $_POST['id']));
    die();
?>