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
    $password = $_POST["password"]; // Assuming you receive this from the form
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT); // Hash the password

    // File upload handling - Local Storage uploads
    $licenseFilename = $_FILES['license']['name'];
    $licenseTmpName = $_FILES['license']['tmp_name'];
    $licenseDestination = 'uploads/' . $licenseFilename;

    $orcrFilename = $_FILES['orcr']['name'];
    $orcrTmpName = $_FILES['orcr']['tmp_name'];
    $orcrDestination = 'uploads/' . $orcrFilename;

    // Check for duplicate student number or email using prepared statements
    $stmt = mysqli_prepare($conn, "SELECT * FROM students WHERE `Student Number` = ? OR Email = ?");
    mysqli_stmt_bind_param($stmt, "ss", $studentNumber, $emailAddress);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode(array('status' => 'error', 'message' => 'Student Number or Email has already been taken!'));
        exit;
    }

    // Move uploaded files to desired location
    if (move_uploaded_file($licenseTmpName, $licenseDestination) && move_uploaded_file($orcrTmpName, $orcrDestination)) {
        // Prepare SQL statement to insert data into database using prepared statements
        $query = "INSERT INTO students (`Student Number`, Name, Email, `Year and Section`, Course, Vehicle, `Plate Number`, Password, License, ORCR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'ssssssssss', $studentNumber, $fullname, $emailAddress, $yearsection, $course, $vehicleType, $plateNumber, $hashedPassword, $licenseDestination, $orcrDestination);

        // Execute the statement
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(array('status' => 'success', 'message' => 'Registration Successful!', 'redirect' => 'StudentLogin.jsx'));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Error in registration.'));
        }

        // Close statement
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(array('status' => 'error', 'message' => 'Error in file upload.'));
    }

    mysqli_close($conn);
}
?>
