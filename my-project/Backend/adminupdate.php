<?php
include './database.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust according to your frontend origin
header('Access-Control-Allow-Methods: POST, PUT'); // Added PUT
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Check if the ID parameter is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'Admin ID is required.']);
    exit;
}

$Id = intval($_GET['id']);

// For PUT requests, read the raw input
parse_str(file_get_contents("php://input"), $_PUT);

if (!isset($_PUT['name']) || !isset($_PUT['email']) || !isset($_PUT['password'])) {
    echo json_encode(['success' => false, 'message' => 'Name, email, and password are required.']);
    exit;
}

$name = $_PUT['name'];
$email = $_PUT['email'];
$password = $_PUT['password'];

// Validate the inputs
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// Hash the password before storing it
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Prepare SQL query to update the admin record
$sql = "UPDATE admin SET Name = ?, Email = ?, Password = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement.']);
    exit;
}

// Bind the parameters and execute the statement
$stmt->bind_param('sssi', $name, $email, $hashedPassword, $Id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Admin updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update admin.']);
}

$stmt->close();
$conn->close();
?>
