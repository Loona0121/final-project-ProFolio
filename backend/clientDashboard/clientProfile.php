<?php
session_start();
include_once("../connection/connection.php");
include_once("../freelancerDashboard/FUNCTIONS/getUserData.php"); 
$con = connection();

if (!isset($_SESSION['id'])) {
  // If not logged in, redirect to login page
  header("Location: ../PHP/login.php");
  exit();  // Make sure the script stops executing after the redirection
}
$userID = $_SESSION['id'];  // Ensure the user is logged in
$userData = getUserData($userID);

?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Client Profile</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom Dashboard CSS -->
  <link href="ProFolio.css" rel="stylesheet">
  <style>
  .info-value.non-editable {
  color:rgb(82, 50, 50);         /* Ensures text is visible (black text) */
  }
.user-info .info-value.non-editable {
  color: #ffffff; 
}

</style>
  </head>
<body>
  <!-- Layout Container -->
  <div class="dashboard-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-icon"><i class="fas fa-briefcase"></i></span>
          <span class="logo-text">Pro<span class="accent">Folio</span></span>
        </div>
      </div>
      
      <div class="sidebar-user">
        <div class="user-avatar" id="sidebar-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-info">
          <a href="clientProfile.php" class="user-name-link">
             <div class="info-value non-editable"><?php echo htmlspecialchars($userData['full_name']); ?></div>
            <div class="user-role" id="sidebar-role">Client</div>
          </a>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <li class="nav-item">
            <a href="clientDashboard.php" class="nav-link">
              <i class="fas fa-th-large"></i> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a href="clientTalents.php" class="nav-link">
              <i class="fas fa-users"></i> Find Talents
            </a>
          </li>
          <li class="nav-item">
            <a href="clientOffers.php" class="nav-link">
              <i class="fas fa-paper-plane"></i> Sent Offers
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <a href="clientLogout.php" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </a>
      </div>
    </aside>
    
    <!-- Main Content Area -->
    <main class="main-content">
      <div class="page-content">
        <!-- Page Header -->
        <header class="page-header">
          <div>
            <h2 class="page-title">Your Profile</h2>
            <p class="page-subtitle">Manage your professional information</p>
          </div>
          <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="current-date"></span>
          </div>
        </header>

        <!-- Profile Content -->
        <div class="profile-container">
          <div class="card profile-card">
            <div class="card-body">
              <form id="profile-form">
                <div class="row">
                  <div class="col-md-3 text-center mb-4">
                    <div class="profile-photo-container">
                      <div class="profile-photo" id="profile-photo">
                        <i class="fas fa-user"></i>
                      </div>
                      <label for="photo-upload" class="change-photo-btn">
                        <i class="fas fa-camera me-2"></i> Change Photo
                      </label>
                      <input type="file" id="photo-upload" class="d-none" accept="image/*">
                    </div>
                  </div>
                  
                  <div class="col-md-9">
                    <div class="mb-3">
                      <label for="fullName" class="form-label">Full Name</label>
                      <div class="info-value non-editable"><?php echo htmlspecialchars($userData['full_name']); ?></div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="emailAddress" class="form-label">Email Address</label>
                      <div class="info-value non-editable"><?php echo htmlspecialchars($userData['email']); ?></div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="companyName" class="form-label">Company (Optional)</label>
                      <input type="text" class="form-control" id="companyName" placeholder="Enter your company name">
                    </div>
                  </div>
                </div>
              
                <div class="mt-4 d-flex justify-content-end gap-2">
                  <button type="submit" class="btn btn-primary" id="save-btn">Save Changes</button>
                  <button type="button" class="btn btn-outline-secondary" id="cancel-btn">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      
        <!-- Dashboard Footer -->
        <footer class="dashboard-footer">
          <p>ProFolio helps you showcase your work and connect with clients worldwide. Keep your portfolio updated to maximize opportunities.</p>
          <div class="footer-links">
            <a href="#">Terms of Service and Privacy Policy</a>
          </div>
        </footer>
      </div>
    </main>
  </div>
  <!-- Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Script to display current date -->
  <script src="JS/clientProfile.js"></script>
</body>
</html>