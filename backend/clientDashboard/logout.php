<?php
session_start();  // Make sure session is started before any other operations
session_unset();  // Clear all session variables
session_destroy();  // Destroy the session

// Clear the session cookie
setcookie(session_name(), '', time() - 3600, '/');

// Redirect to login page
header("Location: ../PHP/login.php");
exit();  // Make sure no further code is executed
?>
