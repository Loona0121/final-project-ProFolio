<?php
// save_portfolio.php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $type = $_POST['type'] ?? '';
    $description = $_POST['description'] ?? '';
    $skills = $_POST['skills'] ?? '';
    $experiences = $_POST['experiences'] ?? '';
    $samples = $_POST['samples'] ?? '';

    // You can later store it in a database using SQL
    // For now, just return success
    echo json_encode(['status' => 'success', 'message' => 'Portfolio saved']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
