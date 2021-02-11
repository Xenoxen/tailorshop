<?php
    require_once('connection.php');
    $sql = $handler->prepare('SELECT sellerId FROM accounts WHERE uid = ?');
    $sql->execute(array($_POST['uid']));
    $row = $sql->fetch(PDO::FETCH_OBJ);
    $sql = $handler->prepare('SELECT name FROM sellers WHERE id = ?');
    $sellerId = $row->sellerId;
    $sql->execute(array($sellerId));
    $row = $sql->fetch(PDO::FETCH_OBJ);
    $bname = $row->name;
    // File Info
    $filetemp = $_FILES['photo']['tmp_name'];
    $filename = $_FILES['photo']['name'];
    $file_ext = pathinfo($filename, PATHINFO_EXTENSION);
    $filename = $_POST['name'] . '.' . $file_ext;
    $dest = '../storage/' . $bname . '/products/' . $filename;
    $folder = '../storage/' . $bname . '/products';
    // For reference in database row.
    $path = './storage/' . $bname . '/products/' . $filename;
    // Encodes sizes as JSON.
    $sizes = json_encode($_POST['sizes']);
    if(!file_exists($folder)) { mkdir($folder, 0777); }
    if ($_FILES['photo']) { move_uploaded_file($filetemp, $dest); }
    $form = array($_POST['name'], $_POST['description'], $_POST['category'], $_POST['price'], $sizes, $path, $sellerId, $_POST['id']);
    $sql = $handler->prepare('UPDATE products SET name=?, description=?, category=?, price=?, sizes=?, photo=?, seller=? WHERE id = ?');
    $sql->execute($form);
    // Gets the added product.
    $sql = $handler->prepare('SELECT * FROM products ORDER BY id DESC LIMIT 1');
    $sql->execute();
    $product = $sql->fetch(PDO::FETCH_OBJ);
    echo json_encode($product);
    die();
?>