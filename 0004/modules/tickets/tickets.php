<?php

include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/tickets/class-tickets.php';

$action = isset($_GET['action']) ? str_replace("-", "_", $_GET['action']) : NULL;
$post = isset($_POST['post']) ? $_POST['post'] : NULL;

$tickets = new Tickets();
$tickets->set_post($post);

if ($action) {
    if (method_exists($tickets, $action))
        $tickets->{$action}();
}