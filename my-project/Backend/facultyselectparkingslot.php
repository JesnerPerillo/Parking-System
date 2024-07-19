<?php 
  require './connect.php';

  header("Access-Control-Allow-Origin: http://localhost:3000"); // Replace with your frontend URL
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Access-Control-Allow-Credentials: true"); // Set credentials to true for withCredentials to work
  header('Content-Type: application/json');

  $input = json_decode(file_get_contents('php://input'), true);
  $slotType = $input['slotType'];
  $slotNumber = $input['slotNumber'];
  $id = $input['id'];

  $sql = "SELECT id FROM facultystaff WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $id);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Student not found']);
    exit();
  }

  $faculty = $result->fetch_assoc();
  $faculty_id = $faculty['id'];

  $sql = "SELECT * FROM FacultyParkingSlots WHERE faculty_id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $faculty_id);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0 ) {
    echo json_encode(['status' => 'error', 'message' => 'You already have a selected parking slot']);
    exit();
  }

  $sql = "SELECT * FROM FacultyParkingSlots WHERE slot_type = ? AND slot_number = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("si", $slotType, $slotNumber);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0 ) {
    echo json_encode(['status' => 'error', 'message' => 'This parking slot is already occupied']);
    exit();
  }

  $sql = "INSERT INTO FacultyParkingSlots (slot_type, slot_number, faculty_id) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sii", $slotType, $slotNumber, $faculty_id);

  if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Parking slot selected successfully']);
  } else {
    echo json_encode(['status' => 'error', 'message' => 'Error selecting parking slot: ' . $conn->error]);
  }

  $stmt->close();
  $conn->close();

?>