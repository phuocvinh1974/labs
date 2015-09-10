<?php

include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/moviesscheduler/class-moviesscheduler.php';

$action = isset($_GET['action']) ? str_replace("-", "_", $_GET['action']) : NULL;
$post = isset($_POST['post']) ? $_POST['post'] : NULL;

$moviesscheduler = new MoviesScheduler();
$moviesscheduler->set_post($post);

if ($action) {
    if (method_exists($moviesscheduler, $action))
        $moviesscheduler->{$action}();
}

