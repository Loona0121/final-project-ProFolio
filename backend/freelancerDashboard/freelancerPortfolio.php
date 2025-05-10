<?php
session_start();
include_once("../connection/connection.php");
include_once("FUNCTIONS/getUserData.php"); 
$con = connection();

if (!isset($_SESSION['id'])) {
  echo json_encode(["status" => "error", "message" => "User not logged in"]);
  exit;
}

// Make sure it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $userID = $_SESSION['id'] ?? null; // safer
    if (!$userID) {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit;
    }
    
    $userData = getUserData($userID);
    
    // REMOVED DEBUG STATEMENT: var_dump($_SESSION['id']); exit;

    // Check if userData is null or invalid
    if ($userData === null) {
        echo json_encode(["status" => "error", "message" => "User data not found"]);
        exit;
    }

    // Safely collect data
    $portfolioName = mysqli_real_escape_string($con, $_POST['name'] ?? '');
    $portfolioCategory = mysqli_real_escape_string($con, $_POST['category'] ?? '');
    $portfolioDescription = mysqli_real_escape_string($con, $_POST['portfolio_description'] ?? '');
    $skills = $_POST['skills'] ?? [];
    $workExperiences = $_POST['work_experience'] ?? [];
    $workSamples = $_POST['work_samples'] ?? [];

    // Fix: Use the correct session variable
    $userId = $userID; // Use the already validated userID variable

    if (empty($portfolioName) || empty($portfolioCategory)) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    // Insert into 'portfolio' table
    $insertPortfolio = "INSERT INTO portfolio (user_id, name, category, description, created_at)
                        VALUES ('$userId', '$portfolioName', '$portfolioCategory', '$portfolioDescription', NOW())";
                        
    if (mysqli_query($con, $insertPortfolio)) {
        $portfolioId = mysqli_insert_id($con); // Get the newly created portfolio ID

        // Insert skills
        foreach ($skills as $skillName) {
            $skillName = mysqli_real_escape_string($con, $skillName);

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

        // Insert work experiences
        foreach ($workExperiences as $experience) {
            $title = mysqli_real_escape_string($con, $experience['title'] ?? '');
            $company = mysqli_real_escape_string($con, $experience['company'] ?? '');
            $startDate = mysqli_real_escape_string($con, $experience['start_date'] ?? '');
            $endDate = mysqli_real_escape_string($con, $experience['end_date'] ?? '');
            $description = mysqli_real_escape_string($con, $experience['description'] ?? '');

            if (!empty($title) && !empty($company)) { // Insert only if some basic fields exist
                $insertExperience = "INSERT INTO work_experience (portfolio_id, title, company, start_date, end_date, description)
                                     VALUES ('$portfolioId', '$title', '$company', '$startDate', '$endDate', '$description')";
                mysqli_query($con, $insertExperience);
            }
        }

        // Insert work samples
        foreach ($workSamples as $sample) {
            $sampleTitle = mysqli_real_escape_string($con, $sample['title'] ?? '');
            $sampleDescription = mysqli_real_escape_string($con, $sample['description'] ?? '');
            $sampleUrl = mysqli_real_escape_string($con, $sample['url'] ?? '');

            if (!empty($sampleTitle)) { // Insert only if title is not empty
                $insertSample = "INSERT INTO work_samples (portfolio_id, title, description, url)
                                 VALUES ('$portfolioId', '$sampleTitle', '$sampleDescription', '$sampleUrl')";
                mysqli_query($con, $insertSample);
            }
        }

        echo json_encode(["status" => "success", "message" => "Portfolio created successfully"]);
        exit; // Exit after sending the response
    } else {
        echo json_encode(["status" => "error", "message" => "Error creating portfolio"]);
        exit; // Exit after sending the response
    }
} 
// No else statement here - continue to HTML output for non-POST requests

// Get the user data for display
$userID = $_SESSION['id'] ?? 0;
$userData = getUserData($userID);


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
            <a href="freelancerPortfolio.php" class="nav-link active">
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
// Query to get all portfolio data with skills
$sql = "SELECT A.portfolio_id, A.name, A.description, C.skill_name
        FROM portfolio A
        LEFT JOIN portfolio_skills B ON A.portfolio_id = B.portfolio_id
        LEFT JOIN skills C ON C.skill_id = B.skill_id";

$result = $con->query($sql);

$portfolios = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $id = $row['portfolio_id'];

        // Initialize portfolio entry if not already set
        if (!isset($portfolios[$id])) {
            $portfolios[$id] = [
                'name' => $row['name'],
                'description' => $row['description'],
                'skills' => []
            ];
        }

        // Add skill if it's not already in the list and not null
        if ($row['skill_name'] && !in_array($row['skill_name'], $portfolios[$id]['skills'])) {
            $portfolios[$id]['skills'][] = $row['skill_name'];
        }
    }

    // Now render the HTML once per portfolio
    foreach ($portfolios as $portfolio) {
        ?>
        <div class="portfolio-card" data-portfolio-id="<?php echo htmlspecialchars($id); ?>"
         data-work-experiences='[{"title":"Developer","company":"Tech Co","startDate":"2022-01-01","endDate":"2023-01-01","description":"Built apps","isCurrent":false}]'>
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
} else {
    echo "No records found.";
}

$con->close();
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
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="portfolio-name" class="form-label">Portfolio Name <span class="text-danger">*</span></label>
                      <input type="text" class="form-control required" id="portfolio-name" name="name" placeholder="e.g., Web Development Projects">
                      <div class="invalid-feedback">Portfolio name is required</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="portfolio-type" class="form-label">Portfolio Category <span class="text-danger">*</span></label>
                      <select class="form-select required" id="portfolio-type" name="category">
                        <option value="">Select category...</option>
                        <option value="web-development">Web Development</option>
                        <option value="ui-ux-design">UI/UX Design</option>
                        <option value="graphic-design">Graphic Design</option>
                        <option value="content-writing">Content Writing</option>
                        <option value="other">Other</option>
                      </select>
                      <div class="invalid-feedback">Portfolio category is required</div>
                    </div>
                  </div>
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
                            <label class="form-check-label" for="currentWork">
                              I currently work here
                            </label>
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
        
        // Implement delete functionality here
        // For demonstration, just hide the element and show notification
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
        
        // Hide the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
        modal.hide();
        
        // Auto-hide notification after 2 seconds
        setTimeout(() => {
          successNotification.classList.remove('show');
          setTimeout(() => {
            successNotification.style.display = 'none';
          }, 300);
        }, 2000);
      });
    });



    

    ///////////////////////////////////////////////////////////////////////////////
    document.getElementById('portfolio-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData();

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
      alert('Portfolio created successfully!');
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



  </script>
  <script src="JS/freelancerProfile.js"></script>
  <script src="JS/freelancerPortfolio.js"></script>
</body>
</html>