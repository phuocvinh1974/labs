<?php

include_once 'class-nosql-database.php';

$doc = $db->nosql->gsdb->price->findOne();

echo json_encode($doc);