<?php
    require_once('connection.php');
    // Creates order
    $form = array($_POST['uid'], $_POST['name'], $_POST['email'], $_POST['contact'], $_POST['address'], $_POST['city'], $_POST['province'], $_POST['subTotal'], $_POST['deliveryFee'], $_POST['total']);
    $sql = $handler->prepare('INSERT INTO orders(uid, name, email, contact, address, city, province, subTotal, deliveryFee, total) VALUES(?,?,?,?,?,?,?,?,?,?)');
    $sql->execute($form);
    // Gets order number (order id).
    $sql = $handler->prepare('SELECT id FROM orders ORDER BY id DESC LIMIT 1');
    $sql->execute();
    $order = $sql->fetch(PDO::FETCH_OBJ);
    $orderId = $order->id;
    // Inserts all cart items into order items table.
    $cart = json_decode($_POST['cart']);
    foreach($cart as $item) {
        $form = array($item->name, $item->price, $item->size, $item->qty, $item->sellerId, $item->productId, $orderId, $item->head, $item->chest, $item->waist, $item->back, $item->sleeve, $item->bust, $item->hip, $item->variant);
        $sql = $handler->prepare('INSERT INTO `order-items`(name, price, size, qty, sellerId, productId, orderId, head, chest, waist, back, sleeve, bust, hip, variant) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $sql->execute($form);
    }
    // Delete all items in user's cart.
    $sql = $handler->prepare('DELETE FROM cart WHERE accountId = ?');
    $sql->execute(array($_POST['uid']));
    echo $order->id;
    die();
?>