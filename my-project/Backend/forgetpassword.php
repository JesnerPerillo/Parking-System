<?php
  include './database.php'; 
  session_start();
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');

  error_reporting(E_ALL);
  ini_set('display_errors', 1);

  $response = array();

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['email'])) {
        $email = $data['email'];

        // Check if the email exists in the database
        $stmt = $conn->prepare("SELECT * FROM students WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // Generate a random temporary password
            $tempPassword = bin2hex(random_bytes(4)); // 8-character temporary password
            $hashedTempPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

            // Update the user's password in the database
            $updateStmt = $conn->prepare("UPDATE students SET Password = ? WHERE Email = ?");
            $updateStmt->bind_param("ss", $hashedTempPassword, $email);
            $updateStmt->execute();

            // Send the temporary password to the user's email
            $to = $email;
            $subject = "Password Reset Request";
            $message = "Hello, \n\nYour temporary password is: $tempPassword\nPlease log in and change your password immediately.";
            $headers = "From: perillojesner15@gmail.com";

            if (mail($to, $subject, $message, $headers)) {
                $response['success'] = true;
                $response['message'] = 'A temporary password has been sent to your email.';
            } else {
                $response['success'] = false;
                $response['message'] = 'Failed to send email. Please try again.';
            }
        } else {
            $response['success'] = false;
            $response['message'] = 'No account found with that email address.';
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'Email address is required.';
    }
  } else {
      $response['success'] = false;
      $response['message'] = 'Invalid request method.';
  }

  echo json_encode($response);
  ?>
