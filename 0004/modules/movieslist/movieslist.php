<?php

include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/movieslist/class-movieslist.php';

$action = isset($_GET['action']) ? str_replace("-", "_", $_GET['action']) : NULL;

$post = $_POST['post'];
$movieslist = new MoviesList();

$movieslist->set_post($post);

if ($action) {
    if (method_exists($movieslist, $action))
        $movieslist->{$action}();
}
