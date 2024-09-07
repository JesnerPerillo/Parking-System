<?php
session_start();
header('Content-Type: application/json');

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Debugging: Log session details
error_log('Session Details: ' . print_r($_SESSION, true));

// Check if the user is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

// Include database connection
include './database.php';

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit();
}

// Retrieve input
$userType = $_POST['user_type'] ?? null;
$id = $_POST['id'] ?? null;
$time_in = $_POST['time_in'] ?? null;
$time_out = $_POST['time_out'] ?? null;

error_log('Received POST Data: ' . print_r($_POST, true));

if (!$userType || !$id) {
    echo json_encode(['status' => 'error', 'message' => 'User type and ID are required']);
    exit();
}

$update_fields = [];
$update_values = [];

if ($time_in) {
    $update_fields[] = '`Time In` = ?';
    $update_values[] = $time_in;
}

if ($time_out) {
    $update_fields[] = '`Time Out` = ?';
    $update_values[] = $time_out;
}

if (empty($update_fields)) {
    echo json_encode(['status' => 'error', 'message' => 'No time data provided']);
    exit();
}

$update_values[] = $id;

$table = $userType === 'faculty' ? 'facultystaff' : 'students';

// Update user's time in/out in the respective table
$sql = "UPDATE $table SET " . implode(', ', $update_fields) . " WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'Prepare statement failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param(str_repeat('s', count($update_values) - 1) . 'i', ...$update_values);

if ($stmt->execute()) {
    // Fetch user details for logging
    $user_info_query = $userType === 'faculty' ? 
        "SELECT Name, Position FROM facultystaff WHERE id = ?" : 
        "SELECT Name, `Student Number` FROM students WHERE id = ?";
    $user_stmt = $conn->prepare($user_info_query);
    $user_stmt->bind_param('i', $id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();

    if ($user_result->num_rows > 0) {
        $user_info = $user_result->fetch_assoc();
        $name = $user_info['Name'];
        $student_number = $userType === 'student' ? $user_info['Student Number'] : null;  // Fix: Use correct quoting for array key
        $position = $userType === 'faculty' ? $user_info['Position'] : null;
    
        // Insert log into Logs table
        $log_query = "INSERT INTO Logs (user_type, user_id, `Student Number`, Name, Position, `Time In`, `Time Out`, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
        $log_stmt = $conn->prepare($log_query);
        $log_stmt->bind_param('sisssss', $userType, $id, $student_number, $name, $position, $time_in, $time_out);
        if ($log_stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Time updated and logged successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error logging time: ' . $log_stmt->error]);
        }
    
        $log_stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }    

    $user_stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error updating time: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
