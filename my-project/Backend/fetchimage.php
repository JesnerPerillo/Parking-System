<?php
include './database.php';
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

error_log('Session Details: ' . print_r($_SESSION, true));

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if the studentNumber session variable is set
    if (isset($_SESSION['studentNumber'])) {
        $studentNumber = $_SESSION['studentNumber'];
        $sql = "SELECT License, ORCR FROM students WHERE `Student Number` = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $studentNumber);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($licenseBlob, $orcrBlob);
            $stmt->fetch();

            $imageType = isset($_GET['type']) ? $_GET['type'] : 'License'; // Default to License

            if ($imageType === 'License' && $licenseBlob) {
                // Dynamically detect MIME type if available
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mimeType = $finfo->buffer($licenseBlob);
                header('Content-Type: ' . $mimeType);
                echo $licenseBlob;
            } elseif ($imageType === 'ORCR' && $orcrBlob) {
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mimeType = $finfo->buffer($orcrBlob);
                header('Content-Type: ' . $mimeType);
                echo $orcrBlob;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'No image found']);
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
