<?php

include_once 'class-nosql-database.php';

$date = $_POST['date'];

date_default_timezone_set('Asia/Ho_Chi_Minh');

$doc = $db->nosql->gsdb->schedules->findOne([ 'date' => new MongoDate( strtotime( $date ) ) ]);

if ($doc) 
	echo json_encode( $doc['schedules'] );
else 
	echo json_encode( ['notfound' => true] );
