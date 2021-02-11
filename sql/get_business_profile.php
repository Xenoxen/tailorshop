<?php
    require_once('connection.php');
    // Get business info.
    if(isset($_POST['uid'])) {
        $sql = $handler->prepare('SELECT sellerId FROM accounts WHERE uid = ?');
        $sql->execute(array($_POST['uid']));
        $row = $sql->fetch(PDO::FETCH_OBJ);
        $sellerId = $row->sellerId;
    } else {
        $sellerId = $_POST['id'];
    }
    $sql = $handler->prepare('SELECT * FROM sellers WHERE id = ?');
    $sql->execute(array($sellerId));
    $row = $sql->fetch(PDO::FETCH_OBJ);
    $profile = $row;
    // Get all products.
    $sql = $handler->prepare('SELECT * FROM products WHERE seller = ?');
    $sql->execute(array($sellerId));
    $products = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) { $products[] = $row; }
    $profile->products = $products;
    echo json_encode($profile);
    die();
?>