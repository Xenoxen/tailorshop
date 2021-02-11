<?php
    require_once('connection.php');
    // Get profile info.
    $sql = $handler->prepare('SELECT * FROM accounts WHERE uid = ?');
    $sql->execute(array($_POST['uid']));
    $info = $sql->fetch(PDO::FETCH_OBJ);
    $profile = new \stdClass();
    $profile->info = $info;
    // Get user's orders.
    $sql = $handler->prepare('SELECT * FROM orders WHERE uid = ?');
    $sql->execute(array($_POST['uid']));
    $orders = array();
    while($order = $sql->fetch(PDO::FETCH_OBJ)) {
        $orders[] = $order;
    }
    $orderList = array();
    // Get order items and its info.
    foreach($orders as $order) {
        $orderId = $order->id;
        $sql = $handler->prepare('SELECT * FROM `order-items` LEFT JOIN cancellations ON `order-items`.cancelId = cancellations.id WHERE `order-items`.orderId = ?');
        $sql->execute(array($orderId));
        $orderItems = array();
        while($item = $sql->fetch(PDO::FETCH_OBJ)) {
            $orderItems[] = $item;
        }
        // Get updated photos of products in order.
        $parsedOrderItems = array();
        foreach($orderItems as $item) {
            $sql = $handler->prepare('SELECT photo FROM products WHERE id = ?');
            $sql->execute(array($item->productId));
            $oItem = $sql->fetch(PDO::FETCH_OBJ);
            $item->photo = $oItem->photo;
            $parsedOrderItems[] = $item;
        }
        $order->items = $parsedOrderItems;
        $orderList[] = $order;
    }
    $profile->orders = $orderList;
    echo json_encode($profile);
    die();
?>