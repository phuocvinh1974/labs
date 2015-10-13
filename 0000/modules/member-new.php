<?php
include_once 'class-nosql-database.php';

 $nextMemberId = $db->nosql->gsdb->counters->findAndModify(
 	['_id'=>'memberID'],
 	['$inc'=>['seq'=>1]],
 	null,
 	['new'=>true]);

$db->nosql->gsdb->members->insert([

		'_id'=>$nextMemberId['seq'],

		'firstName'=>$_POST['firstName'],
		'lastName'=>$_POST['lastName'],
		'email'=>$_POST['email'],
		'telephone'=>$_POST['telephone'],
		'mobilePhone'=>$_POST['mobilePhone'],

		'logs'=>[
			'total'=>['currentPoint'=>0,'tickets'=>0,'payment'=>0]
		]
	]);