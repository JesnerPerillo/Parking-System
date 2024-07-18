<?php
require './conf.php';

if(isset($_POST["studentNumber"])){
  $studentNumber = $_POST["studentNumber"];
  
  $query = "UPDATE students SET `Time in` = NULL, `Time out` = NULL WHERE `Student Number` = ?";
  $stmt = mysqli_prepare($conn, $query);
  mysqli_stmt_bind_param($stmt, 's', $studentNumber);
  
  if(mysqli_stmt_execute($stmt)){
    echo "Time in and Time out have been reset.";
  } else {
    echo "Error in resetting time.";
  }
} else {
  echo "Invalid request.";
}
?>
