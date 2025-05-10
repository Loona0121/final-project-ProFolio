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


 // PHP generates the text
 $text = "Welcome, " .htmlspecialchars($userData['first_name']) . " to the domain of the monarch";



?>




<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Client Dashboard</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="ProFolio.css" rel="stylesheet">
  <!-- Additional CSS -->
  <style>
    .quick-tips-card {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.3s ease;
      height: 100%;
      padding: 1.5rem !important;
    }
    
    .quick-tips-card:hover {
      transform: translateY(-5px);
    }
    
    .tips-icon {
      font-size: 2.5rem;
      color: #4e73df;
      margin-bottom: 1.25rem;
    }
    
    .section-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .quick-tips-card h5 {
      font-size: 1.3rem;
    }
    
    .quick-tips-card p {
      font-size: 1.05rem;
      line-height: 1.6;
    }
    .info-value.non-editable {
    color: white;
    font-weight: bold;}
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
            <a href="clientDashboard.php" class="nav-link active">
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
            <h2 class="page-title">Client Dashboard</h2>
            <p class="page-subtitle">Expertise & work portfolio overview</p>
          </div>
          <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="current-date"></span>
          </div>
        </header>
        <!-- Welcome Banner -->
        <section class="welcome-banner">
        <h1 class="welcome-title" id = "welcome">Welcome, <?php echo htmlspecialchars($userData['first_name']); ?></h1>
          <p class="welcome-message">Check for new updates and review latest deliverables. Take a look at their latest work and see if they're the right fit for your needs.</p>
          <div class="welcome-actions">
            <a href="clientTalents.php" class="welcome-btn primary">View Talents</a>
            <a href="clientOffers.php" class="welcome-btn">Check Sent Offers</a>
          </div>
        </section>
        
        <!-- Quick Tips Section -->
        <div class="landscape-container">
          <div class="section slide-up">
            <div class="section-header">
              <h3 class="section-title">
                <i class="fas fa-lightbulb"></i> Client Success Tips
              </h3>
            </div>
            <div class="section-content">
              <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                  <div class="card quick-tips-card">
                    <div class="text-center tips-icon">
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <h5 class="text-center mb-3">Clear Project Briefs</h5>
                    <p>Detailed project descriptions with clear goals and expectations attract better talent and lead to successful outcomes.</p>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                  <div class="card quick-tips-card p-4">
                    <div class="text-center tips-icon">
                      <i class="fas fa-comments"></i>
                    </div>
                    <h5 class="text-center mb-3">Effective Communication</h5>
                    <p>Regular check-ins and prompt responses keep projects on track and help maintain strong working relationships.</p>
                  </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                  <div class="card quick-tips-card p-4">
                    <div class="text-center tips-icon">
                      <i class="fas fa-star"></i>
                    </div>
                    <h5 class="text-center mb-3">Recognize Excellence</h5>
                    <p>Providing feedback and reviews helps you build a network of reliable professionals for future projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Professional Development Tip Section (Simplified) -->
        <section class="dashboard-section pro-tip-section">
          <div class="pro-tip-container">
            <div class="pro-tip-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <div class="pro-tip-content">
              <span class="pro-tip-label">PRO TIP</span>
              <p class="pro-tip-text">Clients who leave detailed project descriptions and clear expectations attract 3x more qualified freelancers and complete projects faster.</p>
            </div>
          </div>
        </section>
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
  <script src="JS/clientDashboard.js"></script>

  <script src="https://unpkg.com/typewriter-effect@latest/dist/core.js"></script>
  <script>var app = document.getElementById('welcome');

var typewriter = new Typewriter(app, {
  loop: true,
  delay: 75,
});
var text = <?php echo json_encode($text); ?>;
typewriter
  .pauseFor(1000)
  .typeString(text)
  .pauseFor(40000)
  .deleteChars(10)
  .start();</script>
</body>
</html>