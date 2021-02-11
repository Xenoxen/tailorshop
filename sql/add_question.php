<?php
    require_once('connection.php');
    $form = array($_POST['question'], $_POST['product'], $_POST['author']);
    $sql = $handler->prepare('INSERT INTO questions(question, product, author) VALUES(?,?,?)');
    $sql->execute($form);
    // returns the question data.
    $sql = $handler->prepare('SELECT * FROM questions ORDER BY id DESC LIMIT 1');
    $sql->execute();
    $question = $sql->fetch(PDO::FETCH_OBJ);
    echo json_encode($question);
    die();
?>