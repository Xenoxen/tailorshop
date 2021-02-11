<?php
    require_once('connection.php');
    if (isset($_POST['uid'])) {
        $sql = $handler->prepare('SELECT sellerId FROM accounts WHERE uid = ?');
        $sql->execute(array($_POST['uid']));
        $row = $sql->fetch(PDO::FETCH_OBJ);
        $sellerId = $row->sellerId;
        $sql = $handler->prepare('SELECT * FROM products WHERE seller = ?');
        $sql->execute(array($sellerId));
        $products = array();
        while($row = $sql->fetch(PDO::FETCH_OBJ)) { $products[] = $row; }
        echo json_encode($products);
        die();
    }
?>