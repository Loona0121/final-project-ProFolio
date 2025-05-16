<?php
// Prevent caching of the page - Strong browser cache busting
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Past date

session_start();
if (!isset($_SESSION['id'])) {
  header("Location: ../PHP/login.php");  // Redirect if session is not valid (user not logged in)
  exit();
}

include_once("../connection/connection.php");
include_once("FUNCTIONS/getUserData.php");
$con = connection();

$userID = isset($_GET['user_id']) ? intval($_GET['user_id']) : $_SESSION['id'];

// Process form submissions first
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $profilePhotoPath = isset($_POST['current_photo']) ? $_POST['current_photo'] : 'default-profile-photo.jpg';

  // Handle uploaded photo
  if (isset($_FILES['profile_photo']) && $_FILES['profile_photo']['error'] == 0) {
      $targetDir = "../uploads/";
      if (!file_exists($targetDir)) {
          mkdir($targetDir, 0777, true);
      }
      $fileName = time() . '_' . basename($_FILES["profile_photo"]["name"]);
      $targetFilePath = $targetDir . $fileName;
      move_uploaded_file($_FILES["profile_photo"]["tmp_name"], $targetFilePath);
      $profilePhotoPath = "uploads/" . $fileName;
  }

  // Get other inputs
  $jobTitle = $_POST['job_title'];
  $summary = $_POST['summary'];

  // Ensure we have a fresh connection for the update
  if (isset($con) && $con) {
    $con->close();
  }
  $con = connection();

  // Update user data in _user table
  $update = "UPDATE _user SET profile_photo = ?, job_title = ?, summary = ? WHERE id = ?";
  $stmtUpdate = $con->prepare($update);
  $stmtUpdate->bind_param("sssi", $profilePhotoPath, $jobTitle, $summary, $userID);
  
  // Execute the update and verify success
  if ($stmtUpdate->execute()) {
    // Store updated values directly in session to ensure immediate access
    $_SESSION['updated_profile_photo'] = $profilePhotoPath;
    $_SESSION['updated_job_title'] = $jobTitle;
    $_SESSION['updated_summary'] = $summary;
    $_SESSION['profile_just_updated'] = true;
    
    // Force page reload with timestamp to bypass cache
    header("Location: freelancerProfile.php?profileUpdated=true&refresh=" . time());
    exit();
  } else {
    // Handle error case
    echo "Error updating profile: " . $stmtUpdate->error;
    exit();
  }
}

// After processing form or on initial load - Get fresh data

// Force a fresh query and ensure no caching
if (isset($_GET['refresh'])) {
  // Clear any potential caching
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Pragma: no-cache");
  header("Expires: 0");
}

// Get updated user data - DIRECT QUERY to bypass any caching issues
// First close any existing connection
if (isset($con) && $con) {
  $con->close();
}
$con = connection(); // Get fresh connection

// Direct database query instead of using getUserData function
$sql = "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name, email, profile_photo, job_title, summary, first_name
        FROM _user 
        WHERE id = ?";

$userData = false;
if ($stmt = $con->prepare($sql)) {
  $stmt->bind_param("i", $userID);
  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($row = $result->fetch_assoc()) {
    $userData = [
      'id' => $row['id'],
      'full_name' => $row['full_name'],
      'email' => $row['email'],
      'first_name' => $row['first_name'],
      'profile_photo' => !empty($row['profile_photo']) ? $row['profile_photo'] : 'default-profile-photo.jpg',
      'job_title' => $row['job_title'], // Use actual value even if empty
      'summary' => $row['summary'], // Use actual value even if empty
    ];
    
    // Debug info
    error_log("Job Title from DB: " . (isset($row['job_title']) ? $row['job_title'] : 'not set'));
    error_log("Summary from DB: " . (isset($row['summary']) ? $row['summary'] : 'not set'));
  }
  $stmt->close();
}

// Override with session data if available (for immediate display after update)
if (isset($_SESSION['updated_job_title'])) {
  $userData['job_title'] = $_SESSION['updated_job_title'];
  unset($_SESSION['updated_job_title']);
}
if (isset($_SESSION['updated_summary'])) {
  $userData['summary'] = $_SESSION['updated_summary'];
  unset($_SESSION['updated_summary']);
}
if (isset($_SESSION['updated_profile_photo'])) {
  $userData['profile_photo'] = $_SESSION['updated_profile_photo'];
  unset($_SESSION['updated_profile_photo']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Freelancer Profile</title>
  <!-- Force no cache -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom Dashboard CSS -->
  <link href="ProFolio.css" rel="stylesheet">
  <style>
    #success-notification {
      transition: opacity 0.3s ease-out;
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
        <div class="user-avatar">
          <?php if (!empty($userData['profile_photo'])): ?>
            <img src="<?php echo htmlspecialchars('../' . $userData['profile_photo']); ?>" alt="Profile Photo" class="profile-img">
          <?php else: ?>
            <i class="fas fa-user"></i>
          <?php endif; ?>
        </div>
        <div class="user-info">
          <a href="freelancerProfile.php" class="user-name-link">
            <div class="info-value non-editable"><?php echo htmlspecialchars($userData['full_name']); ?></div>
            <div class="user-role"><?php echo !empty($userData['job_title']) ? htmlspecialchars($userData['job_title']) : 'Freelancer'; ?></div>
          </a>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <li class="nav-item">
            <a href="freelancerDashboard.php" class="nav-link">
              <i class="fas fa-th-large"></i> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a href="freelancerPortfolio.php" class="nav-link">
              <i class="fas fa-palette"></i> Portfolio
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <a href="freelancerLogout.php" class="logout-btn">
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
        
        <!-- Success notification -->
        <?php 
        // Only show notification if both query param AND session flag are set
        if (isset($_GET['profileUpdated']) && $_GET['profileUpdated'] == 'true' && isset($_SESSION['profile_just_updated']) && $_SESSION['profile_just_updated']): 
          // Clear the session flag to prevent showing the notification on refresh
          unset($_SESSION['profile_just_updated']);
        ?>
        <div class="alert alert-success fade show" role="alert" id="success-notification">
          <i class="fas fa-check-circle me-2"></i> Profile updated successfully!
        </div>
        <?php endif; ?>
        
        <!-- Profile Information -->
        <form id="profile-form" action="freelancerProfile.php" method="POST" enctype="multipart/form-data">
  <section class="profile-section">
    <div class="profile-header">
      <div class="profile-photo-container">
        <div class="profile-photo">
          <?php if (!empty($userData['profile_photo'])): ?>
            <img src="<?php echo htmlspecialchars('../' . $userData['profile_photo']); ?>" alt="Profile Photo" class="profile-img">
          <?php else: ?>
            <i class="fas fa-user"></i>
          <?php endif; ?>
        </div>
        <div class="profile-photo-upload">
          <label for="profile-photo-input" class="upload-btn">
            <i class="fas fa-camera"></i> Change Photo
          </label>
          <input type="file" name="profile_photo" id="profile-photo-input" accept="image/*" class="hidden-input">
          <input type="hidden" name="current_photo" value="<?php echo htmlspecialchars($userData['profile_photo']); ?>">
        </div>
      </div>
      
      <div class="profile-basic-info">
        <div class="info-group">
          <label class="info-label">Full Name</label>
          <div class="info-value non-editable" style="color: #555555 !important;"><?php echo htmlspecialchars($userData['full_name']); ?></div>
        </div>
        <div class="info-group">
          <label class="info-label">Email Address</label>
          <div class="info-value non-editable" style="color: #555555 !important;"><?php echo htmlspecialchars($userData['email']); ?></div>
        </div>
        <div class="info-group">
          <label class="info-label">Job Title</label>
          <input type="text" name="job_title" class="form-control info-input" 
  value="<?php echo isset($userData['job_title']) ? htmlspecialchars($userData['job_title']) : ''; ?>">
        </div>
      </div>
    </div>
    
    <!-- Professional Summary -->
    <div class="profile-content-section">
      <h3 class="section-title">Professional Summary</h3>
      <div class="profile-summary">
      <textarea name="summary" class="form-control" rows="4" placeholder="Write a brief professional summary..."><?php echo isset($userData['summary']) ? htmlspecialchars($userData['summary']) : ''; ?></textarea>
      </div>
    </div>

    <!-- Save Profile Changes -->
    <div class="profile-actions">
      <button type="submit" class="btn btn-primary">Save Changes</button>
      <button type="button" class="btn btn-outline-secondary cancel-btn">Cancel</button>
    </div>
  </section>
</form>

        
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
  
  <!-- Script to display current date and handle notifications -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Get current date
      const now = new Date();
      
      // Format options for date display
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      
      // Format and display the date
      const formattedDate = now.toLocaleDateString('en-US', options);
      document.getElementById('current-date').textContent = formattedDate;
      
      // Auto-dismiss notification after 1.5 seconds
      const successNotification = document.getElementById('success-notification');
      if (successNotification) {
        setTimeout(function() {
          successNotification.style.opacity = '0';
          setTimeout(function() {
            successNotification.style.display = 'none';
          }, 300);
        }, 1500);
        
        // Remove the profileUpdated parameter from URL after showing notification
        if (window.location.search.indexOf('profileUpdated=true') !== -1) {
          // Use history.replaceState to remove the query parameter without reloading the page
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({path: newUrl}, '', newUrl);
        }
      }
    });
  </script>
  <script src="JS/freelancerProfile.js"></script>
</body>
</html>