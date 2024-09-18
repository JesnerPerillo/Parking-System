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
    if (isset($_SESSION['studentNumber'])) {
        $studentNumber = $_SESSION['studentNumber'];
        $sql = "SELECT License, ORCR, COR FROM students WHERE `Student Number` = ?";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            error_log("Prepare failed: " . $conn->error);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Database query preparation failed']);
            exit;
        }

        $stmt->bind_param("s", $studentNumber);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($licenseBlob, $orcrBlob, $corBlob);
            $stmt->fetch();

            $imageType = isset($_GET['type']) ? $_GET['type'] : 'License';
            $imageType = in_array($imageType, ['License', 'ORCR', 'COR']) ? $imageType : 'COR'; // Default to COR

            $blob = null;
            switch ($imageType) {
                case 'License':
                    $blob = $licenseBlob;
                    break;
                case 'ORCR':
                    $blob = $orcrBlob;
                    break;
                case 'COR':
                    $blob = $corBlob;
                    break;
            }

            if ($blob) {
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $mimeType = $finfo->buffer($blob);
                header('Content-Type: ' . $mimeType);
                echo $blob;
            } else {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'message' => 'Image not found']);
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
