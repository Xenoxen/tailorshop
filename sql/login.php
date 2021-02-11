<?php
    require_once("connection.php");
    // Used to recognize JSON data posted by Axios.js
    $data = json_decode(file_get_contents("php://input"), true);
    //Check if the account exists
    $sql = $handler->prepare("SELECT * FROM accounts WHERE email = ?");
    $sql->execute(array($data['email']));
    $count = $sql->rowCount();
    // If account exists, its data will be fetched.
    if($count === 1) {
        $info = $sql->fetch(PDO::FETCH_OBJ);
        $verified = password_verify($data['password'], $info->password);
        // Checks if password entered matches the hashed password in account's data.
        if ($verified) {
            // Encodes initial account information as a JSON and sends it back.
            $accountData = new \stdClass();
            $accountData->uid = $info->uid;
            $accountData->displayName = $info->fname . ' ' . $info->lname;
            $accountData->email = $info->email;
            $accountData->type = $info->type;
            header("HTTP/1.1 200 OK");
            die(json_encode($accountData));
        } else {
            $error = 'Wrong email or password.  Please try again.';
            header('HTTP/1.1 500 Internal Server');
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'ERROR', 'code' => 2000)));
        }
        die();
    } else {
        $error = 'Account does not exists under this email.  Please try again.';
    }
    die();
?>