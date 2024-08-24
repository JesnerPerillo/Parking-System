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
$query_students = "
    SELECT s.`Student Number`, s.Name, s.Email, s.Vehicle, s.`Plate Number`, sp.slot_number
    FROM students s
    LEFT JOIN studentparkingslots sp ON s.id = sp.student_id
"; // Adjust the query based on your database structure

// Query to count vehicle type frequencies
$query_vehicle_counts = "
    SELECT Vehicle, COUNT(*) as count
    FROM students
    GROUP BY Vehicle
    ORDER BY count DESC
"; // Adjust the query based on your database structure

// Execute the student data query
$result_students = mysqli_query($conn, $query_students);
if (!$result_students) {
    echo json_encode(['success' => false, 'message' => 'Student query failed: ' . mysqli_error($conn)]);
    exit();
}

// Execute the vehicle type frequency query
$result_vehicle_counts = mysqli_query($conn, $query_vehicle_counts);
if (!$result_vehicle_counts) {
    echo json_encode(['success' => false, 'message' => 'Vehicle count query failed: ' . mysqli_error($conn)]);
    exit();
}

// Fetch student data
$students = [];
if (mysqli_num_rows($result_students) > 0) {
    while ($row = mysqli_fetch_assoc($result_students)) {
        $students[] = $row;
    }
}

// Fetch vehicle type frequencies
$vehicle_counts = [];
$total_student_users = mysqli_num_rows($result_students); // Total number of student users
if (mysqli_num_rows($result_vehicle_counts) > 0) {
    while ($row = mysqli_fetch_assoc($result_vehicle_counts)) {
        $vehicle_counts[$row['Vehicle']] = $row['count'];
    }
}

// Return both student data and vehicle type frequencies
echo json_encode([
    'success' => true,
    'students' => $students,
    'vehicleCounts' => $vehicle_counts,
    'totalUsers' => $total_student_users // Include total number of student users
]);

mysqli_close($conn);
?>
