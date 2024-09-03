<?php
session_start();
header('Content-Type: application/json');

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Debugging: Log session details
error_log('Session Details: ' . print_r($_SESSION, true));

// Check if the user is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

// Include database connection
include './database.php';

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit();
}

// Retrieve input
$userType = $_POST['user_type'] ?? null; // Added key to differentiate between student and faculty
$id = $_POST['id'] ?? null;
$time_in = $_POST['time_in'] ?? null;
$time_out = $_POST['time_out'] ?? null;

error_log('Received POST Data: ' . print_r($_POST, true));

if (!$userType || !$id) {
    echo json_encode(['status' => 'error', 'message' => 'User type and ID are required']);
    exit();
}

$update_fields = [];
$update_values = [];

if ($time_in) {
    $update_fields[] = '`Time In` = ?';
    $update_values[] = $time_in;
}

if ($time_out) {
    $update_fields[] = '`Time Out` = ?';
    $update_values[] = $time_out;
}

if (empty($update_fields)) {
    echo json_encode(['status' => 'error', 'message' => 'No time data provided']);
    exit();
}

$update_values[] = $id;

$table = $userType === 'faculty' ? 'facultystaff' : 'students'; // Choose table based on user type

$sql = "UPDATE $table SET " . implode(', ', $update_fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Prepare statement failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param(str_repeat('s', count($update_values) - 1) . 'i', ...$update_values);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Time updated successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error updating time: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
