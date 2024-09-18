<?php
  include 'connect.php'; 
  session_start();
  header("Access-Control-Allow-Origin: https://parking-system-rosy.vercel.app");
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
        $stmt = $conn->prepare("SELECT * FROM facultystaff WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $name = $user['Name'];
            
            // Generate a random temporary password
            $tempPassword = bin2hex(random_bytes(4)); // 8-character temporary password
            $hashedTempPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

            // Update the user's password in the database
            $updateStmt = $conn->prepare("UPDATE facultystaff SET Password = ? WHERE Email = ?");
            $updateStmt->bind_param("ss", $hashedTempPassword, $email);
            $updateStmt->execute();

            // Prepare the HTML email content
            $to = $email;
            $subject = "Password Reset Request";

            // HTML content for the email
            $message = "
                <html>
                <head>
                    <title>Password Reset Request</title>
                    <style>
                        .email-container {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            background-color: #f9f9f9;
                            border: 1px solid #e0e0e0;
                        }
                        .email-header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px;
                            text-align: center;
                        }
                        .email-body {
                            margin: 20px;
                        }
                        .email-footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                <body>
                    <div class='email-container'>
                        <div class='email-header'>
                            <h1>Password Reset</h1>
                        </div>
                        <div class='email-body'>
                            <p>Hello, $name,</p>
                            <p>Your temporary password is: <strong>$tempPassword</strong></p>
                            <p>Please log in and change your password immediately.</p>
                            <p>https://parking-system-rosy.vercel.app/</p>
                            <br>
                            <p>If you did not request a password reset, please ignore this email.</p>
                        </div>
                        <div class='email-footer'>
                            <p>Thank you,<br>Parking System Team</p>
                            <img src='https://scontent.fmnl11-1.fna.fbcdn.net/v/t39.30808-1/276138400_136795555524750_8305004736751684992_n.jpg?stp=dst-jpg_s200x200&_nc_cat=106&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeHgycAq0OdYUyrPdW1XQB8dPC8UAoISNW48LxQCghI1bqq6T1LdWn98qGCKs6_Hex7LI5EoQCqfUTaOe_R1aLi7&_nc_ohc=lz-CLmCrcUkQ7kNvgE_U6Al&_nc_ht=scontent.fmnl11-1.fna&_nc_gid=AyAxM0zCWFuTMGbaoZi8Kbl&oh=00_AYCnxKympskIEJfzEs4z-MO08qD7OUw6kqFowp9wYhTyOg&oe=66F09AC0' alt='Parking System Logo' style='width:150px;'/>
                        </div>
                    </div>
                </body>
                </html>
            ";

            // Set the headers for HTML content
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
            $headers .= "From: perillojesner15@gmail.com" . "\r\n";

            // Send the email
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
