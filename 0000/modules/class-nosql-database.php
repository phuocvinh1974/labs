<?php

class NoSqlDatabase {

    public $nosql;

    function __construct() {
        include_once '../etc/config.php';
        try {
            $this->nosql = new MongoClient($_CONFIG['dsn_mongo']);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

}

try {
    $db = new NoSqlDatabase();
} catch (Exception $e) {
    exit(json_encode(['error' => true, 'error_msg' => $e->getMessage()]));
}
