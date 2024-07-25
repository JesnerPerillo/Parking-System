<?php
include './database.php';
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['fullname'])) {
        $fullname = $_SESSION['fullname'];
        $sql = "SELECT License, ORCR FROM facultystaff WHERE Name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $fullname);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($licenseBlob, $orcrBlob);
            $stmt->fetch();

            $imageType = isset($_GET['type']) ? $_GET['type'] : 'License'; // Default to License

            if ($imageType === 'License' && $licenseBlob) {
                header('Content-Type: image/jpeg'); // Adjust based on actual format
                echo $licenseBlob;
            } elseif ($imageType === 'ORCR' && $orcrBlob) {
                header('Content-Type: image/jpeg'); // Adjust based on actual format
                echo $orcrBlob;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => true, 'message' => 'image found']);
            }
        } else {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'No image found']);
        }
        $stmt->close();
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
    }
}
?>
