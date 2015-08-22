<?php
include_once 'class-nosql-database.php';

date_default_timezone_set('Asia/Ho_Chi_Minh');
$docs = $db->nosql->gsdb->schedules->find(['date'=>['$gte'=>new MongoDate(strtotime(date('Y-m-d')))]],['date'=>true])->sort(['date'=>1]);

$items = [];
foreach ($docs as $item) {
    $items[] = $item;
}

echo json_encode($items);