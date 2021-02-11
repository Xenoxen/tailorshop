<?php
    require_once('connection.php');
    $form = array($_POST['product'], $_POST['rating'], $_POST['message'], $_POST['uid']);
    $sql = $handler->prepare('INSERT INTO reviews(productId, rating, message, author) values(?,?,?,?)');
    $sql->execute($form);
    die();
?>