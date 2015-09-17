<?php

class MoviesScheduler {

    private $post, $db;

    public function __construct() {

        include_once '../common/class-nosql-database.php';
        try {
            $connect = new NoSqlDatabase();
            $this->db = $connect->nosql->selectDB('gsdb');
        } catch (Exception $e) {
            exit(json_encode(['error' => true, 'error_msg' => $e->getMessage()]));
        }
    }

    public function set_post($p) {
        $this->post = $p;
    }

    public function apply() {

        $_date = new MongoDate(strtotime($this->post['date']));

        $date_exists = $this->db->schedules->findOne(array('date' => $_date), ['date' => 1]);

        $doc = ['date' => $_date, 'schedules' => $this->post['schedules']];

        if (!$date_exists)
            $this->db->schedules->insert($doc);
        else
            $this->db->schedules->update(['date' => $_date], $doc);
    }

    public function get_schedules() {

        $_date = new MongoDate(strtotime($this->post['date']));

        $doc = $this->db->schedules->findOne(array('date' => $_date));

        if (!$doc) {

            $schedules = [
                array("room" => 1, "schedule" => [array("start" => 0, "end" => 420)]),
                array("room" => 2, "schedule" => [array("start" => 0, "end" => 420)]),
                array("room" => 3, "schedule" => [array("start" => 0, "end" => 420)])];

            echo json_encode(array('schedules' => $schedules, 'moviesIndex' => NULL, '$new'=>true));
        } else {

            $moviesDistinct = $this->db->schedules->distinct("schedules.schedule._id", array('date' => $_date));

            $objIds = array_map(function($k) {
                return new MongoId($k);
            }, $moviesDistinct);

            $movies = $this->db->movies->find(array('_id' => array('$in' => $objIds)), ['IntTitle' => 1, 'Runtime' => 1, 'Format' => 1]);

            $moviesIndex = [];
            foreach ($movies as $item) {
                $moviesIndex[(string) $item['_id']] = $item;
            }

            echo json_encode(array('schedules' => $doc['schedules'], 'moviesIndex' => $moviesIndex));
        }
    }

    public function same_price() {

        $_date = new MongoDate(strtotime($this->post['date']));

        $doc = $this->db->schedules->findOne(array('date' => $_date));

        for ($i = 0; $i < count($doc['schedules']); $i++) {
            if ($doc['schedules'][$i]['room'] == $this->post['roomno']) {
                for ($j = 0; $j < count($doc['schedules'][$i]['schedule']); $j++){
                    if (isset($doc['schedules'][$i]['schedule'][$j]['_id'])) {
                        if($doc['schedules'][$i]['schedule'][$j]['_id']==$this->post['_id'] && $doc['schedules'][$i]['schedule'][$j]['start']==$this->post['start']){
                            $path = 'schedules.' . $i . '.schedule.' . $j . '.events';
                            break 2;
                        }
                    }
                } 
            }
        }

        $this->db->schedules->update(
            ['date'=>$_date],
            ['$set'=>[
                $path=>['samePrice'=>$this->post['samePrice']]
                ]
            ]);
    }

    public function same_price_remove() {
        echo 'remove same price';
    }

}
