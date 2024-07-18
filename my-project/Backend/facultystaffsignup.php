<?php
require './connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $fullname = $_POST["fullname"];
  $email = $_POST["email"];
  $position = $_POST["position"];
  $building = $_POST["building"];
  $vehicleType = $_POST["vehicleType"];
  $plateNumber = $_POST["plateNumber"];
  $password = $_POST["password"];
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // File upload handling
  $licenseFileName = $_FILES['license']['name'];
  $licenseTmpName = $_FILES['license']['tmp_name'];
  $licenseDestination = 'uploads/'. $licenseFileName;

  $orcrFileName = $_FILES['orcr']['name'];
  $orcrTmpName = $_FILES['orcr']['tmp_name'];
  $orcrDestination = 'uploads/'. $orcrFileName;

  // Check if name or email already exists
  $stmt = mysqli_prepare($conn, "SELECT * FROM facultystaff WHERE Name = ? OR Email = ?");
  mysqli_stmt_bind_param($stmt, 'ss', $fullname, $email);
  mysqli_stmt_execute($stmt);
  mysqli_stmt_store_result($stmt);

  if (mysqli_stmt_num_rows($stmt) > 0) {
    echo json_encode(array('status' => 'error', 'message' => 'Name or Email has already been taken!'));
    exit;
  }

  // Move uploaded files to destination
  if (move_uploaded_file($licenseTmpName, $licenseDestination) && move_uploaded_file($orcrTmpName, $orcrDestination)) {
    // Insert into database
    $query = "INSERT INTO facultystaff (Name, Email, Position, Building, Vehicle, `Plate Number`, Password, License, ORCR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'sssssssss', $fullname, $email, $position, $building, $vehicleType, $plateNumber, $hashedPassword, $licenseDestination, $orcrDestination);

    if (mysqli_stmt_execute($stmt)) {
      echo json_encode(array('success' => true, 'message' => 'Registration Successful!'));
    } else {
      echo json_encode(array('success' => false, 'message' => 'Registration Failure!'));
    }

    mysqli_stmt_close($stmt);
  } else {
    echo json_encode(array('success' => false, 'message' => 'Error in File upload!'));
  }

  mysqli_close($conn);
}
?>
