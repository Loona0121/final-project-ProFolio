<?php
session_start();
include_once("../connection/connection.php");
include_once("FUNCTIONS/getUserData.php"); 
$con = connection();

// Check if user is logged in
if (!isset($_SESSION['id'])) {
  echo json_encode(["status" => "error", "message" => "User not logged in"]);
  exit;
}

$userId = $_SESSION['id'];
$userData = getUserData($userId);

// Helper function to safely escape and validate input
function sanitizeInput($con, $input) {
    return mysqli_real_escape_string($con, $input ?? '');
}

// Helper function to handle portfolio skills
function handlePortfolioSkills($con, $portfolioId, $skills) {
    // Delete existing skills
    mysqli_query($con, "DELETE FROM portfolio_skills WHERE portfolio_id=$portfolioId");
    
    // Insert new skills
    foreach ($skills as $skillName) {
        $skillName = sanitizeInput($con, $skillName);
        
        $skillQuery = "SELECT skill_id FROM skills WHERE skill_name = '$skillName'";
        $skillResult = mysqli_query($con, $skillQuery);

        if (mysqli_num_rows($skillResult) > 0) {
            $skillRow = mysqli_fetch_assoc($skillResult);
            $skillId = $skillRow['skill_id'];
        } else {
            $insertSkill = "INSERT INTO skills (skill_name) VALUES ('$skillName')";
            mysqli_query($con, $insertSkill);
            $skillId = mysqli_insert_id($con);
        }

        $linkSkill = "INSERT INTO portfolio_skills (portfolio_id, skill_id) VALUES ('$portfolioId', '$skillId')";
        mysqli_query($con, $linkSkill);
    }
}

// Helper function to handle work experiences
function handleWorkExperiences($con, $portfolioId, $workExperiences) {
    // Delete existing work experience
    mysqli_query($con, "DELETE FROM work_experience WHERE portfolio_id=$portfolioId");
    
    // Insert new work experiences
    foreach ($workExperiences as $experience) {
        $title = sanitizeInput($con, $experience['title'] ?? '');
        $company = sanitizeInput($con, $experience['company'] ?? '');
        $startDate = sanitizeInput($con, $experience['start_date'] ?? '');
        $endDate = sanitizeInput($con, $experience['end_date'] ?? '');
        
        if (!empty($startDate)) {
            $startDate .= '-01';  // Append '-01' to make it YYYY-MM-DD
        }
        if (!empty($endDate)) {
            $endDate .= '-01';
        }
        $description = sanitizeInput($con, $experience['description'] ?? '');

        if (!empty($title) && !empty($company)) {
            $insertExperience = "INSERT INTO work_experience (portfolio_id, title, company, start_date, end_date, description)
                                 VALUES ('$portfolioId', '$title', '$company', '$startDate', '$endDate', '$description')";
            mysqli_query($con, $insertExperience);
        }
    }
}

// Helper function to handle work samples
function handleWorkSamples($con, $portfolioId, $workSamples) {
    // Delete existing work samples
    mysqli_query($con, "DELETE FROM work_samples WHERE portfolio_id=$portfolioId");
    
    // Insert new work samples
    foreach ($workSamples as $sample) {
        $sampleTitle = sanitizeInput($con, $sample['title'] ?? '');
        $sampleDescription = sanitizeInput($con, $sample['description'] ?? '');
        $sampleUrl = sanitizeInput($con, $sample['url'] ?? '');

        if (!empty($sampleTitle)) {
            $insertSample = "INSERT INTO work_samples (portfolio_id, title, description, url)
                             VALUES ('$portfolioId', '$sampleTitle', '$sampleDescription', '$sampleUrl')";
            mysqli_query($con, $insertSample);
        }
    }
}

// Helper function to verify portfolio ownership
function verifyPortfolioOwnership($con, $portfolioId, $userId) {
    $checkOwnership = "SELECT portfolio_id FROM portfolio WHERE portfolio_id = $portfolioId AND user_id = $userId";
    $result = mysqli_query($con, $checkOwnership);
    
    return mysqli_num_rows($result) > 0;
}

// Helper function to process common form data
function getPortfolioFormData($con) {
    return [
        'name' => sanitizeInput($con, $_POST['name'] ?? ''),
        'category' => sanitizeInput($con, $_POST['category'] ?? ''),
        'description' => sanitizeInput($con, $_POST['portfolio_description'] ?? ''),
        'skills' => $_POST['skills'] ?? [],
        'workExperiences' => $_POST['work_experience'] ?? [],
        'workSamples' => $_POST['work_samples'] ?? []
    ];
}

// Handle delete request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $portfolioId = isset($_POST['portfolio_id']) ? intval($_POST['portfolio_id']) : 0;
    
    if (!verifyPortfolioOwnership($con, $portfolioId, $userId)) {
        echo json_encode(["status" => "error", "message" => "Portfolio not found or not owned by current user"]);
        exit;
    }
    
    // Start a transaction to ensure all related data is deleted
    mysqli_begin_transaction($con);
    
    try {
        // Delete related data
        mysqli_query($con, "DELETE FROM work_samples WHERE portfolio_id = $portfolioId");
        mysqli_query($con, "DELETE FROM work_experience WHERE portfolio_id = $portfolioId");
        mysqli_query($con, "DELETE FROM portfolio_skills WHERE portfolio_id = $portfolioId");
        mysqli_query($con, "DELETE FROM portfolio WHERE portfolio_id = $portfolioId");
        
        // Commit the transaction
        mysqli_commit($con);
        
        echo json_encode(["status" => "success", "message" => "Portfolio deleted successfully"]);
        exit;
    } catch (Exception $e) {
        // Rollback the transaction if any query fails
        mysqli_rollback($con);
        echo json_encode(["status" => "error", "message" => "Failed to delete portfolio: " . $e->getMessage()]);
        exit;
    }
}

// Handle update request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update') {
    $portfolioId = isset($_POST['portfolio_id']) ? intval($_POST['portfolio_id']) : 0;
    
    if (!verifyPortfolioOwnership($con, $portfolioId, $userId)) {
        echo json_encode(["status" => "error", "message" => "Portfolio not found or not owned by current user"]);
        exit;
    }
    
    $formData = getPortfolioFormData($con);
    
    // Start a transaction
    mysqli_begin_transaction($con);
    
    try {
        // Update portfolio table
        $updatePortfolio = "UPDATE portfolio 
                           SET name='{$formData['name']}', category='{$formData['category']}', description='{$formData['description']}' 
                           WHERE portfolio_id=$portfolioId";
        mysqli_query($con, $updatePortfolio);
        
        // Handle related data
        handlePortfolioSkills($con, $portfolioId, $formData['skills']);
        handleWorkExperiences($con, $portfolioId, $formData['workExperiences']);
        handleWorkSamples($con, $portfolioId, $formData['workSamples']);
        
        // Commit the transaction
        mysqli_commit($con);
        
        echo json_encode(["status" => "success", "message" => "Portfolio updated successfully"]);
        exit;
    } catch (Exception $e) {
        // Rollback the transaction if any query fails
        mysqli_rollback($con);
        echo json_encode(["status" => "error", "message" => "Failed to update portfolio: " . $e->getMessage()]);
        exit;
    }
}

// Handle create request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['action'])) {
    if (!$userData) {
        echo json_encode(["status" => "error", "message" => "User data not found"]);
        exit;
    }

    $formData = getPortfolioFormData($con);
    
    if (empty($formData['name']) || empty($formData['category'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    // Begin transaction for create process
    mysqli_begin_transaction($con);
    
    try {
        // Insert into 'portfolio' table
        $insertPortfolio = "INSERT INTO portfolio (user_id, name, category, description, created_at)
                            VALUES ('$userId', '{$formData['name']}', '{$formData['category']}', '{$formData['description']}', NOW())";
                            
        mysqli_query($con, $insertPortfolio);
        $portfolioId = mysqli_insert_id($con);

        // Handle related data
        handlePortfolioSkills($con, $portfolioId, $formData['skills']);
        handleWorkExperiences($con, $portfolioId, $formData['workExperiences']);
        handleWorkSamples($con, $portfolioId, $formData['workSamples']);
        
        // Commit the transaction
        mysqli_commit($con);

        echo json_encode(["status" => "success", "message" => "Portfolio created successfully"]);
        exit;
    } catch (Exception $e) {
        // Rollback the transaction if any query fails
        mysqli_rollback($con);
        echo json_encode(["status" => "error", "message" => "Error creating portfolio: " . $e->getMessage()]);
        exit;
    }
}

// Get the user data for display (for non-POST requests)
// This is reused from the beginning of the script
// $userId and $userData are already set
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Freelancer Portfolio</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Custom Dashboard CSS -->
  <link href="proFolio.css" rel="stylesheet">
  <style>
    /* Hide the "I currently work here" checkbox and label */
    .work-current, 
    .form-check-label[for^="currentWork"] {
      display: none !important;
    }
    
    /* Apply margin to make up for the hidden elements */
    .work-end-date {
      margin-bottom: 10px;
    }
    
    /* Make date inputs more clickable */
    input[type="month"] {
      cursor: pointer;
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
            <img src="../uploads/<?php echo basename($userData['profile_photo']); ?>" alt="Profile Photo" class="profile-img">
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
            <a href="freelancerPortfolio.php" class="nav-link active">
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
            <h2 class="page-title">My Portfolio</h2>
            <p class="page-subtitle">Showcase your work and attract more clients</p>
          </div>
          <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="current-date"></span>
          </div>
        </header>
        
        <!-- Success Notification -->
        <div id="success-notification" class="alert alert-success alert-dismissible fade" role="alert" style="display: none;">
          <i class="fas fa-check-circle me-2"></i> Portfolio successfully created!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteConfirmModalLabel">Delete Portfolio</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this portfolio? This action cannot be undone.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete Portfolio</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Portfolio View Section -->
        <div id="portfolio-view" class="portfolio-view-section">
          <!-- Portfolio Items List -->
          <div class="portfolio-grid">
            <!-- Portfolio Item 1 -->
            <?php
$sql = "SELECT 
            p.portfolio_id, 
            p.name, 
            p.category,
            p.description, 
            GROUP_CONCAT(DISTINCT s.skill_name) as skills
        FROM 
            portfolio p
        LEFT JOIN 
            portfolio_skills ps ON p.portfolio_id = ps.portfolio_id
        LEFT JOIN 
            skills s ON s.skill_id = ps.skill_id
        WHERE 
            p.user_id = {$_SESSION['id']}
        GROUP BY 
            p.portfolio_id";

$result = $con->query($sql);

$portfolios = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $id = $row['portfolio_id'];
        
        // Initialize portfolio entry
        $portfolios[$id] = [
            'name' => $row['name'],
            'category' => $row['category'],
            'description' => $row['description'],
            'skills' => $row['skills'] ? explode(',', $row['skills']) : [],
            'work_experience' => [],
            'work_samples' => []
        ];
    }
    
    // Now get work experiences for each portfolio
    foreach (array_keys($portfolios) as $portfolio_id) {
        // Query work experiences
$expSql = "SELECT 
            title, 
            company, 
            DATE_FORMAT(start_date, '%Y-%m') as startDate, 
            DATE_FORMAT(end_date, '%Y-%m') as endDate, 
            description 
        FROM 
            work_experience 
        WHERE 
            portfolio_id = $portfolio_id";
        
        $expResult = $con->query($expSql);
        
        if ($expResult && $expResult->num_rows > 0) {
            while ($expRow = $expResult->fetch_assoc()) {
                $portfolios[$portfolio_id]['work_experience'][] = $expRow;
            }
        }
        
        // Query work samples
        $sampleSql = "SELECT 
                        title, 
                        description, 
                        url 
                    FROM 
                        work_samples 
                    WHERE 
                        portfolio_id = $portfolio_id";
        
        $sampleResult = $con->query($sampleSql);
        
        if ($sampleResult && $sampleResult->num_rows > 0) {
            while ($sampleRow = $sampleResult->fetch_assoc()) {
                $portfolios[$portfolio_id]['work_samples'][] = $sampleRow;
            }
        }
    }

    // Now render the HTML once per portfolio
    foreach ($portfolios as $id => $portfolio) {
        // Convert the work_experience and work_samples arrays to JSON for data attributes
        $workExperiencesJson = htmlspecialchars(json_encode($portfolio['work_experience']), ENT_QUOTES, 'UTF-8');
        $workSamplesJson = htmlspecialchars(json_encode($portfolio['work_samples']), ENT_QUOTES, 'UTF-8');
        ?>
        <div class="portfolio-card" 
             data-portfolio-id="<?php echo htmlspecialchars($id); ?>"
             data-portfolio-name="<?php echo htmlspecialchars($portfolio['name']); ?>"
             data-portfolio-category="<?php echo htmlspecialchars($portfolio['category']); ?>"
             data-portfolio-description="<?php echo htmlspecialchars($portfolio['description']); ?>"
             data-portfolio-skills="<?php echo htmlspecialchars(json_encode($portfolio['skills'])); ?>"
             data-work-experiences='<?php echo $workExperiencesJson; ?>'
             data-work-samples='<?php echo $workSamplesJson; ?>'>
            <div class="portfolio-card-content">
                <h3 class="portfolio-card-title"><?php echo htmlspecialchars($portfolio['name']); ?></h3>
                <div class="portfolio-card-tags">
                    <?php foreach ($portfolio['skills'] as $skill): ?>
                        <span class="tag"><?php echo htmlspecialchars($skill); ?></span>
                    <?php endforeach; ?>
                </div>
                <p class="portfolio-card-desc"><?php echo htmlspecialchars($portfolio['description']); ?></p>
                <div class="portfolio-card-footer">
                    <div class="portfolio-actions mt-3">
                        <button class="btn btn-primary view-portfolio-btn me-2">
                            <i class="far fa-eye me-1"></i> View
                        </button>
                        <button class="btn btn-secondary edit-portfolio-btn me-2">
                            <i class="far fa-edit me-1"></i> Edit
                        </button>
                        <button class="btn btn-danger delete-portfolio-btn" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                            <i class="far fa-trash-alt me-1"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
} 
?>

            <!-- Create New Portfolio Card -->
            <div class="portfolio-card" style="border: 2px dashed #dee2e6; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; cursor: pointer;" id="create-portfolio-btn">
              <div class="text-center p-5">
                <div class="mb-3">
                  <i class="fas fa-plus-circle fa-3x text-primary"></i>
                </div>
                <h4 class="text-primary">Create New Portfolio</h4>
                <p class="text-muted">Add a new showcase for your work</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Create/Edit Portfolio Multi-Section Form -->
        <div id="portfolio-form-container" class="portfolio-form-section" style="display: none;">
          <div class="section-header d-flex justify-content-between align-items-center mb-4">
            <h3 class="section-title mb-0">
              <i class="fas fa-plus-circle" id="form-header-icon"></i> <span id="form-header-text">Create New Portfolio</span>
            </h3>
            <button id="back-to-portfolios" class="btn btn-outline-secondary btn-sm">
              <i class="fas fa-arrow-left"></i> Back to Portfolios
            </button>
          </div>
          
          <!-- Progress Indicator -->
          <div class="form-progress mb-4">
            <div class="progress" style="height: 8px;">
              <div id="form-progress-bar" class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="form-steps d-flex justify-content-between mt-2">
              <div class="step active" data-step="1">
                <span class="step-number">1</span>
                <span class="step-label">Basic Info</span>
              </div>
              <div class="step" data-step="2">
                <span class="step-number">2</span>
                <span class="step-label">Skills</span>
              </div>
              <div class="step" data-step="3">
                <span class="step-number">3</span>
                <span class="step-label">Experience</span>
              </div>
              <div class="step" data-step="4">
                <span class="step-number">4</span>
                <span class="step-label">Work Samples</span>
              </div>
            </div>
          </div>
          
          <div class="form-container">
          <form action="freelancerPortfolio.php" method="POST" id="portfolio-form">
              <!-- Section 1: Basic Information -->
              <div class="form-section" id="section-1">
                <h4 class="form-section-title">Basic Information</h4>
                <div class="row">
  <div class="col-md-12">
    <div class="mb-3">
      <label for="portfolio-name" class="form-label">Portfolio Name <span class="text-danger">*</span></label>
      <input type="text" class="form-control required" id="portfolio-name" name="name" placeholder="e.g., Web Development Projects">
      <div class="invalid-feedback">Portfolio name is required</div>
    </div>
  </div>
  <!-- Hidden category field with default value -->
  <input type="hidden" id="portfolio-type" name="category" value="other">
</div>
                <div class="mb-3">
                  <label for="portfolio-description" class="form-label">Description <span class="text-danger">*</span></label>
                  <textarea class="form-control required" id="portfolio-description" name="portfolio_description" rows="3" placeholder="Describe your portfolio and what makes it special..."></textarea>
                  <div class="invalid-feedback">Portfolio description is required</div>
                </div>
                <div class="form-navigation mt-4 d-flex justify-content-between">
                  <div></div>
                  <button type="button" class="btn btn-primary next-section" data-next="2">Next <i class="fas fa-arrow-right ms-2"></i></button>
                </div>
              </div>
              
              <!-- Section 2: Skills -->
              <div class="form-section" id="section-2" style="display: none;">
                <h4 class="form-section-title">Skills</h4>
                <div class="mb-3">
                  <label for="portfolio-skill-input" class="form-label">Skills <span class="text-danger">*</span></label>
                  <div class="input-group mb-2">
                    <input type="text" class="form-control" id="portfolio-skill-input" placeholder="e.g., JavaScript">
                    <button class="btn btn-outline-primary" type="button" id="add-skill-btn">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <div class="form-text">Add skills relevant to this portfolio. Press the + button after typing each skill.</div>
                  <div class="invalid-feedback">At least one skill is required</div>
                  
                  <div id="skills-container" class="d-flex flex-wrap gap-2 mt-3">
                    <!-- Skills will be added here dynamically -->
                  </div>
                  <input type="hidden" id="portfolio-skills" class="required" name="skills">
                </div>
                
                <div class="form-navigation mt-4 d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary prev-section" data-prev="1"><i class="fas fa-arrow-left me-2"></i> Previous</button>
                  <button type="button" class="btn btn-primary next-section" data-next="3">Next <i class="fas fa-arrow-right ms-2"></i></button>
                </div>
              </div>
              
              <!-- Section 3: Work Experience -->
              <div class="form-section" id="section-3" style="display: none;">
                <h4 class="form-section-title">Work Experience</h4>
                <div class="required-notice mb-3"><span class="text-danger">*</span> At least one work experience is required</div>
                
                <div id="work-experience-container">
                  <div class="work-experience-item card mb-3 p-3">
                    <div class="d-flex justify-content-between mb-2">
                      <h5 class="card-title mb-0">Experience #1</h5>
                      <button type="button" class="btn btn-sm btn-outline-danger remove-experience" style="display: none;">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Work Title <span class="text-danger">*</span></label>
                          <input type="text"  class="form-control work-title required" name="work_titles[]" placeholder="Position or project title">
                          <div class="invalid-feedback">Work title is required</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Company/Client <span class="text-danger">*</span></label>
                          <input type="text" name="work_companies[]" class="form-control work-company required" placeholder="Company or client name">
                          <div class="invalid-feedback">Company/client is required</div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Start Date <span class="text-danger">*</span></label>
                          <input type="month" name="work_start_dates[]" class="form-control work-start-date required">
                          <div class="invalid-feedback">Start date is required</div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">End Date <span class="text-danger">*</span></label>
                          <input type="month" name="work_end_dates[]" class="form-control work-end-date required">
                          <div class="invalid-feedback">End date is required</div>
                          <div class="form-check mt-2">
                            <input class="form-check-input work-current" name="work_current[]" type="checkbox" id="currentWork">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Description <span class="text-danger">*</span></label>
                      <textarea  name="work_descriptions[]" class="form-control work-description required" rows="2" placeholder="Describe your responsibilities and achievements..."></textarea>
                      <div class="invalid-feedback">Work description is required</div>
                    </div>
                  </div>
                </div>
                
                <button type="button" class="btn btn-outline-primary btn-sm mb-3" id="add-work-exp">
                  <i class="fas fa-plus"></i> Add Another Experience
                </button>
                
                <div class="form-navigation mt-4 d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary prev-section" data-prev="2"><i class="fas fa-arrow-left me-2"></i> Previous</button>
                  <button type="button" class="btn btn-primary next-section" data-next="4">Next <i class="fas fa-arrow-right ms-2"></i></button>
                </div>
              </div>
              
              <!-- Section 4: Work Samples -->
              <div class="form-section" id="section-4" style="display: none;">
                <h4 class="form-section-title">Work Samples</h4>
                <div class="required-notice mb-3"><span class="text-danger">*</span> At least one work sample is required</div>
                
                <div id="work-samples-container">
                  <div class="work-sample-item card mb-3 p-3">
                    <div class="d-flex justify-content-between mb-2">
                      <h5 class="card-title mb-0">Sample #1</h5>
                      <button type="button" class="btn btn-sm btn-outline-danger remove-sample" style="display: none;">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="mb-3">
                          <label class="form-label">Project Title <span class="text-danger">*</span></label>
                          <input type="text" name="sample_titles[]" class="form-control sample-title required" placeholder="Project name">
                          <div class="invalid-feedback">Project title is required</div>
                        </div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Project Description <span class="text-danger">*</span></label>
                      <textarea name="sample_descriptions[]" class="form-control sample-description required" rows="2" placeholder="Describe your project..."></textarea>
                      <div class="invalid-feedback">Project description is required</div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="mb-3">
                          <label class="form-label">Project URL <span class="text-danger">*</span></label>
                          <input type="url" name="sample_urls[]" class="form-control sample-url required" placeholder="https://...">
                          <div class="invalid-feedback">Project URL is required</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button type="button" class="btn btn-outline-primary btn-sm mb-3" id="add-work-sample">
                  <i class="fas fa-plus"></i> Add Another Work Sample
                </button>
                
                <div class="form-navigation mt-4 d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary prev-section" data-prev="3"><i class="fas fa-arrow-left me-2"></i> Previous</button>
                  <button type="submit" class="btn btn-success" id="create-portfolio-submit">
                    <i class="fas fa-check me-1"></i> <span id="submit-button-text" name ="create">Create Portfolio</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Portfolio Detail View -->
        <div id="portfolio-detail-view" class="portfolio-detail-section" style="display: none;">
          <div class="section-header d-flex justify-content-between align-items-center mb-4">
            <h3 class="section-title mb-0">
              <i class="fas fa-folder-open"></i> <span id="view-portfolio-title">Portfolio Title</span>
            </h3>
            <div>
              <button id="edit-from-view" class="btn btn-secondary">
                <i class="far fa-edit me-1"></i> Edit
              </button>
              <button id="delete-from-view" class="btn btn-danger mx-2" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                <i class="far fa-trash-alt me-1"></i> Delete
              </button>
              <button id="back-from-view" class="btn btn-primary">
                <i class="fas fa-arrow-left me-1"></i> Back to Portfolios
              </button>
            </div>
          </div>
          
          <div class="portfolio-detail-content">
            <!-- Basic Information -->
            <div class="detail-section card mb-4">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="portfolio-meta mb-3">
                    </div>
                    <p id="view-portfolio-description" class="portfolio-card-desc mb-4">Portfolio description will appear here.</p>
                    
                    <h5 class="mb-3">Skills</h5>
                    <div id="view-portfolio-skills" class="d-flex flex-wrap gap-2">
                      <!-- Skills tags will be displayed here -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Work Experience -->
            <div class="detail-section card mb-4">
              <div class="card-header bg-light">
                <h5 class="mb-0"><i class="fas fa-briefcase me-2"></i>Work Experience</h5>
              </div>
              <div class="card-body">
                <div id="view-portfolio-experiences">
                  <!-- Work experience items will be displayed here -->
                </div>
              </div>
            </div>
            
            <!-- Work Samples -->
            <div class="detail-section card mb-4">
              <div class="card-header bg-light">
                <h5 class="mb-0"><i class="fas fa-cubes me-2"></i>Work Samples</h5>
              </div>
              <div class="card-body">
                <div id="view-portfolio-samples" class="row">
                  <!-- Work samples will be displayed here -->
                </div>
              </div>
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
      
      // Set up delete button functionality
      document.querySelectorAll('.delete-portfolio-btn, #delete-from-view').forEach(button => {
        button.addEventListener('click', function() {
          // Get the portfolio ID from the closest portfolio-card
          const portfolioCard = this.closest('.portfolio-card');
          const portfolioId = portfolioCard ? portfolioCard.dataset.portfolioId : 
                              document.getElementById('portfolio-detail-view').dataset.portfolioId;
          
          // Store the ID on the modal for use when confirming delete
          document.getElementById('deleteConfirmModal').dataset.portfolioId = portfolioId;
        });
      });
      
      // Add event listener for confirmation button

      
document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
  const portfolioId = document.getElementById('deleteConfirmModal').dataset.portfolioId;
  
  // Create form data to send
  const formData = new FormData();
  formData.append('action', 'delete');  // Add action parameter
  formData.append('portfolio_id', portfolioId);
  
  // Send request to the same file
  fetch('freelancerPortfolio.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // Hide the portfolio card if successful
      const portfolioElement = document.querySelector(`.portfolio-card[data-portfolio-id="${portfolioId}"]`);
      if (portfolioElement) {
        portfolioElement.style.display = 'none';
      }
      
      // Hide detail view if open
      document.getElementById('portfolio-detail-view').style.display = 'none';
      document.getElementById('portfolio-view').style.display = 'block';
      
      // Show success notification
      const successNotification = document.getElementById('success-notification');
      successNotification.textContent = 'Portfolio successfully deleted!';
      successNotification.style.display = 'block';
      successNotification.classList.add('show');
      
      // Auto-hide notification after 2 seconds
      setTimeout(() => {
        successNotification.classList.remove('show');
        setTimeout(() => {
          successNotification.style.display = 'none';
        }, 300);
      }, 2000);
    } else {
      // Show error notification
      alert('Error: ' + data.message);
    }
    
    // Hide the modal in either case
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    modal.hide();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while trying to delete the portfolio.');
    
    // Hide the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    modal.hide();
  });
});
    });

  document.getElementById('portfolio-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData();
  
  // Check if we're editing an existing portfolio
  const isEditing = document.getElementById('portfolio-form').dataset.editing === 'true';
  const portfolioId = document.getElementById('portfolio-form').dataset.portfolioId;
  
  // If editing, add action and portfolio_id
  if (isEditing && portfolioId) {
    formData.append('action', 'update');
    formData.append('portfolio_id', portfolioId);
  }

  // Basic info
  formData.append('name', document.getElementById('portfolio-name').value);
  formData.append('category', document.getElementById('portfolio-type').value);
  formData.append('portfolio_description', document.getElementById('portfolio-description').value);

  // Skills
  const skills = Array.from(document.querySelectorAll('#skills-container .tag')).map(tag => tag.childNodes[0].nodeValue.trim());
  skills.forEach(skill => formData.append('skills[]', skill));

  // Work Experience
  const workItems = document.querySelectorAll('#work-experience-container .work-experience-item');
  workItems.forEach((item, index) => {
    formData.append(`work_experience[${index}][title]`, item.querySelector('.work-title').value);
    formData.append(`work_experience[${index}][company]`, item.querySelector('.work-company').value);
    formData.append(`work_experience[${index}][start_date]`, item.querySelector('.work-start-date').value);
    
    const isCurrent = item.querySelector('.work-current').checked;
    formData.append(`work_experience[${index}][end_date]`, isCurrent ? '' : item.querySelector('.work-end-date').value);
    formData.append(`work_experience[${index}][description]`, item.querySelector('.work-description').value);
  });

  // Work Samples
  const sampleItems = document.querySelectorAll('#work-samples-container .work-sample-item');
  sampleItems.forEach((item, index) => {
    formData.append(`work_samples[${index}][title]`, item.querySelector('.sample-title').value);
    formData.append(`work_samples[${index}][description]`, item.querySelector('.sample-description').value);
    formData.append(`work_samples[${index}][url]`, item.querySelector('.sample-url').value);
  });

  fetch('freelancerPortfolio.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
        // Remove the old portfolio element from DOM if editing
  if (isEditing && portfolioId) {
    const oldPortfolio = document.querySelector(`[data-portfolio-id="${portfolioId}"]`);
    if (oldPortfolio) {
      oldPortfolio.remove();
    }
  }
      // Show success notification
      const successNotification = document.getElementById('success-notification');
      const message = isEditing ? 'Portfolio updated successfully!' : 'Portfolio created successfully!';
      successNotification.textContent = message;
      successNotification.style.display = 'block';
      successNotification.classList.add('show');
      
      // Store message in localStorage
      localStorage.setItem('portfolioNotification', message);
      
      // Immediately reload the page to prevent old version flicker
      window.location.reload();
      
    } else {
      alert('Error: ' + data.message);
    }
  })
  .catch(err => {
    console.error('Submission error:', err);
    alert('Failed to submit form.');
  });
});

document.addEventListener('DOMContentLoaded', function () {

  function updateSkillStepValidation() {
    const skills = document.querySelectorAll('#skills-container .tag');
    const nextBtn = document.querySelector('.next-section[data-next="3"]');

    if (nextBtn) {
      nextBtn.disabled = skills.length === 0;
    }
  }

  // For the edit button in the portfolio card
  document.querySelectorAll('.edit-portfolio-btn').forEach(button => {
    button.addEventListener('click', function () {
      const portfolioCard = this.closest('.portfolio-card');
      const portfolioId = portfolioCard.dataset.portfolioId;
      const portfolioName = portfolioCard.dataset.portfolioName;
      const portfolioCategory = portfolioCard.dataset.portfolioCategory;
      const portfolioDescription = portfolioCard.dataset.portfolioDescription;
      const portfolioSkills = JSON.parse(portfolioCard.dataset.portfolioSkills);
      const workExperiences = JSON.parse(portfolioCard.dataset.workExperiences);
      const workSamples = JSON.parse(portfolioCard.dataset.workSamples);

      // Set form to editing mode
      const portfolioForm = document.getElementById('portfolio-form');
      portfolioForm.dataset.editing = 'true';
      portfolioForm.dataset.portfolioId = portfolioId;

      // Change form header
      document.getElementById('form-header-text').textContent = 'Edit Portfolio';
      document.getElementById('form-header-icon').className = 'fas fa-edit';
      document.getElementById('submit-button-text').textContent = 'Update Portfolio';

      // Fill basic info
      document.getElementById('portfolio-name').value = portfolioName;
      document.getElementById('portfolio-type').value = portfolioCategory;
      document.getElementById('portfolio-description').value = portfolioDescription;

     
      // Fill skills
      const skillsContainer = document.getElementById('skills-container');
      skillsContainer.innerHTML = '';
      portfolioSkills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'tag';
        skillTag.innerHTML = skill + '<button type="button" class="remove-tag-btn">×</button>';
        skillsContainer.appendChild(skillTag);

        // Add remove event listener
        skillTag.querySelector('.remove-tag-btn').addEventListener('click', function () {
          this.parentElement.remove();
          setTimeout(updateSkillStepValidation, 0);
       // Revalidate
        });
      });

      setTimeout(updateSkillStepValidation, 0);

    // Clear any existing work experiences
    const workExpContainer = document.getElementById('work-experience-container');
    workExpContainer.innerHTML = '';

    // Add work experiences
    if (workExperiences.length > 0) {
      workExperiences.forEach((experience, index) => {
        // Create new experience item (you need to implement this function)
        addWorkExperienceItem(index + 1);
        
        // Get the newly added item (the last one)
        const items = workExpContainer.querySelectorAll('.work-experience-item');
        const newItem = items[items.length - 1];
        
        // Fill in the fields
        newItem.querySelector('.work-title').value = experience.title;
        newItem.querySelector('.work-company').value = experience.company;
        
        // Format the start date as YYYY-MM for the month input
        if (experience.start_date) {
          // Extract YYYY-MM part from the date (assuming it's in YYYY-MM-DD format)
          const startDate = experience.start_date.substring(0, 7);
          newItem.querySelector('.work-start-date').value = startDate;
        }
        
        if (!experience.end_date || experience.end_date === '') {
          newItem.querySelector('.work-current').checked = true;
          newItem.querySelector('.work-end-date').disabled = true;
        } else {
          // Format the end date as YYYY-MM for the month input
          const endDate = experience.end_date.substring(0, 7);
          newItem.querySelector('.work-end-date').value = endDate;
        }
        
        newItem.querySelector('.work-description').value = experience.description;
      });
    } else {
      // Add at least one empty experience item
      addWorkExperienceItem(1);
    }

    // Clear any existing work samples
    const samplesContainer = document.getElementById('work-samples-container');
    samplesContainer.innerHTML = '';

    // Add work samples
    if (workSamples.length > 0) {
      workSamples.forEach((sample, index) => {
        // Create new sample item (you need to implement this function)
        addWorkSampleItem(index + 1);
        
        // Get the newly added item (the last one)
        const items = samplesContainer.querySelectorAll('.work-sample-item');
        const newItem = items[items.length - 1];
        
        // Fill in the fields
        newItem.querySelector('.sample-title').value = sample.title;
        newItem.querySelector('.sample-description').value = sample.description;
        newItem.querySelector('.sample-url').value = sample.url;
      });
    } else {
      // Add at least one empty sample item
      addWorkSampleItem(1);
    }

    // Show the form section, hide others
    document.getElementById('portfolio-view').style.display = 'none';
    document.getElementById('portfolio-detail-view').style.display = 'none';
    document.getElementById('portfolio-form-container').style.display = 'block';
    
    // Reset form progress
    document.querySelectorAll('.form-steps .step').forEach(step => {
      step.classList.remove('active');
    });
    document.querySelector('.form-steps .step[data-step="1"]').classList.add('active');
    document.getElementById('form-progress-bar').style.width = '25%';
    
    // Show first section, hide others
    document.querySelectorAll('.form-section').forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById('section-1').style.display = 'block';
  });
});

});

// Also update the edit button handler from the view page
document.getElementById('edit-from-view').addEventListener('click', function() {
  const portfolioId = document.getElementById('portfolio-detail-view').dataset.portfolioId;
  // Find the corresponding portfolio card
  const portfolioCard = document.querySelector(`.portfolio-card[data-portfolio-id="${portfolioId}"]`);
  
  if (portfolioCard) {
    // Trigger the click on the edit button of that card
    portfolioCard.querySelector('.edit-portfolio-btn').click();
  }
});

// Define helper functions for adding work experience and samples
function addWorkExperienceItem(index) {
  const container = document.getElementById('work-experience-container');
  const newItem = document.createElement('div');
  newItem.className = 'work-experience-item card mb-3 p-3';
  newItem.innerHTML = `
    <div class="d-flex justify-content-between mb-2">
      <h5 class="card-title mb-0">Experience #${index}</h5>
      <button type="button" class="btn btn-sm btn-outline-danger remove-experience" ${index === 1 && container.children.length === 0 ? 'style="display: none;"' : ''}>
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Work Title <span class="text-danger">*</span></label>
          <input type="text" class="form-control work-title required" name="work_titles[]" placeholder="Position or project title">
          <div class="invalid-feedback">Work title is required</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Company/Client <span class="text-danger">*</span></label>
          <input type="text" name="work_companies[]" class="form-control work-company required" placeholder="Company or client name">
          <div class="invalid-feedback">Company/client is required</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Start Date <span class="text-danger">*</span></label>
          <input type="month" name="work_start_dates[]" class="form-control work-start-date required">
          <div class="invalid-feedback">Start date is required</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">End Date <span class="text-danger">*</span></label>
          <input type="month" name="work_end_dates[]" class="form-control work-end-date required">
          <div class="invalid-feedback">End date is required</div>
          <div class="form-check mt-2">
            <input class="form-check-input work-current" name="work_current[]" type="checkbox" id="currentWork${index}">
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Description <span class="text-danger">*</span></label>
      <textarea name="work_descriptions[]" class="form-control work-description required" rows="2" placeholder="Describe your responsibilities and achievements..."></textarea>
      <div class="invalid-feedback">Work description is required</div>
    </div>
  `;
  container.appendChild(newItem);
  
  // Add event listener for the remove button
  const removeBtn = newItem.querySelector('.remove-experience');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      newItem.remove();
      // Update numbering
      container.querySelectorAll('.work-experience-item').forEach((item, idx) => {
        item.querySelector('h5').textContent = `Experience #${idx + 1}`;
      });
    });
  }
  
  // Add event listener for the "Currently working" checkbox
  const currentCheckbox = newItem.querySelector('.work-current');
  currentCheckbox.addEventListener('change', function() {
    const endDateInput = this.closest('.mb-3').querySelector('.work-end-date');
    endDateInput.disabled = this.checked;
    if (this.checked) {
      endDateInput.value = '';
    }
  });
  
  // Trigger the event if "currently working" is checked
  if (currentCheckbox.checked) {
    const event = new Event('change');
    currentCheckbox.dispatchEvent(event);
  }
}

function addWorkSampleItem(index) {
  const container = document.getElementById('work-samples-container');
  const newItem = document.createElement('div');
  newItem.className = 'work-sample-item card mb-3 p-3';
  newItem.innerHTML = `
    <div class="d-flex justify-content-between mb-2">
      <h5 class="card-title mb-0">Sample #${index}</h5>
      <button type="button" class="btn btn-sm btn-outline-danger remove-sample" ${index === 1 && container.children.length === 0 ? 'style="display: none;"' : ''}>
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="mb-3">
          <label class="form-label">Project Title <span class="text-danger">*</span></label>
          <input type="text" name="sample_titles[]" class="form-control sample-title required" placeholder="Project name">
          <div class="invalid-feedback">Project title is required</div>
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Project Description <span class="text-danger">*</span></label>
      <textarea name="sample_descriptions[]" class="form-control sample-description required" rows="2" placeholder="Describe your project..."></textarea>
      <div class="invalid-feedback">Project description is required</div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="mb-3">
          <label class="form-label">Project URL <span class="text-danger">*</span></label>
          <input type="url" name="sample_urls[]" class="form-control sample-url required" placeholder="https://...">
          <div class="invalid-feedback">Project URL is required</div>
        </div>
      </div>
    </div>
  `;
  container.appendChild(newItem);
  
  // Add event listener for the remove button
  const removeBtn = newItem.querySelector('.remove-sample');
  if (removeBtn) {
    removeBtn.addEventListener('click', function() {
      newItem.remove();
      // Update numbering
      container.querySelectorAll('.work-sample-item').forEach((item, idx) => {
        item.querySelector('h5').textContent = `Sample #${idx + 1}`;
      });
    });
  }
}

// Reset form when clicking back or creating new portfolio
function resetPortfolioForm() {
  // Reset form mode
  const portfolioForm = document.getElementById('portfolio-form');
  portfolioForm.dataset.editing = 'false';
  portfolioForm.dataset.portfolioId = '';
  
  // Reset header
  document.getElementById('form-header-text').textContent = 'Create New Portfolio';
  document.getElementById('form-header-icon').className = 'fas fa-plus-circle';
  document.getElementById('submit-button-text').textContent = 'Create Portfolio';
  
  // Clear form fields
  portfolioForm.reset();
  
  // Clear skills
  document.getElementById('skills-container').innerHTML = '';
  
  // Reset work experience and samples to have one empty item each
  document.getElementById('work-experience-container').innerHTML = '';
  document.getElementById('work-samples-container').innerHTML = '';
  
  // Add one empty experience and sample
  addWorkExperienceItem(1);
  addWorkSampleItem(1);
}

// Back to portfolios button
document.getElementById('back-to-portfolios').addEventListener('click', function() {
  resetPortfolioForm();
  
  // Hide form, show portfolios list
  document.getElementById('portfolio-form-container').style.display = 'none';
  document.getElementById('portfolio-view').style.display = 'block';
});

// Create portfolio button
document.getElementById('create-portfolio-btn').addEventListener('click', function() {
  resetPortfolioForm();
  
  // Show form, hide portfolios list
  document.getElementById('portfolio-view').style.display = 'none';
  document.getElementById('portfolio-form-container').style.display = 'block';
});

// Check for stored notification on page load
document.addEventListener('DOMContentLoaded', function() {
  const storedNotification = localStorage.getItem('portfolioNotification');
  if (storedNotification) {
    // Display notification
    const successNotification = document.getElementById('success-notification');
    successNotification.textContent = storedNotification;
    successNotification.style.display = 'block';
    successNotification.classList.add('show');
    
    // Auto-hide notification after 2 seconds
    setTimeout(() => {
      successNotification.classList.remove('show');
      setTimeout(() => {
        successNotification.style.display = 'none';
      }, 300);
    }, 2000);
    
    // Clear the stored notification
    localStorage.removeItem('portfolioNotification');
  }
});

// For the view portfolio button
document.querySelectorAll('.view-portfolio-btn').forEach(button => {
  button.addEventListener('click', function() {
    const portfolioCard = this.closest('.portfolio-card');
    const portfolioId = portfolioCard.dataset.portfolioId;
    const portfolioName = portfolioCard.dataset.portfolioName;
    const portfolioDescription = portfolioCard.dataset.portfolioDescription;
    const portfolioSkills = JSON.parse(portfolioCard.dataset.portfolioSkills);
    const workExperiences = JSON.parse(portfolioCard.dataset.workExperiences);
    const workSamples = JSON.parse(portfolioCard.dataset.workSamples);
    
    // Update title and description
    document.getElementById('view-portfolio-title').textContent = portfolioName;
    document.getElementById('view-portfolio-description').textContent = portfolioDescription;
    
    // Update skills
    const skillsContainer = document.getElementById('view-portfolio-skills');
    skillsContainer.innerHTML = '';
    portfolioSkills.forEach(skill => {
      const skillTag = document.createElement('span');
      skillTag.className = 'tag';
      skillTag.textContent = skill;
      skillsContainer.appendChild(skillTag);
    });
    
    // Display work experiences in the view modal
    const experiencesContainer = document.getElementById('view-portfolio-experiences');
    experiencesContainer.innerHTML = '';
    
    workExperiences.forEach(exp => {
      // Check the actual structure of your data by logging it
      console.log("Experience data:", exp);
      
      // Try different possible property names for dates
      let startDate = '';
      if (exp.startDate) {
        startDate = formatDate(exp.startDate);
      } else if (exp.start_date) {
        startDate = formatDate(exp.start_date);
      }
      
      // Handle end date, showing "Present" if empty
      let endDate = 'Present';
      if (exp.endDate && exp.endDate.trim() !== '') {
        endDate = formatDate(exp.endDate);
      } else if (exp.end_date && exp.end_date.trim() !== '') {
        endDate = formatDate(exp.end_date);
      }
      
      const experienceItem = document.createElement('div');
      experienceItem.className = 'experience-item mb-4';
      experienceItem.innerHTML = `
        <h5 class="mb-1">${exp.title}</h5>
        <div class="company-name text-muted">${exp.company}</div>
        <div class="date-range text-muted small mb-2">${startDate} - ${endDate}</div>
        <p class="mb-0">${exp.description}</p>
      `;
      experiencesContainer.appendChild(experienceItem);
    });
    
    // Display work samples
    const samplesContainer = document.getElementById('view-portfolio-samples');
    samplesContainer.innerHTML = '';
    
    workSamples.forEach(sample => {
      const sampleItem = document.createElement('div');
      sampleItem.className = 'col-md-6 mb-4';
      sampleItem.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${sample.title}</h5>
            <p class="card-text">${sample.description}</p>
            <a href="${sample.url}" target="_blank" class="btn btn-primary btn-sm">View Project</a>
          </div>
        </div>
      `;
      samplesContainer.appendChild(sampleItem);
    });
    
    // Show portfolio detail view
    document.getElementById('portfolio-view').style.display = 'none';
    document.getElementById('portfolio-detail-view').style.display = 'block';
    document.getElementById('portfolio-detail-view').dataset.portfolioId = portfolioId;
  });
});

// Helper function to format date
function formatDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') {
    return 'Present';
  }
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.log("Invalid date:", dateStr);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
}

// Add this right after your other scripts
document.addEventListener('DOMContentLoaded', function() {
  // Run once on page load
  enableAllEndDateFields();
  
  // Also run periodically to catch new elements
  setInterval(enableAllEndDateFields, 500);
  
  function enableAllEndDateFields() {
    // Find all end date inputs and enable them
    document.querySelectorAll('.work-end-date').forEach(field => {
      field.disabled = false;
      field.classList.add('required'); // Add required class back if it was removed
    });
    
    // Uncheck all "currently work here" checkboxes
    document.querySelectorAll('.work-current').forEach(checkbox => {
      checkbox.checked = false;
    });
  }
});

// Fix dates not being loaded in edit mode
document.addEventListener('DOMContentLoaded', function() {
  // Patch the editPortfolio function if it exists
  const originalEditPortfolio = window.editPortfolio;
  if (typeof originalEditPortfolio === 'function') {
    window.editPortfolio = function(portfolioId) {
      // Call the original function first
      originalEditPortfolio(portfolioId);
      
      // Now fill in the dates that might have been missed
      setTimeout(function() {
        const portfolioCard = document.querySelector(`.portfolio-card[data-portfolio-id="${portfolioId}"]`);
        if (portfolioCard && portfolioCard.dataset.workExperiences) {
          const workExperiences = JSON.parse(portfolioCard.dataset.workExperiences);
          const workItems = document.querySelectorAll('#work-experience-container .work-experience-item');
          
          // Fill in dates for each work experience
          workExperiences.forEach((exp, index) => {
            if (index < workItems.length) {
              const item = workItems[index];
              
              // Set start date if available
              if (exp.startDate || exp.start_date) {
                const startDate = exp.startDate || exp.start_date;
                if (startDate) {
                  item.querySelector('.work-start-date').value = startDate.substring(0, 7); // Get YYYY-MM part
                }
              }
              
              // Set end date if available
              if (exp.endDate || exp.end_date) {
                const endDate = exp.endDate || exp.end_date;
                if (endDate) {
                  item.querySelector('.work-end-date').value = endDate.substring(0, 7); // Get YYYY-MM part
                }
              }
              
              // Make sure end date is enabled
              item.querySelector('.work-end-date').disabled = false;
            }
          });
        }
      }, 100); // Give a slight delay to ensure the form is ready
    };
  }
  
  // Alternative approach: patch via event listener for edit buttons
  document.querySelectorAll('.edit-portfolio-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const portfolioCard = this.closest('.portfolio-card');
      const portfolioId = portfolioCard.dataset.portfolioId;
      
      // Give time for the form to be populated
      setTimeout(function() {
        if (portfolioCard && portfolioCard.dataset.workExperiences) {
          const workExperiences = JSON.parse(portfolioCard.dataset.workExperiences);
          const workItems = document.querySelectorAll('#work-experience-container .work-experience-item');
          
          // Fill in dates for each work experience
          workExperiences.forEach((exp, index) => {
            if (index < workItems.length) {
              const item = workItems[index];
              
              // Set start date if available
              if (exp.startDate || exp.start_date) {
                const startDate = exp.startDate || exp.start_date;
                if (startDate) {
                  item.querySelector('.work-start-date').value = startDate.substring(0, 7); // Get YYYY-MM part
                }
              }
              
              // Set end date if available
              if (exp.endDate || exp.end_date) {
                const endDate = exp.endDate || exp.end_date;
                if (endDate) {
                  item.querySelector('.work-end-date').value = endDate.substring(0, 7); // Get YYYY-MM part
                }
              }
              
              // Make sure end date is enabled
              item.querySelector('.work-end-date').disabled = false;
            }
          });
        }
      }, 500);
    });
  });
});
  </script>
  <script src="JS/freelancerProfile.js"></script>
  <script src="JS/freelancerPortfolio.js"></script>
</body>
</html>