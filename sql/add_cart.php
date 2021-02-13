<?php
    require_once('connection.php');
    if (isset($_POST['variant'])) {
        $variant = $_POST['variant'];
    } else {
        $variant = NULL;
    }
    $form = array($_POST['product'], $_POST['seller'], $_POST['account'], $_POST['name'], $_POST['qty'], $_POST['size'], $_POST['head'], $_POST['chest'], $_POST['waist'], $_POST['back'], $_POST['sleeve'], $_POST['bust'], $_POST['hip'], $_POST['variant']);
    $sql = $handler->prepare('INSERT INTO cart(productId, sellerId, accountId, name, qty, size, head, chest, waist, back, sleeve, bust, hip, variant) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $sql->execute($form);
    // Return cart item data.
    $sql = $handler->prepare('SELECT * FROM cart ORDER BY ci_id DESC LIMIT 1');
    $sql->execute();
    $item = $sql->fetch(PDO::FETCH_OBJ);
    echo json_encode($item);
    die();
?>