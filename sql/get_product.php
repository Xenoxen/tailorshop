<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT * FROM products WHERE products.id = ?');
    $sql->execute(array($_POST['id']));
    $row = $sql->fetch(PDO::FETCH_OBJ);
    $product = $row;
    // If user is logged in, it will check if the account has a completed order for this product to allow them to place a review.
    if (isset($_POST['uid'])) {
        $sql = $handler->prepare('SELECT uid, productId, orderId, status FROM `order-items` AS items LEFT JOIN orders ON orders.id = items.orderId WHERE orders.uid = ? AND items.status = "Delivered"');
        $sql->execute(array($_POST['uid']));
        $count = $sql->rowCount();
        if ($count >= 1) {
            $product->ordered = true;
        } else {
            $product->ordered = false;
        }
    }
    $product = $row;
    echo json_encode($product);
    die();
?>