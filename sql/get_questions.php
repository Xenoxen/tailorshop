<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT * FROM questions WHERE product = ?');
    $sql->execute(array($_POST['id']));
    $questions = array();
    while($row = $sql->fetch(PDO::FETCH_OBJ)) { $questions[] = $row; }
    echo json_encode($questions);
    die();
?>