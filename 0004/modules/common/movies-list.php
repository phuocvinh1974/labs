<?php

include_once 'class-nosql-database.php';

try {
    $db = new NoSqlDatabase();
} catch (Exception $e) {
    exit(json_encode(['error' => true, 'error_msg' => $e->getMessage()]));
}

$docs = $db->nosql->gsdb->movies->find()->sort(['ReleaseDate' => -1]);

$items = [];
foreach ($docs as $item) {
    $items[] = $item;
}

echo json_encode(['items' => $items]);
