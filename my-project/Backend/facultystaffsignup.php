<?php
require './connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Extract form data
    $fullname = $_POST["fullname"] ?? '';
    $emailAddress = $_POST["email"] ?? '';
    $position = $_POST["position"] ?? '';
    $building = $_POST["building"] ?? '';
    $vehicleType = $_POST["vehicleType"] ?? '';
    $plateNumber = $_POST["plateNumber"] ?? '';
    $password = $_POST["password"] ?? '';
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // File upload handling
    if (isset($_FILES['license']) && $_FILES['license']['error'] === UPLOAD_ERR_OK &&
        isset($_FILES['orcr']) && $_FILES['orcr']['error'] === UPLOAD_ERR_OK) {
        
        $licenseFile = $_FILES['license']['tmp_name'];
        $orcrFile = $_FILES['orcr']['tmp_name'];

        // Check file types and sizes
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $maxFileSize = 15 * 1024 * 1024; // 15 MB

        if (!in_array($_FILES['license']['type'], $allowedTypes) || $_FILES['license']['size'] > $maxFileSize) {
            echo json_encode(array('status' => 'error', 'message' => 'Invalid license file.'));
            exit;
        }

        if (!in_array($_FILES['orcr']['type'], $allowedTypes) || $_FILES['orcr']['size'] > $maxFileSize) {
            echo json_encode(array('status' => 'error', 'message' => 'Invalid ORCR file.'));
            exit;
        }

        $licenseContent = file_get_contents($licenseFile);
        $orcrContent = file_get_contents($orcrFile);

        if ($licenseContent === false || $orcrContent === false) {
            echo json_encode(array('status' => 'error', 'message' => 'Error reading file content.'));
            exit;
        }
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'License and ORCR files are required or there was an error uploading.'));
        exit;
    }

    // Check for duplicate entries using prepared statements
    $stmt = mysqli_prepare($conn, "SELECT * FROM facultystaff WHERE Name = ? OR Email = ?");
    mysqli_stmt_bind_param($stmt, "ss", $fullname, $emailAddress);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode(array('status' => 'error', 'message' => 'Name or Email has already been taken!'));
        exit;
    }

    // Prepare SQL statement to insert data into database
    $query = "INSERT INTO facultystaff (Name, Email, Position, Building, Vehicle, `Plate Number`, Password, License, ORCR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    if (!$stmt) {
        echo json_encode(array('status' => 'error', 'message' => 'Prepared statement failed: ' . mysqli_error($conn)));
        exit;
    }

    // Bind parameters and execute the statement
    mysqli_stmt_bind_param($stmt, 'sssssssss', $fullname, $emailAddress, $position, $building, $vehicleType, $plateNumber, $hashedPassword, $licenseContent, $orcrContent);
    mysqli_stmt_send_long_data($stmt, 7, $licenseContent); // Bind MEDIUMBLOB data for License
    mysqli_stmt_send_long_data($stmt, 8, $orcrContent); // Bind MEDIUMBLOB data for ORCR

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(array('status' => 'success', 'message' => 'Registration Successful!'));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Error in registration: ' . mysqli_stmt_error($stmt)));
    }

    // Close statement and connection
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
?>
