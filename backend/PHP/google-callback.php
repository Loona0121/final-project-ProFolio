<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once '../connection/connection.php';
$conn = connection();

// Check DB connection
if (!$conn || $conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection error: ' . $conn->connect_error]);
    exit;
}

header('Content-Type: application/json');

// Get raw POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_token'])) {
    echo json_encode(['success' => false, 'message' => 'ID token is missing.']);
    exit;
}

// Verify the token using Google's public endpoint
$id_token = $data['id_token'];
$verify_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($id_token);

$response = file_get_contents($verify_url);
$payload = json_decode($response, true);

// Validate payload
if (isset($payload['email']) && isset($payload['email_verified']) && $payload['email_verified'] == 'true') {
    $email = strtolower(trim($payload['email'])); // normalize

    // Check if user exists in the _user table
    $stmt = $conn->prepare("SELECT id, role FROM _user WHERE LOWER(TRIM(email)) = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement.']);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $email;
        $_SESSION['role'] = $user['role'];

        if ($user['role'] === 'freelancer') {
            echo json_encode(['success' => true, 'redirect_url' => 'http://profolio.byethost16.com/final-project-ProFolio/backend/freelancerDashboard/freelancerDashboard.php']);
        } elseif ($user['role'] === 'client') {
            echo json_encode(['success' => true, 'redirect_url' => 'http://profolio.byethost16.com/final-project-ProFolio/backend/clientDashboard/clientDashboard.php']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Unknown user role.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No account found for this Google email. Please sign up first.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid or unverified Google ID token.']);
}
