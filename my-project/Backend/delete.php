<?php
// Include database connection file
include './connect.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the user type and ID from the POST request
    $data = json_decode(file_get_contents('php://input'), true);
    $userType = $_GET['userType']; // Expect userType to be passed as a query parameter
    $id = isset($data['id']) ? $data['id'] : '';

    if (empty($userType) || empty($id)) {
        echo json_encode(['success' => false, 'message' => 'User type or ID missing']);
        exit();
    }

    // Determine the table to use based on the user type
    $table = '';
    if ($userType === 'student') {
        $table = 'students';
    } elseif ($userType === 'faculty') {
        $table = 'facultystaff';
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid user type']);
        exit();
    }

    // Prepare SQL statement to delete the record
    $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>
