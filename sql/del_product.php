<?php
    require_once('connection.php');
    $form = array($_POST['id']);
    $sql = $handler->prepare('DELETE FROM products WHERE id = ?');
    $sql->execute($form);
    die();
?>