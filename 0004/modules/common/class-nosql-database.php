<?php

class NoSqlDatabase {

    public $nosql;

    function __construct() {
        include_once __DIR__ . '/../../etc/config.php';
        try {
            $this->nosql = new MongoClient($_CONFIG['dsn_mongo']);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

}
