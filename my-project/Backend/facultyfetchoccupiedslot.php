<?php
  require './connect.php';

  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');

  $sql = "SELECT slot_type, slot_number FROM FacultyParkingSlots";
  $result = $conn->query($sql);

  $occupiedSlots = array();

  if ($result->num_rows > 0 ) {
    while ($row = $result->fetch_assoc()) {
      $slotType = $row['slot_type'];
      $slotNumber = $row['slot_number'];

      if (!isset($occupiedSlots[$slotType])) {
        $occupiedSlots[$slotType] = array();
      }
      array_push($occupiedSlots[$slotType], $slotNumber);
    }
  }

  echo json_encode(['status' => 'success', 'data' => $occupiedSlots]);

  $conn->close();

?>