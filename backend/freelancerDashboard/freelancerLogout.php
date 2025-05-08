<?php
// Prevent caching of the page
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

session_start();
if (!isset($_SESSION['id'])) {
  // If not logged in, redirect to login page
  header("Location: ../PHP/login.php");
  exit();  // Make sure the script stops executing after the redirection
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ProFolio - Logout</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="freelancer.css" rel="stylesheet">
</head>
<body class="pf-logout-body">

  <div class="pf-logout-container">
    <div class="pf-logout-card">
      <div class="pf-logout-logo">
        <i class="fas fa-briefcase pf-logo-icon"></i>
        <h1 class="pf-logo-text">Pro<span class="pf-accent">Folio</span></h1>
      </div>

      <div class="pf-logout-content">
        <div class="pf-logout-icon">
          <i class="fas fa-sign-out-alt"></i>
        </div>
        <h2 class="pf-logout-title">Logging Out</h2>
        <p class="pf-logout-message">Are you sure you want to end your session?</p>

        <div class="pf-logout-buttons">
          <a href="logout.php" id="pf-confirm-logout" class="pf-btn-logout pf-primary">Yes, Log Out</a>
          <a href="freelancerDashboard.php" id="pf-cancel-logout" class="pf-btn-logout pf-secondary">Cancel</a>
        </div>
      </div>

      <div class="pf-logout-footer">
        <p>Thank you for using ProFolio</p>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="JS/freelancerLogout.js"></script> <!-- Make sure you create this file next -->
</body>
</html>
