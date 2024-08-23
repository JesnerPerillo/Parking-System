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
$query_faculty = "
    SELECT s.Name, s.Email, s.Position, s.Building, s.Vehicle, s.`Plate Number`, sp.slot_number
    FROM facultystaff s
    LEFT JOIN facultyparkingslots sp ON s.id = sp.faculty_id
"; // Adjust the query based on your database structure

// Query to count vehicle type frequencies
$query_vehicle_counts = "
    SELECT Vehicle, COUNT(*) as count
    FROM facultystaff
    GROUP BY Vehicle
    ORDER BY count DESC
"; // Adjust the query based on your database structure

// Execute the student data query
$result_faculty = mysqli_query($conn, $query_faculty);
if (!$result_faculty) {
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
$faculty = [];
if (mysqli_num_rows($result_faculty) > 0) {
    while ($row = mysqli_fetch_assoc($result_faculty)) {
        $faculty[] = $row;
    }
}

// Fetch vehicle type frequencies
$vehicle_counts = [];
if (mysqli_num_rows($result_vehicle_counts) > 0) {
    while ($row = mysqli_fetch_assoc($result_vehicle_counts)) {
        $vehicle_counts[$row['Vehicle']] = $row['count'];
    }
}

// Return both student data and vehicle type frequencies
echo json_encode([
    'success' => true,
    'faculty' => $faculty,
    'vehicleCounts' => $vehicle_counts
]);

mysqli_close($conn);
?>
