<?php
// Prevent caching of the page
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

session_start();
if (!isset($_SESSION['id'])) {
  header("Location: ../PHP/login.php");  // Redirect if session is not valid (user not logged in)
  exit();
}

include_once("../connection/connection.php");
include_once("FUNCTIONS/getUserData.php");
$con = connection();

$userID = isset($_GET['user_id']) ? intval($_GET['user_id']) : $_SESSION['id'];

$userData = getUserData($userID);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $profilePhotoPath = $userData['profile_photo'];  // Default to current photo

  // Handle uploaded photo
  if (isset($_FILES['profile_photo']) && $_FILES['profile_photo']['error'] == 0) {
      $targetDir = "uploads/";
      if (!file_exists($targetDir)) {
          mkdir($targetDir, 0777, true);
      }
      $fileName = time() . '_' . basename($_FILES["profile_photo"]["name"]);
      $targetFilePath = $targetDir . $fileName;
      move_uploaded_file($_FILES["profile_photo"]["tmp_name"], $targetFilePath);
      $profilePhotoPath = $targetFilePath;
  }

  // Get other inputs
  $jobTitle = $_POST['job_title'];
  $summary = $_POST['summary'];

  // Update user data in _user table
  $update = "UPDATE _user SET profile_photo = ?, job_title = ?, summary = ? WHERE id = ?";
  $stmtUpdate = $con->prepare($update);
  $stmtUpdate->bind_param("sssi", $profilePhotoPath, $jobTitle, $summary, $userID);
  $stmtUpdate->execute();

  // Redirect back to profile page after update
  header("Location: freelancerProfile.php?profileUpdated=true");  // Add query param to show updated
  exit();
}

?>



<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Freelancer Profile</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom Dashboard CSS -->
  <link href="freelancer.css" rel="stylesheet">
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
          <i class="fas fa-user"></i>
        </div>
        <div class="user-info">
          <a href="freelancerProfile.php" class="user-name-link">
          <div class="info-value non-editable"><?php echo htmlspecialchars($userData['full_name']); ?></div>
          <div class="info-value non-editable"> <?php echo htmlspecialchars($userData['job_title']); ?></div>
           
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
          <li class="nav-item">
            <a href="freelancerOffers.php" class="nav-link">
              <i class="fas fa-briefcase"></i> Job Offers
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
        
        <!-- Profile Information -->
        <form id="profile-form" action="freelancerProfile.php" method="POST" enctype="multipart/form-data">
  <section class="profile-section">
    <div class="profile-header">
      <div class="profile-photo-container">
        <div class="profile-photo">
          <i class="fas fa-user"></i>
        </div>
        <div class="profile-photo-upload">
          <label for="profile-photo-input" class="upload-btn">
            <i class="fas fa-camera"></i> Change Photo
          </label>
          <input type="file" name="profile_photo" id="profile-photo-input" accept="image/*" class="hidden-input">
        </div>
      </div>
      
      <div class="profile-basic-info">
        <div class="info-group">
          <label class="info-label">Full Name</label>
          <div class="info-value non-editable"><?php echo htmlspecialchars($userData['full_name']); ?></div>
        </div>
        <div class="info-group">
          <label class="info-label">Email Address</label>
          <div class="info-value non-editable"><?php echo htmlspecialchars($userData['email']); ?></div>
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
      <button type="submit" class="btn btn-primary save-changes-btn">Save Changes</button>
      <button type="button" class="btn btn-outline-secondary cancel-btn">Cancel</button>
    </div>
  </section>
</form>

        
        <!-- Hidden Job Offer Details Modal Structure (HTML Only) -->
        <div class="offer-details-modal" id="offerDetailsModal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Job Offer Details</h3>
              <button class="close-modal-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="offer-company-header">
                <div class="company-logo">
                  <i class="fas fa-building"></i>
                </div>
                <div class="company-details">
                  <h4 class="job-title">Senior Front-End Developer</h4>
                  <p class="company-name">TechSolutions Inc.</p>
                  <div class="offer-meta-tags">
                    <span class="meta-tag"><i class="fas fa-map-marker-alt"></i> Remote</span>
                    <span class="meta-tag"><i class="far fa-clock"></i> Contract</span>
                    <span class="meta-tag"><i class="fas fa-dollar-sign"></i> $60-80/hr</span>
                    <span class="meta-tag"><i class="far fa-calendar"></i> Posted 3 days ago</span>
                  </div>
                </div>
              </div>
              
              <div class="offer-section">
                <h5 class="offer-section-title">Job Description</h5>
                <div class="offer-description">
                  <p>We are looking for an experienced developer to lead our front-end team on a new SaaS platform. You will work closely with our design and back-end teams to build robust, responsive, and intuitive user interfaces.</p>
                  <p>As the lead front-end developer, you will be responsible for architecture decisions, code quality, and mentoring junior developers.</p>
                </div>
              </div>
              
              <div class="offer-section">
                <h5 class="offer-section-title">Requirements</h5>
                <ul class="offer-requirements-list">
                  <li>5+ years experience with modern JavaScript and front-end frameworks</li>
                  <li>Expert knowledge of React, TypeScript, and state management</li>
                  <li>Strong understanding of responsive design principles</li>
                  <li>Experience with REST APIs and GraphQL</li>
                  <li>Ability to optimize front-end performance</li>
                </ul>
              </div>
              
              <div class="offer-section">
                <h5 class="offer-section-title">Skills</h5>
                <div class="offer-skills">
                  <span class="skill-tag">React</span>
                  <span class="skill-tag">TypeScript</span>
                  <span class="skill-tag">Redux</span>
                  <span class="skill-tag">HTML5/CSS3</span>
                  <span class="skill-tag">GraphQL</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary apply-btn">Apply for This Position</button>
              <button class="btn btn-outline-secondary save-btn">Save for Later</button>
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
    });


    document.addEventListener('DOMContentLoaded', function() {
  // Get the current session user ID from PHP
  const sessionUserId = "<?php echo $_SESSION['id']; ?>";

  // Get the user ID being loaded from the page URL (you should pass this via PHP)
  const loadedUserId = "<?php echo isset($_GET['user_id']) ? $_GET['user_id'] : ''; ?>";  // This assumes you're passing user_id in the URL

  
if (window.location.search.indexOf('profileUpdated=true') !== -1) {
  document.querySelector('#profile-form').reset(); 
}


  // If the profile is updated, clear the form
  if (window.location.search.indexOf('profileUpdated=true') !== -1) {
    document.querySelector('#profile-form').reset(); // Reset all form fields
  }
});
  
  </script>
  <script src="JS/freelancerProfile.js"></script>
</body>
</html>