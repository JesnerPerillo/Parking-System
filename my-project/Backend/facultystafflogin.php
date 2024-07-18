<?php 
  require './connect.php';

  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
  header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
  header('Content-Type: application/json');

  $response = array();

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["fullname"]) && isset($data["email"]) && isset($data["password"])) {
      $fullname = $data["fullname"];
      $email = $data["email"];
      $password = $data["password"];

      if (!preg_match('/^[a-zA-Z ]+$/', $fullname) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['success'] = false;
        $response['message'] = 'Invalid input data';
        echo json_encode($response);
        exit;
      }

      try {
        $stmt = $conn->prepare("SELECT * FROM facultystaff WHERE Name = ?");
        $stmt->bind_param("s", $fullname);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
          $row = $result->fetch_assoc();

          if ($email == $row["Email"] && password_verify($password, $row["Password"])) {
            if (!isset($_SESSION)) session_start();
            $_SESSION["login"] = true;
            $_SESSION["fullname"] = $row["Name"];
            $response['success'] = true;
            $response['message'] = 'Login successful.';
          } elseif ($email != $row["Email"]) {
            $response['success'] = false;
            $response['message'] = 'Email does not match our records.';
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
        $response['message'] = 'An expected error occurred.';
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