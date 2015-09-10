<?php

class Tickets {

    private $post, $db;

    public function __construct() {

        include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/common/class-nosql-database.php';
        try {
            $connect = new NoSqlDatabase();
            $this->db = $connect->nosql->selectDB('gsdb');
        } catch (Exception $e) {
            exit(json_encode(['error' => true, 'error_msg' => $e->getMessage()]));
        }
    }

    public function set_post($post) {
        $this->post = $post;
    }

    public function get_schedules() {
        $doc = $this->db->schedules->findOne([ 'date' => new MongoDate(strtotime($this->post['ondate']))]);

        if ($doc) {
            $obj = [];
            $obj[gmdate('Y-m-d', $doc['date']->sec)] = $doc['schedules'];
            echo json_encode($obj);
        } else {
            echo json_encode(['notfound' => true]);
        }
    }

    public function get_moviesindex() {
        $objids = array_map(function($v) {
            return new MongoId($v);
        }, $this->post['distinct']);

        $docs = $this->db->movies->find(['_id' => array('$in' => $objids)]);

        $moviesindex = [];
        foreach ($docs as $item) {
            $moviesindex[(string) $item['_id']] = [
                'IntTitle' => $item['IntTitle'],
                'Title' => $item['Title'],
                'Format' => $item['Format']
            ];
        }

        echo json_encode($moviesindex);
    }

    public function load_seats(){
        $doc = $this->db->tickets->findOne([
                    'date'=>new MongoDate(strtotime($this->post['dateSelected'])),
                    'showtime.room' => $this->post['room'],
                    'showtime.movie' => $this->post['movie'],
                    'showtime.start' => $this->post['start']
                ],['seats'=>true]);

        if($doc)
            echo json_encode($doc);
        else 
            echo json_encode(['notfound'=>true]);
    }

    public function seats_paid(){

        $doc = $this->db->tickets->findOne([
                    'date'=>new MongoDate(strtotime($this->post['showtime']['dateSelected'])),
                    'showtime.room' => $this->post['showtime']['room'],
                    'showtime.movie' => $this->post['showtime']['movie'],
                    'showtime.start' => $this->post['showtime']['start']
                ]);

        if ($doc) {
            
            $seats = array_map(function($v){
                if($v['status']=='selected') $v['status'] = 'paid';
                return $v;
            }, $this->post['seats']);

            $this->db->tickets->update(
                    ['_id' => new MongoId($doc['_id'])],
                    ['$set'=>['seats'=>$seats]]
                );

        } else {
            $seats = array_map(function($v){
                $v['status'] = 'paid';
                return $v;
            }, $this->post['seats']);

            $data = [
                'date' => new MongoDate(strtotime($this->post['date'])),
                'showtime' => $this->post['showtime'],
                'seats' => $seats
            ];

            $this->db->tickets->insert($data);
        }
    }

}
