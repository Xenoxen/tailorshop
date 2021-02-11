<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT sellerId FROM accounts WHERE uid = ?');
    $sql->execute(array($_POST['uid']));
    $row = $sql->fetch(PDO::FETCH_OBJ);
    $sellerId = $row->sellerId;
    // Get all questions for seller's products.
    $sql = $handler->prepare('SELECT *,  questions.id AS qId FROM questions INNER JOIN products ON products.id = questions.product WHERE products.seller = ?');
    $sql->execute(array($sellerId));
    $questions = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) { $questions[] = $row; }
    echo json_encode($questions);
    die();
?>