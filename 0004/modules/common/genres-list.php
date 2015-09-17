<?php

include_once 'class-nosql-database.php';

$db = new NoSqlDatabase();

$docs = $db->nosql->gsdb->genres->find()->sort(['name' => -1]);

$items = [];
foreach ($docs as $item) {
    $items[] = $item;
}

echo json_encode(['items' => $items]);

