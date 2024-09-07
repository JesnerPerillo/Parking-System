<?php
include './database.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust according to your frontend origin
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Fetch admin data
$sql = "SELECT id, Name, Email, Password FROM admin"; // Adjust table and fields accordingly
$result = $conn->query($sql);

$admins = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($admins);

$conn->close();
?>
