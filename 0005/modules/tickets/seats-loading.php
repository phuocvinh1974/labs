<?php
include_once '../common/class-nosql-database.php';

$post = $_POST['data'];

$doc = $db->nosql->gsdb->tickets->findOne([
    'date'=>new MongoDate(strtotime($post['date'])),
    'movie' => $post['movie'],
    'start' => $post['start'],
    'room' => $post['room']
], ['seats'=>true]);

if ($doc) {

	$items = [];
	
	foreach ($doc['seats'] as $k=>$item) {
	    $items[$k] = $item;
	}

	echo json_encode($items);
} else echo json_encode([]);



