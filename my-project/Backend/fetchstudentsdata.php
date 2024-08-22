<?php
session_start();
header('Content-Type: application/json');

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Check if the user is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

// Assuming you have already established a database connection
include './database.php'; // This file contains your database connection code

// Query to fetch student data along with their slot number
$query = "
    SELECT s.`Student Number`, s.Name, s.Email, s.Vehicle, s.`Plate Number`, sp.slot_number
    FROM students s
    LEFT JOIN studentparkingslots sp ON s.id = sp.student_id
"; // Adjust the query based on your database structure

$result = mysqli_query($conn, $query);

if (!$result) {
  echo json_encode(['success' => false, 'message' => 'Query failed: ' . mysqli_error($conn)]);
  exit();
}

$students = [];

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $students]);
} else {
    echo json_encode(['success' => false, 'message' => 'No students found']);
}

mysqli_close($conn);
?>
