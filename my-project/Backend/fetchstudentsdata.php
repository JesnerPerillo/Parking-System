<?php
session_start();
header('Content-Type: application/json');

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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
include './database.php'; // Ensure this file sets up the $conn variable correctly

// Check database connection
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit();
}

// Queries
$query_students = "
    SELECT s.`Student Number`, s.Name, s.Email, s.Vehicle, s.`Plate Number`, sp.slot_number
    FROM students s
    LEFT JOIN studentparkingslots sp ON s.id = sp.student_id
";

$query_vehicle_counts = "
    SELECT Vehicle, COUNT(*) as count
    FROM students
    GROUP BY Vehicle
    ORDER BY count DESC
";

// Execute queries
$result_students = mysqli_query($conn, $query_students);
$result_vehicle_counts = mysqli_query($conn, $query_vehicle_counts);

// Check query results
if (!$result_students) {
    echo json_encode(['success' => false, 'message' => 'Student query failed: ' . mysqli_error($conn)]);
    exit();
}
if (!$result_vehicle_counts) {
    echo json_encode(['success' => false, 'message' => 'Vehicle count query failed: ' . mysqli_error($conn)]);
    exit();
}

// Fetch results
$students = [];
if (mysqli_num_rows($result_students) > 0) {
    while ($row = mysqli_fetch_assoc($result_students)) {
        $students[] = $row;
    }
}

$vehicle_counts = [];
$total_student_users = mysqli_num_rows($result_students);
if (mysqli_num_rows($result_vehicle_counts) > 0) {
    while ($row = mysqli_fetch_assoc($result_vehicle_counts)) {
        $vehicle_counts[$row['Vehicle']] = $row['count'];
    }
}

// Return results
echo json_encode([
    'success' => true,
    'students' => $students,
    'vehicleCounts' => $vehicle_counts,
    'totalUsers' => $total_student_users
]);

mysqli_close($conn);
?>
