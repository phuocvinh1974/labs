<?php

class Database {

    public $pdo;

    function __construct() {
        try {
            include_once $_SERVER ['DOCUMENT_ROOT'] . '/../etc/config.php';
            $this->pdo = new PDO($_CONFIG ['dsn'], $_CONFIG ['mysql_user'], $_CONFIG ['mysql_password']);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage());
        }
    }
}