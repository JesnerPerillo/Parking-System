<?php 
  require './database.php';
  session_start();

  header('Access-Control-Allow-Origin: http://localhost:3000');
  header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
  header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
  header('Access-Control-Allow-Credentials: true');
  header('Content-Type: application/json');

  $response = array();

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["employeeId"]) && isset($data["fullname"]) && isset($data["password"])) {
      $employeeId = $data["employeeId"];
      $fullname = $data["fullname"];
      $password = $data["password"];

      try {
        $stmt = $conn->prepare("SELECT * FROM facultystaff WHERE `Employee Id` = ?");
        $stmt->bind_param("s", $employeeId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
          $row = $result->fetch_assoc();

          if ($employeeId == $row['Employee Id'] && $fullname == $row["Name"] && password_verify($password, $row["Password"])) {
            if (!isset($_SESSION)) session_start();
            $_SESSION["login"] = true;
            $_SESSION["employeeId"] = $row['Employee Id'];

            $response['success'] = true;
          } elseif ($employeeId != $row['Employee Id']) {
            $response['success'] = false;
            $response['message'] = 'Employee Id does not match our records.';
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
