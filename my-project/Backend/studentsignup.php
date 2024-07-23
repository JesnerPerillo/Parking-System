<?php
require './connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Extract form data
    $studentNumber = $_POST["studentNumber"];
    $fullname = $_POST["fullname"];
    $emailAddress = $_POST["email"];
    $yearsection = $_POST["yearsection"];
    $course = $_POST["course"];
    $vehicleType = $_POST["vehicleType"];
    $plateNumber = $_POST["plateNumber"];
    $password = $_POST["password"];
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // File upload handling - Check if files are uploaded
    if (isset($_FILES['license']['tmp_name']) && isset($_FILES['orcr']['tmp_name'])) {
        $licenseFile = $_FILES['license']['tmp_name'];
        $orcrFile = $_FILES['orcr']['tmp_name'];

        // Read file contents for BLOB storage
        $licenseContent = file_get_contents($licenseFile);
        $orcrContent = file_get_contents($orcrFile);
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'License and ORCR files are required.'));
        exit;
    }

    // Check for duplicate student number or email using prepared statements
    $stmt = mysqli_prepare($conn, "SELECT * FROM students WHERE `Student Number` = ? OR Email = ?");
    mysqli_stmt_bind_param($stmt, "ss", $studentNumber, $emailAddress);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode(array('status' => 'error', 'message' => 'Student Number or Email has already been taken!'));
        exit;
    }

    // Prepare SQL statement to insert data into database using prepared statements
    $query = "INSERT INTO students (`Student Number`, Name, Email, `Year and Section`, Course, Vehicle, `Plate Number`, Password, License, ORCR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    if (!$stmt) {
        echo json_encode(array('status' => 'error', 'message' => 'Prepared statement failed: ' . mysqli_error($conn)));
        exit;
    }

    mysqli_stmt_bind_param($stmt, 'ssssssssbb', $studentNumber, $fullname, $emailAddress, $yearsection, $course, $vehicleType, $plateNumber, $hashedPassword, $licenseContent, $orcrContent);

    // Bind the BLOB parameters
    mysqli_stmt_send_long_data($stmt, 8, $licenseContent);
    mysqli_stmt_send_long_data($stmt, 9, $orcrContent);

    // Execute the statement
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(array('status' => 'success', 'message' => 'Registration Successful!', 'redirect' => 'StudentLogin.jsx'));
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Error in registration.'));
    }

    // Close statement
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
?>