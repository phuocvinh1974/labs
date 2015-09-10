<?php

class MoviesList {

    private $post, $connect, $db;

    public function __construct() {
        include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/common/class-nosql-database.php';
        try {
            $this->connect = new NoSqlDatabase();
            $this->db = $this->connect->nosql->selectDB('gsdb');
        } catch (Exception $e) {
            exit(json_encode(['error' => true, 'error_msg' => $e->getMessage()]));
        }
    }

    private function objToArray($obj) {
        $a = [];
        foreach ($obj as $k => $item) {
            if ($k !== '_id') {
                if ($k === 'ReleaseDate')
                    $a[$k] = new MongoDate(strtotime($item));
                else
                    $a[$k] = $item;
            }
        }

        return $a;
    }

    public function set_post($post) {
        $this->post = $post;
    }

    public function add() {
        unset($this->post['_id']);
        $this->db->movies->insert($this->post);
    }

    public function modify() {
        $this->db->movies->update(
                array('_id' => new MongoId($this->post['_id'])), array('$set' => $this->objToArray($this->post))
        );
    }

    public function set_mark() {
        $this->db->movies->update(
                array('_id' => new MongoId($this->post['_id'])), array('$set' => ['addition.mark' => $this->post['mark']]), array('upsert' => false)
        );
    }
    
    public function set_popular() {
        $this->db->movies->update(
                array('_id' => new MongoId($this->post['_id'])), array('$set' => ['addition.popular' => $this->post['popular']]), array('upsert' => false)
        );
    }

    public function set_disabled() {
        $this->db->movies->update(
                array('_id' => new MongoId($this->post['_id'])), array('$set' => ['addition.disabled' => $this->post['disabled']]), array('upsert' => false));
    }

    public function get_addition() {
        $doc = $this->db->movies->findOne(array('_id' => new MongoId($this->post['_id'])));

        if (isset($doc['addition']))
            echo json_encode($doc['addition']);
    }

}
