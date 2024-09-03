<?php
// Include database connection file
include './connect.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debugging: Log received data and parameters
    error_log('Received POST request');
    $data = json_decode(file_get_contents('php://input'), true);
    $userType = isset($_GET['userType']) ? $_GET['userType'] : '';
    $id = isset($data['id']) ? $data['id'] : '';

    error_log('User Type: ' . $userType);
    error_log('ID: ' . $id);

    if (empty($userType) || empty($id)) {
        echo json_encode(['success' => false, 'message' => 'User type or ID missing']);
        exit();
    }

    $table = '';
    if ($userType === 'student') {
        $table = 'students';
    } elseif ($userType === 'faculty') {
        $table = 'facultystaff';
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid user type']);
        exit();
    }

    // Prepare SQL statement
    $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
