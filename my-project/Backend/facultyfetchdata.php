<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true'); // Allow credentials
header('Content-Type: application/json');

$response = array();

// Check if the user is logged in
if (!isset($_SESSION["login"]) || !$_SESSION["login"]) {
    $response['success'] = false;
    $response['message'] = 'User not logged in';
    echo json_encode($response);
    exit;
}

// Include database connection
include './database.php';

// Retrieve faculty name from session
$employeeId = $_SESSION["employeeId"];

// Prepare SQL statement to fetch faculty data based on the name
$stmt = $conn->prepare("SELECT id, `Employee Id`, Name, Email, Position, Building, Vehicle, `Plate Number`, Password, License, ORCR FROM facultystaff WHERE `Employee Id` = ?");
if (!$stmt) {
    $response['success'] = false;
    $response['message'] = 'Database query preparation failed.';
    echo json_encode($response);
    exit;
}

$stmt->bind_param("s", $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Convert binary data to base64 for easy embedding in JSON
    if ($row['License'] !== null) {
        $row['License'] = base64_encode($row['License']);
    }
    if ($row['ORCR'] !== null) {
        $row['ORCR'] = base64_encode($row['ORCR']);
    }

    $response['success'] = true;
    $response['data'] = $row;
} else {
    $response['success'] = false;
    $response['message'] = 'No data found for the logged-in user.';
}

echo json_encode($response);
?>
