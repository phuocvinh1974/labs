<?php

include_once 'class-nosql-database.php';

$post = $_POST['post'];

$doc = $db->nosql->gsdb->users->findOne([
		'username'=>$post['username'],
		'password'=>$post['password'],
	]);

if ($doc) 
	echo json_encode(['granted'=>true, 'profile'=>$doc['profile']]);
else 
	echo json_encode(['granted'=>false, 'profile'=>null]);