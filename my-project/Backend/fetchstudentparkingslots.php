<?php
require './connect.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$studentNumber = $_SESSION['studentNumber']; // Get the student number from the session

// Query to fetch the student's ID using the student number
$sql = "SELECT id FROM students WHERE `Student Number` = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $studentNumber); // Bind the student number as a string
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();
    $studentId = $student['id']; // Get the student ID

    // Now use the student ID to fetch the parking slot
    $sql = "SELECT * FROM studentparkingslots WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $studentId); // Bind the student ID as an integer
    $stmt->execute();
    $result = $stmt->get_result();

    $data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row; // Collect the student's parking slot data
        }
        echo json_encode(['status' => 'success', 'data' => $data]);
    } else {
        echo json_encode(['status' => 'success', 'data' => []]); // No data found for the user
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Student not found.']);
}

$conn->close();
?>
