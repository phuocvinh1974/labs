<?php 

include_once 'class-nosql-database.php';

$distinct = $_POST['distinct'];

$objids = array_map( function ($v) {
        return new MongoId($v);
    }, $distinct);

$docs = $db->nosql->gsdb->movies->find([ '_id' => array('$in' => $objids) ]);

$moviesindex = [];

foreach ($docs as $item) {
    $moviesindex[(string) $item['_id']] = [
    	'shortTitle' => isset($item['shortTitle']) ? $item['shortTitle'] : null,
        'IntTitle' => $item['IntTitle'],
        'Title' => $item['Title'],
        'Format' => $item['Format']
    ];
}

echo json_encode($moviesindex);