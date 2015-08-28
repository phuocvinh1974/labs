<?php

include_once '../common/class-nosql-database.php';

$post = $_POST['post'];

$doc = $db->nosql->gsdb->tickets->findOne([
    'date'=>new MongoDate( strtotime( $post['infos']['date'] ) ),
    'movie' => $post['infos']['movie'], 'start' => $post['infos']['start'], 'room' => $post['infos']['room']
]);

if ($doc) {

	$seats = new stdClass();

	foreach ($post['seats'] as $key => $value) {
		$seats->$key = ['status'=>'paid'];
	}

    $db->nosql->gsdb->tickets->update(
		[ '_id' => new MongoId( $doc ['_id']) ],
		[ '$set' => [ 'seats'=>$seats ] ]
	);

} else {

	$seats = new stdClass();

	foreach ($post['seats'] as $key => $value) {
		$seats->$key = ['status'=>'paid'];
	}

	$data = [
        'date' => new MongoDate(strtotime($post['infos']['date'])),
        'movie' => $post['infos']['movie'], 'start' => $post['infos']['start'], 'room' => $post['infos']['room'],
        'seats' => $seats ];

    $db->nosql->gsdb->tickets->insert( $data );
}