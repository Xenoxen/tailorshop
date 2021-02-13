<?php 
    require_once('connection.php');
    // Used to read JSON data posted by Axios.js
    $type = $_POST['type'];
    $password = password_hash($_POST['pass'], PASSWORD_DEFAULT);
    switch ($type) {
        case 'customer':
            $form = array($type, $_POST['fname'], $_POST['lname'], $_POST['address'], $_POST['city'], $_POST['province'], $_POST['contact'], $_POST['email'], $password);
            $sql = $handler->prepare('INSERT INTO accounts(type, fname,lname,address,city,province,contact,email,password) VALUES(?,?,?,?,?,?,?,?,?)');
            $sql->execute($form);
            break;
        case 'seller':
            $file = $_FILES['logo']['tmp_name'];
            $dest = '../storage/' . $_POST['bname'] . '/' . $_FILES['logo']['name'];
            $path = './storage/' . $_POST['bname'] . '/' . $_FILES['logo']['name'];
            $folder = '../storage/' . $_POST['bname'];
            // If the folder for the seller does not exist, it will create one.
            if(!file_exists($folder)) { mkdir($folder, 0777); }
            if (move_uploaded_file($file, $dest)) {
                // Creates seller information.
                $seller = array($_POST['bname'], $_POST['baddress'], $path);
                $sql = $handler->prepare('INSERT INTO sellers(name, address, logo) VALUES(?,?,?)');
                $sql->execute($seller);
                // Get latest row entry in seller.
                $sql = $handler->prepare('SELECT id FROM sellers ORDER BY id DESC LIMIT 1');
                $sql->execute();
                $row = $sql->fetch(PDO::FETCH_OBJ);
                $sellerId = $row->id;
                // Upload data.
                $form = array($type, $_POST['fname'], $_POST['lname'], $_POST['address'], $_POST['city'], $_POST['province'], $_POST['contact'], $_POST['email'], $password, $sellerId);
                $sql = $handler->prepare('INSERT INTO accounts(type, fname,lname,address,city,province,contact,email,password, sellerId) VALUES(?,?,?,?,?,?,?,?,?,?)');
                $sql->execute($form);
            }
            break;
    }
    die();
?>