<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT id, productId, rating, message, timestamp, fname, lname FROM reviews INNER JOIN accounts ON accounts.uid = reviews.author WHERE productId = ?');
    $sql->execute(array($_POST['id']));
    $reviews = array();
    while($review = $sql->fetch(PDO::FETCH_OBJ)) { $reviews[] = $review; }
    echo json_encode($reviews);
?>