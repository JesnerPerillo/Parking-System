<?php
include './database.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust according to your frontend origin
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Check if the ID parameter is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'Admin ID is required.']);
    exit;
}

$adminId = intval($_GET['id']);

// Prepare SQL query to delete the admin record
$sql = "DELETE FROM admin WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement.']);
    exit;
}

// Bind the parameter and execute the statement
$stmt->bind_param('i', $adminId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Admin deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete admin.']);
}

$stmt->close();
$conn->close();
?>
