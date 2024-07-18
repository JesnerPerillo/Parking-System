<?php
session_start();
session_destroy();

header('Content-Type: application/json');
$response = array('success' => true);
echo json_encode($response);
?>
