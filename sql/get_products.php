<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT * FROM products');
    $sql->execute();
    $products = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) { $products[] = $row; }
    echo json_encode($products);
    die();
?>