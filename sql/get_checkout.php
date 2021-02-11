<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT * FROM accounts where uid = ?');
    $sql->execute(array($_POST['uid']));
    $row = $sql->fetch(PDO::FETCH_OBJ);
    $account = $row;
    // Get cart items.
    $sql = $handler->prepare('SELECT * FROM cart where accountId = ?');
    $sql->execute(array($_POST['uid']));
    $cart = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) { $cart[] = $row; }
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
    $account->cart = $cartItems;
    echo json_encode($account);
    die();
?>