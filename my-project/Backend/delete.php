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

error_log('Session Details: ' . print_r($_SESSION, true));

// Check if the user is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve user ID and type from POST request
    $input = json_decode(file_get_contents('php://input'), true); // Use json_decode for raw input
    $id = $input['id'] ?? '';
    $userType = $input['userType'] ?? ''; // Expecting 'student' or 'faculty'

    if (empty($id) || empty($userType)) {
        echo json_encode(['success' => false, 'message' => 'User ID and type are required.']);
        exit();
    }

    if ($userType !== 'student' && $userType !== 'faculty') {
        echo json_encode(['success' => false, 'message' => 'Invalid user type.']);
        exit();
    }

    $table = $userType === 'student' ? 'students' : 'facultystaff';
    $dependentTable = $userType === 'student' ? 'studentparkingslots' : 'facultyparkingslots';

    // First delete from dependent table if applicable
    if ($dependentTable) {
        $sql = "DELETE FROM $dependentTable WHERE `{$userType}_id` = ?";
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            error_log('Error preparing statement for dependent table: ' . $conn->error);
            $response['success'] = false;
            $response['message'] = 'Error preparing statement for dependent table.';
            echo json_encode($response);
            exit();
        }

        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            error_log('Error executing statement for dependent table: ' . $stmt->error);
            $response['success'] = false;
            $response['message'] = 'Error executing statement for dependent table.';
            echo json_encode($response);
            exit();
        }
        $stmt->close();
    }

    // Now delete from the main table
    $sql = "DELETE FROM $table WHERE `id` = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log('Error preparing statement for main table: ' . $conn->error);
        $response['success'] = false;
        $response['message'] = 'Error preparing statement for main table.';
        echo json_encode($response);
        exit();
    }

    $stmt->bind_param('i', $id);
    if (!$stmt->execute()) {
        error_log('Error executing statement for main table: ' . $stmt->error);
        $response['success'] = false;
        $response['message'] = 'Error executing statement for main table.';
        echo json_encode($response);
        exit();
    }

    $response['success'] = true;
    $response['message'] = 'User deleted successfully.';
    $stmt->close();
    $conn->close();
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
