<?php

$file = $_FILES['file'];
$_id = $_POST['_id'];

move_uploaded_file($file['tmp_name'], '../../img/movie/thumb-' . $_id . ".jpg");
