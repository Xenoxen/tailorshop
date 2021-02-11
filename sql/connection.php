<?php
	$handler = new PDO('mysql:host=localhost;dbname=tailorshop','root','');
	$sql = $handler->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
	date_default_timezone_set("Asia/Hong_Kong");
?>