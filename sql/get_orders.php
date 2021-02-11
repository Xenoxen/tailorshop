<?php
    require_once('connection.php');
    // Gets user's seller id.
    $sql = $handler->prepare('SELECT sellerId FROM accounts WHERE uid = ?');
    $sql->execute(array($_POST['uid']));
    $row = $row = $sql->fetch(PDO::FETCH_OBJ);
    $sellerId = $row->sellerId;
    // Gets order items.
    $sql = $handler->prepare('SELECT *, orders.id AS orderId, `order-items`.id AS orderItemId, orders.name AS receiver, `order-items`.name AS itemName
    FROM `order-items`
    LEFT JOIN cancellations ON `order-items`.cancelId = cancellations.id
    LEFT JOIN orders ON orders.id = `order-items`.orderId
    WHERE sellerId = ?');
    $sql->execute(array($sellerId));
    $orderItems = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) {
        $orderItems[] = $row;
    }
    // Gets order entry.
    $orderEntries = array();
    foreach($orderItems as $item) {
        $sql = $handler->prepare('SELECT photo FROM products WHERE id = ?');
        $sql->execute(array($item->productId));
        $product = $sql->fetch(PDO::FETCH_OBJ);
        $orderInfo = $item;
        // Attach order entry info.
        $orderInfo->photo = $product->photo;
        $orderEntries[] = $orderInfo;
    }
    echo json_encode($orderEntries);
    die();
?>