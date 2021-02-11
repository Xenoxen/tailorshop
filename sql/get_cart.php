<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT * FROM cart WHERE accountId = ?');
    $sql->execute(array($_POST['id']));
    $cart = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) {
        $cart[] = $row;
    }
    $cartItems = array();
    foreach($cart as $cartItem) {
        $productId = $cartItem->productId;
        // Get product info
        $sql = $handler->prepare('SELECT * FROM products WHERE id = ?');
        $sql->execute(array($productId));
        $product = $sql->fetch(PDO::FETCH_OBJ);
        $cartItem->price = $product->price;
        $cartItem->photo = $product->photo;
        $cartItems[] = $cartItem;
    }
    echo json_encode($cartItems);
    die();
?>