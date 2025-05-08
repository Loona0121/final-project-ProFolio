<?php
session_start();
include_once("../connection/connection.php");
include_once("FUNCTIONS/getUserData.php"); 
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
  <title>ProFolio - Freelancer Dashboard</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom Dashboard CSS -->
  <link href="ProFolio.css" rel="stylesheet">
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
            <a href="freelancerDashboard.php" class="nav-link active">
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
            <h2 class="page-title">Freelancer Dashboard</h2>
            <p class="page-subtitle">Your professional portfolio overview</p>
          </div>
          <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="current-date"></span>
          </div>
        </header>
        
        <!-- Welcome Banner -->
        <section class="welcome-banner">
          <h1 class="welcome-title">Welcome, <?php echo htmlspecialchars($userData['first_name']); ?></h1>
          <p class="welcome-message">Your professional portfolio is looking great. Keep it updated to attract more clients and showcase your latest work.</p>
          <div class="welcome-actions">
            <a href="freelancerPortfolio.php" class="welcome-btn primary">View Portfolio</a>
            <a href="freelancerOffers.php" class="welcome-btn">Check Job Offers</a>
          </div>
        </section>
        
         <!-- Main Dashboard Sections -->
         <div class="dashboard-sections">
          <!-- Professional Tips Section -->
          <section class="dashboard-section pro-tips-section">
            <header class="section-header">
              <h3 class="section-title">
                <i class="fas fa-star"></i> Pro Tips for Success
              </h3>
            </header>
            <div class="section-content">
              <div class="tips-container">
                <!-- Pro Tip Card 1 -->
                <div class="tip-card">
                  <div class="tip-icon">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="tip-content">
                    <h4>Time Management</h4>
                    <p>Use the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break to maintain productivity.</p>
                  </div>
                </div>
                
                <!-- Pro Tip Card 2 -->
                <div class="tip-card">
                  <div class="tip-icon">
                    <i class="fas fa-comments"></i>
                  </div>
                  <div class="tip-content">
                    <h4>Client Communication</h4>
                    <p>Respond to client messages within 4 hours during business days to maintain a 95% satisfaction rate.</p>
                  </div>
                </div>
                
                <!-- Pro Tip Card 3 (Added) -->
                <div class="tip-card">
                  <div class="tip-icon">
                    <i class="fas fa-chart-line"></i>
                  </div>
                  <div class="tip-content">
                    <h4>Track Your Progress</h4>
                    <p>Set weekly goals and measure your achievements to stay motivated and continuously improve your skills.</p>
                  </div>
                </div>
                
                <!-- Pro Tip Card 4 (Added) -->
                <div class="tip-card">
                  <div class="tip-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="tip-content">
                    <h4>Network Effectively</h4>
                    <p>Dedicate at least 2 hours weekly to professional networking to discover new opportunities and collaborations.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <!-- Professional Development Quote Section -->
        <section class="dashboard-section pro-tip-section">
          <div class="pro-tip-container">
            <div class="pro-tip-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <div class="pro-tip-content">
              <span class="pro-tip-label">DAILY INSPIRATION</span>
              <p class="pro-tip-text">"The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." — Steve Jobs</p>
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
  </script>
  <script src="JS/freelancerDashboard.js"></script>
</body>
</html>