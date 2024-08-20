<?php
include './database.php'; 
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000'); // Adjust according to your frontend origin
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true'); // Allow credentials
header('Content-Type: application/json');

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["studentNumber"]) && isset($data["fullname"]) && isset($data["password"])) {
        $studentNumber = $data["studentNumber"];
        $fullname = $data["fullname"];
        $password = $data["password"];

        // Debugging: Log input values
        error_log("Student Number: " . $studentNumber);
        error_log("Full Name: " . $fullname);

        // Input validation
        if (!preg_match('/^[a-zA-Z0-9\-.]+$/', $studentNumber) || !preg_match('/^[a-zA-Z\-.]+$/', $fullname)) {
            $response['success'] = false;
            $response['message'] = 'Invalid input data';
            echo json_encode($response);
            exit;
        }

        try {
            $stmt = $conn->prepare("SELECT * FROM students WHERE `Student Number` = ?");
            $stmt->bind_param("s", $studentNumber);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();

                if ($fullname == $row["Name"] && password_verify($password, $row["Password"])) {
                    $_SESSION["login"] = true;
                    $_SESSION["studentNumber"] = $row["Student Number"];

                    $response['success'] = true;
                } elseif ($fullname != $row["Name"]) {
                    $response['success'] = false;
                    $response['message'] = 'Name does not match our records.';
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Incorrect password.';
                }
            } else {
                $response['success'] = false;
                $response['message'] = 'User not found.';
            }
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
            $response['success'] = false;
            $response['message'] = 'An unexpected error occurred.';
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'Incomplete data received.';
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
