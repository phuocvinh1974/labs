<?php
include_once $_SERVER ['DOCUMENT_ROOT'] . '/modules/common/class-database.php';

$db = new Database();

$stmt = $db->pdo->prepare('SELECT name FROM countries ORDER BY name');
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'rows' => $rows
]);
