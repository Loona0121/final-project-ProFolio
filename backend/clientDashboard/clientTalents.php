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

// Function to get all freelancers from the database
function getFreelancers() {
  global $con;
  
  // Query to select all users who are freelancers
 $query = "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
                 u.profile_photo, u.job_title, u.summary AS professional_summary,
                 GROUP_CONCAT(DISTINCT s.skill_name ORDER BY s.skill_name SEPARATOR ', ') AS skills
          FROM _user u
          LEFT JOIN portfolio p ON u.id = p.user_id
          LEFT JOIN portfolio_skills ps ON p.portfolio_id = ps.portfolio_id
          LEFT JOIN skills s ON ps.skill_id = s.skill_id
          WHERE u.role = 'freelancer'
          GROUP BY u.id
          ORDER BY u.first_name ASC";

  $result = mysqli_query($con, $query);

  if (!$result) {
    die("Query failed: " . mysqli_error($con));
}
  $freelancers = array();
  if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {

      // Fix profile photo path
      if (empty($row['profile_photo']) || $row['profile_photo'] == 'default-profile-photo.jpg') {
        $row['profile_photo'] = '/api/placeholder/100/100'; // Default placeholder
      }

      // Prepend ../ if profile_photo starts with 'uploads/' and doesn't already start with '../'
      if (strpos($row['profile_photo'], 'uploads/') === 0) {
        $row['profile_photo'] = '../' . $row['profile_photo'];
      }

      
      // Set default values for missing data
      if (empty($row['job_title'])) {
        $row['job_title'] = 'Freelancer';
      }
      
      if (empty($row['professional_summary'])) {
        $row['professional_summary'] = 'Professional with experience in various projects.';
      }
      
      // Process skills
      $skills = !empty($row['skills']) ? explode(',', $row['skills']) : [];
      $row['skills_array'] = array_slice($skills, 0, 3); // Get first 3 skills for display
      $row['all_skills'] = $skills;

      
      // Add to freelancers array
      $freelancers[] = $row;
    }
  }
  
  return $freelancers;
}

// Get all freelancers
$freelancers = getFreelancers();

// Function to get portfolios for a specific freelancer
function getFreelancerPortfolios($userId) {
  global $con;
  
  $portfolios = array();
  
  // Get portfolios
  $query = "SELECT p.portfolio_id AS id, p.name AS title, p.description, p.created_at AS last_updated
            FROM portfolio p
            WHERE p.user_id = ?";
  $stmt = mysqli_prepare($con, $query);
  if (!$stmt) {
    throw new Exception('Prepare failed: ' . mysqli_error($con));
  }
  mysqli_stmt_bind_param($stmt, 'i', $userId);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);
  
  while ($row = mysqli_fetch_assoc($result)) {
    $portfolioId = $row['id'];
    
    // Get experience data
    $expQuery = "SELECT title, company, 
                        CONCAT(start_date, ' - ', IFNULL(end_date, 'Present')) AS date,
                        description
                 FROM work_experience
                 WHERE portfolio_id = ?";
    $expStmt = mysqli_prepare($con, $expQuery);
    mysqli_stmt_bind_param($expStmt, 'i', $portfolioId);
    mysqli_stmt_execute($expStmt);
    $expResult = mysqli_stmt_get_result($expStmt);
    $row['experience'] = [];
    while ($exp = mysqli_fetch_assoc($expResult)) {
      $row['experience'][] = $exp;
    }
    
    // Get samples data
    $samplesQuery = "SELECT title, description, url AS link
                     FROM work_samples
                     WHERE portfolio_id = ?";
    $samplesStmt = mysqli_prepare($con, $samplesQuery);
    mysqli_stmt_bind_param($samplesStmt, 'i', $portfolioId);
    mysqli_stmt_execute($samplesStmt);
    $samplesResult = mysqli_stmt_get_result($samplesStmt);
    $row['samples'] = [];
    while ($sample = mysqli_fetch_assoc($samplesResult)) {
      $row['samples'][] = $sample;
    }
    
    // Get skills data
    $skillsQuery = "SELECT s.skill_name
                    FROM portfolio_skills ps
                    JOIN skills s ON ps.skill_id = s.skill_id
                    WHERE ps.portfolio_id = ?";
    $skillsStmt = mysqli_prepare($con, $skillsQuery);
    mysqli_stmt_bind_param($skillsStmt, 'i', $portfolioId);
    mysqli_stmt_execute($skillsStmt);
    $skillsResult = mysqli_stmt_get_result($skillsStmt);
    $skillsArray = [];
    while ($skill = mysqli_fetch_assoc($skillsResult)) {
      $skillsArray[] = $skill['skill_name'];
    }
    $row['skills_array'] = $skillsArray;
    
    $portfolios[] = $row;
  }
  
  return $portfolios;
}

// Check if this is an AJAX request for portfolios
if (isset($_GET['action']) && $_GET['action'] === 'get_portfolios' && isset($_GET['user_id'])) {
  $userId = intval($_GET['user_id']);
  
  try {
    $portfolios = getFreelancerPortfolios($userId);
    
    // Add debugging information in development
    $response = array(
      'success' => true,
      'portfolios' => $portfolios,
      'count' => count($portfolios),
      'user_id' => $userId,
      'debug' => array(
        'tables' => array(
          'freelancer_portfolios_exists' => table_exists($con, 'freelancer_portfolios'),
          'portfolio_exists' => table_exists($con, 'portfolio'),
          'work_experience_exists' => table_exists($con, 'work_experience'),
          'work_samples_exists' => table_exists($con, 'work_samples')
        ),
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => phpversion()
      )
    );
    
    // Output JSON
    header('Content-Type: application/json');
    echo json_encode($response);
  } catch (Exception $e) {
    // Handle any errors
    header('Content-Type: application/json');
    echo json_encode([
      'success' => false,
      'error' => $e->getMessage(),
      'user_id' => $userId
    ]);
  }
  exit;
}

// Helper function to check if a table exists
function table_exists($con, $table_name) {
  $result = mysqli_query($con, "SHOW TABLES LIKE '$table_name'");
  return mysqli_num_rows($result) > 0;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Find Talents</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom CSS -->
  <link href="ProFolio.css" rel="stylesheet">
  <style>
    /* Modal scrolling fix */
    .modal-dialog {
      max-height: 90vh;
    }
    
    .modal-content {
      max-height: 90vh;
    }
    
    .modal-body {
      overflow-y: auto;
      max-height: calc(90vh - 120px); /* Adjust for header and footer */
    }
    
    /* Center portfolio modal content - FIXED STYLING */
    .portfolio-modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 0 auto;
      width: 100%;
    }
    
    .talent-profile-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
    }
    
    .talent-profile-avatar {
      margin-bottom: 1rem;
    }
    
    .talent-profile-details {
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .portfolio-section {
      width: 100%;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    
    #view-portfolio-skills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    /* Fix experience items alignment */
    .experience-item {
      text-align: left;
      width: 100%;
    }
    
    /* Additional mobile styling */
    @media (max-width: 768px) {
      .modal-body {
        max-height: calc(90vh - 130px);
      }
    }

    /* ===== CRITICAL MODAL FIXES ===== */

/* Force center alignment in all modals */
#portfolioModal .modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  min-height: 100vh;
  padding: 0;
}

/* Override any conflicting max-height settings */
#portfolioModal .modal-content {
  width: 100%;
  max-height: none !important;
}

/* Fix portfolio modal alignment issues */
#portfolioModal .portfolio-modal-content {
  text-align: center !important;
  margin: 0 auto !important;
  padding: 0 !important;
}

/* Force center talents in portfolio modal */
#portfolioModal .talent-profile-header {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 auto 1rem auto !important;
}

#portfolioModal .talent-profile-avatar {
  margin: 0 auto 1rem auto !important;
}

#portfolioModal .talent-profile-details {
  text-align: center !important;
  padding: 0 1rem !important;
}

/* Ensure modal body scrolls properly */
#portfolioModal .modal-body {
  overflow-y: auto;
  max-height: 75vh;
  padding: 1rem !important;
}

/* Fix skills centering */
#view-portfolio-skills {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 0.5rem !important;
  width: 100% !important;
}

/* Fix sections not centering */
.portfolio-section {
  margin: 0 auto 1.5rem auto !important;
  width: 100% !important;
}

/* Make sure no container overflows */
#portfolioModal .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
}

/* Adding styling for talent cards */
.talent-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  height: 100%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.talent-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Portfolio card styling */
.portfolio-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.portfolio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.portfolio-card .card-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.portfolio-card .card-text {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.portfolio-card .btn {
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 0.6rem 1rem;
}

.portfolio-card .btn:hover {
  transform: translateY(-2px);
}

#back-to-selection-btn {
  transition: all 0.2s ease;
  color: #495057;
}

#back-to-selection-btn:hover {
  background-color: #e9ecef;
  transform: translateX(-3px);
  color: #212529;
  font-weight: 500;
}

#portfolio-title {
  color: #2c3e50;
  font-weight: 700;
}

#portfolio-description {
  max-width: 700px;
  margin: 0 auto;
}

.portfolio-section .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.portfolio-section .card-header h5 {
  color: #2c3e50;
  font-weight: 600;
}

.talent-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.talent-avatar {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.talent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.talent-info {
  flex: 1;
}

.talent-name {
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.talent-title {
  color: #666;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.talent-portfolio {
  flex: 1;
  margin-bottom: 1.5rem;
}

.portfolio-heading {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #777;
  margin-bottom: 0.75rem;
}

.portfolio-summary {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #444;
}

.portfolio-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-tag {
  background-color: #f0f7ff;
  color: #0d6efd;
  padding: 0.3rem 0.7rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.talent-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

/* Enhanced styling for View Portfolio button */
.view-portfolio-btn {
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid #0d6efd;
  background-color: white;
  color: #0d6efd;
}

.view-portfolio-btn:hover {
  background-color: #0d6efd;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);
}

.view-portfolio-btn i {
  transition: transform 0.3s ease;
}

.view-portfolio-btn:hover i {
  transform: translateX(3px);
}

.tag {
  background-color: #f0f7ff;
  color: #0d6efd;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  margin: 0.35rem 0.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.1);
  border: 1px solid rgba(13, 110, 253, 0.15);
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.15);
  background-color: #e1efff;
}

.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1050;
}

.toast {
  min-width: 300px;
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
          <?php if (!empty($userData['profile_photo']) && $userData['profile_photo'] != 'default-profile-photo.jpg'): ?>
            <img src="<?php echo htmlspecialchars($userData['profile_photo']); ?>" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
          <?php else: ?>
            <i class="fas fa-user"></i>
          <?php endif; ?>
        </div>
        <div class="user-info">
          <a href="clientProfile.php" class="user-name-link">
             <div class="info-value non-editable"><?php echo htmlspecialchars($userData['full_name']); ?></div>
            <div class="user-role" id="sidebar-role"><?php echo !empty($userData['job_title']) ? htmlspecialchars($userData['job_title']) : 'Client'; ?></div>
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
            <a href="clientTalents.php" class="nav-link active">
              <i class="fas fa-users"></i> Find Talents
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
    
    <main class="main-content">
      <div class="page-content">
        <!-- Page Header -->
        <header class="page-header">
          <div>
            <h2 class="page-title">Find Talents</h2>
            <p class="page-subtitle">Discover talented professionals through their portfolios</p>
          </div>
          <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="current-date"></span>
          </div>
        </header>
        
        <!-- Search & Filter Section -->
        <div class="search-filter-container">
          <div class="card">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12">
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" class="form-control" placeholder="Search for talents by name, expertise or skills..." id="talent-search">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Talents Grid - Actual talent data is embedded in the HTML for server rendering -->
        <div class="talents-container mt-4">
          <div class="row g-4" id="talents-grid">
            <?php if (empty($freelancers)): ?>
              <!-- No freelancers found -->
              <div class="col-12 text-center py-5">
                <i class="fas fa-user-slash fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No freelancers found</h5>
                <p>There are currently no freelancers in the system. Check back later!</p>
              </div>
            <?php else: ?>
              <?php foreach ($freelancers as $freelancer): ?>
                <!-- Talent Card -->
                <div class="col-md-6 col-lg-4 talent-card-col" 
                  data-talent-id="<?php echo htmlspecialchars($freelancer['id']); ?>" 
                  data-talent-name="<?php echo htmlspecialchars($freelancer['full_name']); ?>" 
                  data-talent-title="<?php echo htmlspecialchars($freelancer['job_title']); ?>" 
                  data-talent-avatar="<?php echo htmlspecialchars($freelancer['profile_photo']); ?>"
                  data-talent-bio="<?php echo htmlspecialchars($freelancer['professional_summary']); ?>"
                  data-talent-skills="<?php echo htmlspecialchars(implode(',', $freelancer['all_skills'])); ?>"
                  data-talent-summary="<?php echo htmlspecialchars($freelancer['professional_summary']); ?>"
                >
                  <div class="talent-card">
                    <div class="talent-header">
                      <div class="talent-avatar">
                        <img src="<?php echo htmlspecialchars($freelancer['profile_photo']); ?>" alt="<?php echo htmlspecialchars($freelancer['full_name']); ?>">
                      </div>
                      <div class="talent-info">
                        <h5 class="talent-name"><?php echo htmlspecialchars($freelancer['full_name']); ?></h5>
                        <p class="talent-title"><?php echo htmlspecialchars($freelancer['job_title']); ?></p>
                      </div>
                    </div>
                    <div class="talent-portfolio">
                      <h6 class="portfolio-heading">Professional Summary</h6>
                      <p class="portfolio-summary"><?php echo htmlspecialchars($freelancer['professional_summary']); ?></p>
                      <div class="portfolio-skills">
                        <?php foreach ($freelancer['skills_array'] as $skill): ?>
                          <span class="skill-tag"><?php echo htmlspecialchars($skill); ?></span>
                        <?php endforeach; ?>
                        <?php if (count($freelancer['all_skills']) > 3): ?>
                          <span class="skill-tag">+<?php echo count($freelancer['all_skills']) - 3; ?> more</span>
                        <?php endif; ?>
                      </div>
                    </div>
                    <div class="talent-actions">
                      <button class="btn btn-outline-primary view-portfolio-btn w-100">
                        <i class="fas fa-eye me-2"></i>View Portfolios
                      </button>
                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            <?php endif; ?>
            
            <!-- No results template (hidden by default) -->
            <div id="no-results-template" style="display: none;">
              <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No results found</h4>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Portfolio Modal -->
        <div class="modal fade" id="portfolioModal" tabindex="-1" aria-labelledby="portfolioModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="portfolioModalLabel">Portfolio Selection</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- Two views: portfolio selection and portfolio detail -->
                
                <!-- Portfolio Selection View (shown first) -->
                <div id="portfolio-selection-view">
                  <!-- Talent header -->
                  <div class="talent-profile-header mb-5">
                    <div class="talent-profile-avatar">
                      <img src="" 
                        alt="Talent" 
                        id="select-talent-avatar">

                    </div>
                    <div class="talent-profile-details text-center">
                      <h4 id="select-talent-name" class="mt-3 mb-2">Talent Name</h4>
                      <p class="talent-title mb-3" id="select-talent-title">Profession</p>
                      <p class="talent-bio mb-0" id="select-talent-bio" style="max-width: 700px; margin: 0 auto; line-height: 1.6;">
                        Passionate professional with extensive experience delivering high-quality solutions for clients worldwide.
                      </p>
                    </div>
                  </div>
                  
                  <div class="row mb-4">
                    <div class="col-12">
                      <h5 class="text-center mb-4"><i class="fas fa-folder-open me-2"></i>Available Portfolios</h5>
                    </div>
                  </div>
                  
                  <!-- Portfolio cards container -->
                  <div class="row g-4" id="portfolio-selection-container">
                    <!-- Portfolio cards will be dynamically inserted here -->
                  </div>
                </div>
                
                <!-- Portfolio Detail View (hidden initially) -->
                <div id="portfolio-detail-view" style="display: none;">
                  <!-- Back to selection button -->
                  <div class="mb-4">
                    <button class="btn btn-outline-secondary btn-sm px-3 py-2" id="back-to-selection-btn">
                      <i class="fas fa-arrow-left me-2"></i>Back to All Portfolios
                    </button>
                  </div>
                
                  <!-- Properly centered portfolio content -->
                  <div class="portfolio-modal-content">
                    <!-- Portfolio Title -->
                    <div class="mb-5 text-center">
                      <h3 id="portfolio-title" class="mb-3">Portfolio Title</h3>
                      <p id="portfolio-description" class="text-muted" style="max-width: 700px; margin: 0 auto; line-height: 1.6;">Portfolio description goes here.</p>
                    </div>
                    
                    <!-- Skills Section -->
                    <div class="portfolio-section card mb-5 w-100">
                      <div class="card-body p-4">
                        <h5 class="mb-3">Skills</h5>
                        <div id="view-portfolio-skills" class="py-2">
                          <!-- Skills tags will be dynamically inserted here -->
                        </div>
                      </div>
                    </div>
                    
                    <!-- Work Experience Section -->
                    <div class="portfolio-section card mb-5 w-100">
                      <div class="card-header bg-light py-3">
                        <h5 class="mb-0"><i class="fas fa-briefcase me-2"></i>Work Experience</h5>
                      </div>
                      <div class="card-body p-4">
                        <div id="view-portfolio-experiences">
                          <!-- Work experience items will be dynamically inserted here -->
                        </div>
                      </div>
                    </div>
                    
                    <!-- Work Samples Section -->
                    <div class="portfolio-section card w-100">
                      <div class="card-header bg-light py-3">
                        <h5 class="mb-0"><i class="fas fa-cubes me-2"></i>Work Samples</h5>
                      </div>
                      <div class="card-body p-4">
                        <div id="view-portfolio-samples" class="row g-4">
                          <!-- Work samples will be dynamically inserted here -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Toast container for notifications -->
        <div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 5;">
          <!-- Toasts will be inserted here -->
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
  <!-- jQuery -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  
  <!-- Direct Simple Portfolio Modal Script to make sure buttons work -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Format and display current date
      const currentDate = new Date();
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      const currentDateElement = document.getElementById('current-date');
      if (currentDateElement) {
        currentDateElement.textContent = currentDate.toLocaleDateString('en-US', options);
      }
      
      // DIRECT IMPLEMENTATION OF PORTFOLIO FUNCTIONALITY
      
      // All View Portfolio buttons
      const allViewButtons = document.querySelectorAll('.view-portfolio-btn');
      allViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          const talentCard = this.closest('.talent-card-col');
          if (!talentCard) return;
          
          const talentId = talentCard.dataset.talentId;
          const talentName = talentCard.dataset.talentName;
          const talentTitle = talentCard.dataset.talentTitle;
          const talentBio = talentCard.dataset.talentBio;
          const talentAvatar = talentCard.dataset.talentAvatar;
          
          // Set modal data
          const portfolioModal = document.getElementById('portfolioModal');
          portfolioModal.setAttribute('data-talent-id', talentId);
          
          // Update talent info in selection view
          document.getElementById('select-talent-name').textContent = talentName;
          document.getElementById('select-talent-title').textContent = talentTitle;
          document.getElementById('select-talent-bio').textContent = talentBio;
          // Prepend "../" if it's missing
          const fixedAvatar = talentAvatar.startsWith("uploads/") ? "../" + talentAvatar : talentAvatar;
          document.getElementById('select-talent-avatar').src = fixedAvatar;

          
          // Show selection view, hide detail view
          document.getElementById('portfolio-selection-view').style.display = 'block';
          document.getElementById('portfolio-detail-view').style.display = 'none';
          document.getElementById('portfolioModalLabel').textContent = 'Portfolio Selection';
          
          // Load portfolios via AJAX
          const portfolioContainer = document.getElementById('portfolio-selection-container');
          portfolioContainer.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-3">Loading portfolios...</p></div>';
          
          // Show the modal immediately
          const bsModal = new bootstrap.Modal(portfolioModal);
          bsModal.show();
          
          // Fetch portfolios
          fetch('clientTalents.php?action=get_portfolios&user_id=' + talentId)
            .then(response => response.json())
            .then(data => {
              console.log('Portfolio data received:', data);
              const portfolios = data.portfolios || [];
              portfolioContainer.innerHTML = '';
              
              if (portfolios.length === 0) {
                portfolioContainer.innerHTML = `
                  <div class="col-12 text-center py-5">
                    <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No portfolios available</h5>
                    <p>This freelancer hasn't created any portfolios yet.</p>
                  </div>
                `;
                return;
              }
              
              // Create cards for each portfolio
              portfolios.forEach(portfolio => {
                // Make sure skills_array exists
                if (!portfolio.skills_array && portfolio.skills) {
                  portfolio.skills_array = portfolio.skills.split(',').map(skill => skill.trim());
                }
                
                if (!Array.isArray(portfolio.skills_array)) {
                  portfolio.skills_array = [];
                }
                
                const portfolioCard = document.createElement('div');
                portfolioCard.className = 'col-md-6 col-lg-4 mb-4';
                portfolioCard.innerHTML = `
                  <div class="card h-100 portfolio-card">
                    <div class="card-body p-4">
                      <h5 class="card-title mb-3">${portfolio.title || 'Untitled Portfolio'}</h5>
                      <p class="card-text text-muted mb-4">${portfolio.description || 'No description available.'}</p>
                      <div class="portfolio-skills mb-4">
                        ${portfolio.skills_array.slice(0, 3).map(skill => `<span class="tag">${skill}</span>`).join('')}
                        ${portfolio.skills_array.length > 3 ? `<span class="tag">+${portfolio.skills_array.length - 3} more</span>` : ''}
                      </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-4 px-4">
                      <button class="btn btn-primary w-100 portfolio-detail-btn" data-portfolio-id="${portfolio.id}">
                        <i class="fas fa-eye me-2"></i>View Details
                      </button>
                    </div>
                  </div>
                `;
                portfolioContainer.appendChild(portfolioCard);
                
                // Add click event for detail button
                const detailBtn = portfolioCard.querySelector('.portfolio-detail-btn');
                detailBtn.addEventListener('click', function() {
                  // Update modal title
                  document.getElementById('portfolioModalLabel').textContent = 'Portfolio Details';
                  
                  // Hide selection view, show detail view
                  document.getElementById('portfolio-selection-view').style.display = 'none';
                  document.getElementById('portfolio-detail-view').style.display = 'block';
                  
                  // Update portfolio details
                  document.getElementById('portfolio-title').textContent = portfolio.title || 'Untitled Portfolio';
                  document.getElementById('portfolio-description').textContent = portfolio.description || 'No description available.';
                  
                  // Update skills
                  const skillsContainer = document.getElementById('view-portfolio-skills');
                  if (skillsContainer) {
                    if (portfolio.skills_array && portfolio.skills_array.length > 0) {
                      skillsContainer.innerHTML = portfolio.skills_array.map(skill => 
                        `<span class="tag">${skill}</span>`
                      ).join('');
                    } else {
                      skillsContainer.innerHTML = '<p class="text-muted">No skills listed</p>';
                    }
                  }
                  
                  // Ensure experience array exists
                  if (!portfolio.experience) portfolio.experience = [];
                  
                  // Update experience
                  const experiencesContainer = document.getElementById('view-portfolio-experiences');
                  if (experiencesContainer) {
                    if (portfolio.experience.length > 0) {
                      experiencesContainer.innerHTML = portfolio.experience.map(exp => `
                        <div class="experience-item mb-4">
                          <div class="d-flex justify-content-between">
                            <h6 class="experience-title">${exp.title || 'Position'}</h6>
                            <span class="experience-date">${exp.date || 'No date'}</span>
                          </div>
                          <div class="experience-company mb-2">${exp.company || 'Company'}</div>
                          <p class="experience-description">${exp.description || 'No description'}</p>
                        </div>
                      `).join('');
                    } else {
                      experiencesContainer.innerHTML = '<div class="text-center py-4"><p class="text-muted">No work experience listed</p></div>';
                    }
                  }
                  
                  // Ensure samples array exists
                  if (!portfolio.samples) portfolio.samples = [];
                  
                  // Update work samples
                  const samplesContainer = document.getElementById('view-portfolio-samples');
                  if (samplesContainer) {
                    if (portfolio.samples.length > 0) {
                      samplesContainer.innerHTML = portfolio.samples.map(sample => `
                        <div class="col-md-6 mb-4">
                          <div class="portfolio-project">
                            <div class="project-info mb-3">
                              <h6 class="project-title">${sample.title || 'Project'}</h6>
                              <p class="project-description">${sample.description || 'No description'}</p>
                              <a href="${sample.link || '#'}" class="btn btn-sm btn-outline-primary mt-2" target="_blank">View Project</a>
                            </div>
                          </div>
                        </div>
                      `).join('');
                    } else {
                      samplesContainer.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No work samples listed</p></div>';
                    }
                  }
                });
              });
            })
            .catch(error => {
              console.error('Error loading portfolios:', error);
              portfolioContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                  <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                  <h5 class="text-muted">Error Loading Portfolios</h5>
                  <p>There was a problem loading the portfolios.</p>
                </div>
              `;
            });
        });
      });
      
      // Back button in portfolio detail view
      const backBtn = document.getElementById('back-to-selection-btn');
      if (backBtn) {
        backBtn.addEventListener('click', function() {
          document.getElementById('portfolio-selection-view').style.display = 'block';
          document.getElementById('portfolio-detail-view').style.display = 'none';
          document.getElementById('portfolioModalLabel').textContent = 'Portfolio Selection';
        });
      }
      
      // Setup search functionality
      const searchInput = document.getElementById('talent-search');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const query = this.value.toLowerCase().trim();
          
          const talentCards = document.querySelectorAll('.talent-card-col');
          let visibleCount = 0;
          
          talentCards.forEach(card => {
            const talentName = card.dataset.talentName.toLowerCase();
            const talentTitle = card.dataset.talentTitle.toLowerCase();
            const talentSummary = card.dataset.talentSummary.toLowerCase();
            const talentSkills = card.dataset.talentSkills.toLowerCase();
            
            const isMatch = !query || 
              talentName.includes(query) || 
              talentTitle.includes(query) || 
              talentSummary.includes(query) || 
              talentSkills.includes(query);
            
            card.style.display = isMatch ? 'block' : 'none';
            if (isMatch) visibleCount++;
          });
          
          const noResultsTemplate = document.getElementById('no-results-template');
          if (noResultsTemplate) {
            noResultsTemplate.style.display = visibleCount === 0 ? 'block' : 'none';
          }
        });
      }
    });
  </script>
  
  </body>
  </html>
    