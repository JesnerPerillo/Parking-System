<?php
require './connect.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$employeeId = $_SESSION['employeeId'];

$sql = "SELECT id FROM facultystaff WHERE `Employee Id` = ? ";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0 ) {
    $faculty = $result->fetch_assoc();
    $facultyId = $faculty['id'];

    $sql = "SELECT * FROM facultyparkingslots WHERE faculty_id = ? ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $facultyId);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = array();

    if ($result->num_rows > 0 ) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(['status' => 'success', 'data' => $data]);
    } else {
        echo json_encode(['status' => 'success', 'data' => []]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Faculty or Staff not found.']);
}

$conn->close();
?>