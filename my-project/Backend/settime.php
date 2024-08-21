<?php
header('Content-Type: application/json');
require 'database.php'; // Your database connection script

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $qrData = $data['qrData'];

    // Assume qrData contains student ID
    $student_id = $qrData; 

    $currentTime = date('Y-m-d H:i:s');
    $timeField = ''; // Either Time_in or Time_out based on the logic you define

    // Example: Check if the student already has a time in for today
    $checkQuery = "SELECT Time_in FROM students WHERE id = ? AND DATE(Time_in) = CURDATE()";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param('i', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // If there's already a Time_in, update Time_out
        $timeField = 'Time_out';
    } else {
        // If no Time_in, set Time_in
        $timeField = 'Time_in';
    }

    $updateQuery = "UPDATE students SET $timeField = ? WHERE id = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param('si', $currentTime, $student_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
