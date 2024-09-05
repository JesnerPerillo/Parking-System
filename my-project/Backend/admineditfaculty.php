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

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve faculty ID from POST request
    $facultyId = $_POST['id'] ?? '';

    if (empty($facultyId)) {
        echo json_encode(['success' => false, 'message' => 'Faculty ID is required.']);
        exit();
    }

    // Retrieve other fields
    $name = $_POST['fullname'] ?? '';
    $email = $_POST['email'] ?? '';
    $position = $_POST['position'] ?? '';
    $building = $_POST['building'] ?? '';
    $vehicle = $_POST['vehicle'] ?? '';
    $plateNumber = $_POST['plateNumber'] ?? '';
    $password = $_POST['password'] ?? '';

    $license = $_FILES['license'] ?? null;
    $orcr = $_FILES['orcr'] ?? null;

    $updateFields = [];
    $params = [];
    $types = '';

    if (!empty($name)) {
        $updateFields[] = 'Name = ?';
        $params[] = $name;
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
    if (!empty($vehicle)) {
        $updateFields[] = 'Vehicle = ?';
        $params[] = $vehicle;
        $types .= 's';
    }
    if (!empty($plateNumber)) {
        $updateFields[] = '`Plate Number` = ?';
        $params[] = $plateNumber;
        $types .= 's';
    }
    if (!empty($password)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $updateFields[] = 'Password = ?';
        $params[] = $hashedPassword;
        $types .= 's';
    }
    if ($license) {
        $licenseContent = file_get_contents($license['tmp_name']);
        if ($licenseContent === false) {
            $response['success'] = false;
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
            $response['success'] = false;
            $response['message'] = 'Error reading ORCR file.';
            echo json_encode($response);
            exit();
        }
        $updateFields[] = 'ORCR = ?';
        $params[] = $orcrContent;
        $types .= 'b';
    }

    // Add faculty ID for the WHERE clause
    $params[] = $facultyId;
    $types .= 's';

    // Prepare SQL query
    $sql = "UPDATE facultystaff SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        error_log('Error preparing statement: ' . $conn->error);
        $response['success'] = false;
        $response['message'] = 'Error preparing statement.';
        echo json_encode($response);
        exit();
    }

    // Binding parameters
    $bindResult = $stmt->bind_param($types, ...$params);
    if ($bindResult === false) {
        error_log('Error binding parameters: ' . $stmt->error);
        $response['success'] = false;
        $response['message'] = 'Error binding parameters.';
        echo json_encode($response);
        exit();
    }

    // Send long data for blobs
    if ($license) {
        $stmt->send_long_data(array_search($licenseContent, $params), $licenseContent);
    }
    if ($orcr) {
        $stmt->send_long_data(array_search($orcrContent, $params), $orcrContent);
    }

    // Execute statement
    if (!$stmt->execute()) {
        error_log('Error executing statement: ' . $stmt->error);
        $response['success'] = false;
        $response['message'] = 'Error executing statement.';
        echo json_encode($response);
        exit();
    }

    $response['success'] = true;
    $response['message'] = 'Faculty member updated successfully.';

    // Close connections
    $stmt->close();
    $conn->close();
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
