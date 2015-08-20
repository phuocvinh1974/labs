<?php

include_once 'class-nosql-database.php';

$post = $_POST['post'];

$doc = $db->nosql->gsdb->user->findOne([
		'username'=>$post['username'],
		'password'=>$post['password'],
	]);

if ($doc) 
	echo json_encode(['granted'=>true, 'profile'=>'Name of User']);
else 
	echo json_encode(['granted'=>false, 'profile'=>null]);