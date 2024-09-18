<?php
include './database.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust according to your frontend origin
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Enable detailed error reporting for troubleshooting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$response = array('success' => false, 'message' => '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['employeeId'])) {
        $response['message'] = 'User not logged in.';
        echo json_encode($response);
        exit();
    }

    // Use session employee ID for identifying the user
    $employeeId = $_SESSION['employeeId'];
    
    $fullname = $_POST['fullname'] ?? ''; 
    $email = $_POST['email'] ?? '';
    $position = $_POST['position'] ?? '';
    $building = $_POST['building'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $license = $_FILES['license'] ?? null;
    $orcr = $_FILES['orcr'] ?? null;

    $updateFields = [];
    $params = [];
    $types = '';

    if (!empty($employeeId)) {
        $updateFields[] = '`Employee Id` = ?';
        $params[] = $employeeId;
        $types .= 's';
    }
    if (!empty($fullname)) {
        $updateFields[] = 'Name = ?';
        $params[] = $fullname;
        $types .= 's';
    }
    if (!empty($email)) {
        $updateFields[] = 'Email = ?';
        $params[] = $email;
        $types .= 's';
    }
    if (!empty($position)) {
        $updateFields[] = 'Position = ?';
        $params[] = $position;
        $types .= 's';
    }
    if (!empty($building)) {
        $updateFields[] = 'Building = ?';
        $params[] = $building;
        $types .= 's';
    }
    if (!empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $updateFields[] = 'Password = ?';
        $params[] = $hashedPassword;
        $types .= 's';
    }

    // Handling file uploads
    if ($license) {
        $licenseContent = file_get_contents($license['tmp_name']);
        if ($licenseContent === false) {
            $response['message'] = 'Error reading license file.';
            echo json_encode($response);
            exit();
        }
        $updateFields[] = 'License = ?';
        $params[] = $licenseContent;
        $types .= 'b';
    }
    if ($orcr) {
        $orcrContent = file_get_contents($orcr['tmp_name']);
        if ($orcrContent === false) {
            $response['message'] = 'Error reading ORCR file.';
            echo json_encode($response);
            exit();
        }
        $updateFields[] = 'ORCR = ?';
        $params[] = $orcrContent;
        $types .= 'b';
    }

    // Ensure we have fields to update
    if (empty($updateFields)) {
        $response['message'] = 'No data to update.';
        echo json_encode($response);
        exit();
    }

    // Add the session employee ID for the WHERE clause
    $params[] = $employeeId;
    $types .= 's';

    // Construct the SQL query dynamically
    $sql = "UPDATE facultystaff SET " . implode(', ', $updateFields) . " WHERE `Employee Id` = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        $response['message'] = 'Error preparing statement: ' . $conn->error;
        echo json_encode($response);
        exit();
    }

    // Bind the parameters
    $bindResult = $stmt->bind_param($types, ...$params);
    if ($bindResult === false) {
        $response['message'] = 'Error binding parameters: ' . $stmt->error;
        echo json_encode($response);
        exit();
    }

    // Send long data for blobs (file uploads)
    if ($license) {
        $stmt->send_long_data(array_search($licenseContent, $params), $licenseContent);
    }
    if ($orcr) {
        $stmt->send_long_data(array_search($orcrContent, $params), $orcrContent);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'User updated successfully.';
    } else {
        $response['message'] = 'Error updating user: ' . $stmt->error;
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    $response['message'] = 'Invalid request method.';
}

// Output the response as JSON
echo json_encode($response);
?>
