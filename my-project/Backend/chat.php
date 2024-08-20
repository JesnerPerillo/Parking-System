<?php
include './database.php';
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$action = $_POST['action'];

if ($action == 'createChatSession') {
    $user_id = $_POST['user_id'];
    $user_type = $_POST['user_type'];
    $admin_id = $_POST['admin_id'];
    
    $sql = "INSERT INTO chat_sessions (user_id, user_type, admin_id) VALUES ('$user_id', '$user_type', '$admin_id')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["chat_session_id" => $conn->insert_id]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }
} elseif ($action == 'sendMessage') {
    $chat_session_id = $_POST['chat_session_id'];
    $sender_id = $_POST['sender_id'];
    $sender_type = $_POST['sender_type'];
    $message = $_POST['message'];
    
    $stmt = $conn->prepare("INSERT INTO messages (chat_session_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('iiss', $chat_session_id, $sender_id, $sender_type, $message);
    if ($stmt->execute()) {
        echo json_encode(["status" => "Message sent successfully"]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
} elseif ($action == 'fetchMessages') {
    $chat_session_id = $_POST['chat_session_id'];
    
    $stmt = $conn->prepare("SELECT * FROM messages WHERE chat_session_id = ? ORDER BY timestamp ASC");
    $stmt->bind_param('i', $chat_session_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    
    echo json_encode($messages);
}

$conn->close();
?>
