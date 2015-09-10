<?php

include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/common/class-nosql-database.php';

$db = new NoSqlDatabase();

$doc = $db->nosql->gsdb->price->findOne();

echo json_encode($doc);