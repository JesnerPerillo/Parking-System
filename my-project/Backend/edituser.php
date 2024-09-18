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
    if (!isset($_SESSION['studentNumber'])) {
        $response['message'] = 'User not logged in.';
        echo json_encode($response);
        exit();
    }

    $studentNumber = $_SESSION['studentNumber'];

    $name = $_POST['fullname'] ?? '';
    $email = $_POST['email'] ?? '';
    $yearAndSection = $_POST['yearsection'] ?? '';
    $course = $_POST['course'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $license = $_FILES['license'] ?? null;
    $orcr = $_FILES['orcr'] ?? null;
    $cor = $_FILES['cor'] ?? null;

    $updateFields = [];
    $params = [];
    $types = '';

    if (!empty($studentNumber)) {
        $updateFields[] = '`Student Number` = ?';
        $params[] = $studentNumber;
        $types .= 's';
    }
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
    if (!empty($yearAndSection)) {
        $updateFields[] = '`Year and Section` = ?';
        $params[] = $yearAndSection;
        $types .= 's';
    }
    if (!empty($course)) {
        $updateFields[] = 'Course = ?';
        $params[] = $course;
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
    if ($cor) {
        $corContent = file_get_contents($cor['tmp_name']);
        if ($corContent === false) {
            $response['message'] = 'Error reading COR file.';
            echo json_encode($response);
            exit();
        }
        $updateFields[] = 'COR = ?';
        $params[] = $corContent;
        $types .= 'b';
    }

    if (empty($updateFields)) {
        $response['message'] = 'No data to update.';
        echo json_encode($response);
        exit();
    }

    $params[] = $studentNumber;
    $types .= 's';

    $sql = "UPDATE students SET " . implode(', ', $updateFields) . " WHERE `Student Number` = ?";
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

    // Send long data for blobs
    if ($license) {
        $stmt->send_long_data(array_search($licenseContent, $params), $licenseContent);
    }
    if ($orcr) {
        $stmt->send_long_data(array_search($orcrContent, $params), $orcrContent);
    }
    if ($cor) {
        $stmt->send_long_data(array_search($corContent, $params), $corContent);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'User updated successfully.';
    } else {
        $response['message'] = 'Error updating user: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
