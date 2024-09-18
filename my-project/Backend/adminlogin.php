<?php 
include './database.php';
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["fullname"]) && isset($data["password"])) {
        $fullname = $data["fullname"];
        $password = $data["password"];

        // Update validation to accept any characters (no longer restricted to alphanumeric)
        if (empty($fullname) || empty($password)) {
            $response['success'] = false;
            $response['message'] = 'Invalid input data.';
            echo json_encode($response);
            exit;
        }

        try {
            $stmt = $conn->prepare("SELECT * FROM admin WHERE Name = ?");
            $stmt->bind_param("s", $fullname);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();

                if ($fullname == $row["Name"] && password_verify($password, $row["Password"])) {
                    $_SESSION['login'] = true;
                    $_SESSION["fullname"] = $row["Name"];
                    $_SESSION["isAdmin"] = true;
                    $response['success'] = true;
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
