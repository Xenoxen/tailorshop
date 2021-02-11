<?php
    require_once('connection.php');
    // Adds cancellation record.
    $sql = $handler->prepare('INSERT INTO cancellations(reason, uid, orderId, itemId) VALUES(?,?,?,?)');
    $sql->execute(array($_POST['reason'], $_POST['uid'], $_POST['orderId'], $_POST['id']));
    // Gets record.
    // Gets the added product.
    $sql = $handler->prepare('SELECT * FROM cancellations ORDER BY id DESC LIMIT 1');
    $sql->execute();
    $cancel = $sql->fetch(PDO::FETCH_OBJ);
    $cancelId = $cancel->id;
    // Set order item status to 'Cancelled'.
    $sql = $handler->prepare('UPDATE `order-items` SET status = ?, updated = now(), cancelId = ? WHERE id = ?');
    $sql->execute(array('Cancelled', $_POST['id'], $cancelId));
    die();
?>