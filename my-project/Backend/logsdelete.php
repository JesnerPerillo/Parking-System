<?php
include './database.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Get the request data
$data = json_decode(file_get_contents('php://input'), true);
$selection = $data['selection'] ?? '';

// Define SQL queries based on the selection
$sql = '';
if ($selection === 'day') {
    $sql = "DELETE FROM Logs WHERE created_at < NOW() - INTERVAL 1 DAY";
} elseif ($selection === 'student') {
    $sql = "DELETE FROM Logs WHERE user_type = 'student'";
} elseif ($selection === 'faculty') {
    $sql = "DELETE FROM Logs WHERE user_type = 'faculty'";
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid selection.']);
    exit;
}

// Prepare SQL query to delete logs
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement.']);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Logs deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete logs.']);
}

$stmt->close();
$conn->close();
?>
