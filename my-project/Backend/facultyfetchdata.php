<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true'); // Allow credentials
header('Content-Type: application/json');

$response = array();

if (!isset($_SESSION["login"]) || !$_SESSION["login"]) {
    $response['success'] = false;
    $response['message'] = 'User not logged in';
    echo json_encode($response);
    exit;
}

include './database.php';

$fullname = $_SESSION["fullname"];

$stmt = $conn->prepare("SELECT * FROM facultystaff WHERE Name = ? ");
if (!$stmt) {
    $response['success'] = false;
    $response['message'] = 'Database query preparation failed.';
    echo json_encode($response);
    exit;
}

$stmt->bind_param("s", $fullname);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response['success'] = true;
    $response['data'] = $row;
} else {
    $response['success'] = false;
    $response['message'] = 'No data found for the logged-in user.';
}

echo json_encode($response);
?>
