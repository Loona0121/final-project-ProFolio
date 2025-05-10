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
#portfolioModal .modal-dialog,
#sendOfferModal .modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  min-height: 100vh;
  padding: 0;
}

/* Override any conflicting max-height settings */
#portfolioModal .modal-content,
#sendOfferModal .modal-content {
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

/* Force center Send Offer Modal content */
#sendOfferModal .send-offer-modal-content {
  width: 100% !important;
  padding: 0 1rem !important;
}

/* Ensure modal body scrolls properly */
#portfolioModal .modal-body,
#sendOfferModal .modal-body {
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
#portfolioModal .row,
#sendOfferModal .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
}

/* Simplified offer form styling */
.offer-form-simplified {
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  #portfolioModal .modal-dialog,
  #sendOfferModal .modal-dialog {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
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
}

.tag {
  background-color: #f0f7ff;
  color: #0d6efd;
  padding: 0.3rem 0.7rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin: 0.25rem;
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
            <a href="clientTalents.php" class="nav-link active">
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
                <div class="col-md-8">
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" class="form-control" placeholder="Search for talents by name or expertise..." id="talent-search">
                  </div>
                </div>
                <div class="col-md-4">
                  <select class="form-select" id="category-filter">
                    <option value="">All Categories</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="marketing">Marketing</option>
                    <option value="writing">Writing</option>
                    <option value="video">Video & Animation</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Talents Grid - Actual talent data is embedded in the HTML for server rendering -->
        <div class="talents-container mt-4">
          <div class="row g-4" id="talents-grid">
            <!-- Sarah Johnson - Design -->
            <div class="col-md-6 col-lg-4 talent-card-col" data-category="design" data-talent-id="1" 
                data-talent-name="Sarah Johnson" 
                data-talent-title="UX/UI Designer" 
                data-talent-avatar="/api/placeholder/100/100"
                data-talent-bio="Passionate designer with 5+ years of experience creating intuitive and beautiful user interfaces. I specialize in mobile app design and responsive web interfaces."
                data-talent-skills="UI Design,Figma,Prototyping,Adobe XD,Wireframing,UX Research"
                data-talent-summary="Expert in creating intuitive user interfaces with 5+ years of experience. Specialized in mobile app design and responsive web interfaces."
                data-talent-experience='[{"title":"Senior UX Designer","company":"Design Innovations Ltd","date":"Mar 2022 - Present","description":"Lead UX/UI design for enterprise clients, creating user-centered designs that increased engagement by 40%."},{"title":"UI Designer","company":"Creative Solutions","date":"Jan 2019 - Feb 2022","description":"Designed mobile app interfaces and web applications for startups and mid-sized businesses."}]'
                data-talent-samples='[{"title":"E-commerce App Redesign","description":"Complete redesign of a fashion e-commerce app, improving conversion rates by 25%.","link":"https://example.com/project1"},{"title":"Finance Dashboard","description":"Intuitive dashboard design for a financial management platform, simplifying complex data visualization.","link":"https://example.com/project2"}]'>
              <div class="talent-card">
                <div class="talent-header">
                  <div class="talent-avatar">
                    <img src="/api/placeholder/100/100" alt="Sarah Johnson">
                  </div>
                  <div class="talent-info">
                    <h5 class="talent-name">Sarah Johnson</h5>
                    <p class="talent-title">UX/UI Designer</p>
                  </div>
                </div>
                <div class="talent-portfolio">
                  <h6 class="portfolio-heading">Portfolio Summary</h6>
                  <p class="portfolio-summary">Expert in creating intuitive user interfaces with 5+ years of experience. Specialized in mobile app design and responsive web interfaces.</p>
                  <div class="portfolio-skills">
                    <span class="skill-tag">UI Design</span>
                    <span class="skill-tag">Figma</span>
                    <span class="skill-tag">Prototyping</span>
                  </div>
                </div>
                <div class="talent-actions">
                  <button class="btn btn-outline-primary view-portfolio-btn" onclick="openPortfolioModalFromCard(this)">
                    <i class="fas fa-eye me-2"></i>View Portfolio
                  </button>
                  <button class="btn btn-primary send-offer-btn" onclick="openSendOfferModalFromCard(this)">
                    <i class="fas fa-paper-plane me-2"></i>Hire Me
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Michael Chen - Development -->
            <div class="col-md-6 col-lg-4 talent-card-col" data-category="development" data-talent-id="2"
                data-talent-name="Michael Chen" 
                data-talent-title="Full Stack Developer" 
                data-talent-avatar="/api/placeholder/100/100"
                data-talent-bio="Full stack developer with strong expertise in modern JavaScript frameworks. I build scalable web applications with clean, maintainable code."
                data-talent-skills="React,Node.js,MongoDB,Express,TypeScript,AWS"
                data-talent-summary="Experienced developer with expertise in React, Node.js, and MongoDB. Built scalable applications for startups and enterprise clients."
                data-talent-experience='[{"title":"Senior Developer","company":"Tech Solutions Inc.","date":"Jan 2022 - Present","description":"Lead developer for enterprise web applications, implementing best practices and improving performance by 40%."},{"title":"Frontend Developer","company":"Digital Innovations","date":"Mar 2019 - Dec 2021","description":"Developed responsive web interfaces for various clients using modern JavaScript frameworks and CSS preprocessors."}]'
                data-talent-samples='[{"title":"E-commerce Platform","description":"Fully responsive e-commerce website with integrated payment processing and inventory management.","link":"https://example.com/project1"},{"title":"Real-time Chat Application","description":"Scalable chat application with real-time messaging, file sharing, and user authentication.","link":"https://example.com/project2"}]'>
              <div class="talent-card">
                <div class="talent-header">
                  <div class="talent-avatar">
                    <img src="/api/placeholder/100/100" alt="Michael Chen">
                  </div>
                  <div class="talent-info">
                    <h5 class="talent-name">Michael Chen</h5>
                    <p class="talent-title">Full Stack Developer</p>
                  </div>
                </div>
                <div class="talent-portfolio">
                  <h6 class="portfolio-heading">Portfolio Summary</h6>
                  <p class="portfolio-summary">Experienced developer with expertise in React, Node.js, and MongoDB. Built scalable applications for startups and enterprise clients.</p>
                  <div class="portfolio-skills">
                    <span class="skill-tag">React</span>
                    <span class="skill-tag">Node.js</span>
                    <span class="skill-tag">MongoDB</span>
                  </div>
                </div>
                <div class="talent-actions">
                  <button class="btn btn-outline-primary view-portfolio-btn" onclick="openPortfolioModalFromCard(this)">
                    <i class="fas fa-eye me-2"></i>View Portfolio
                  </button>
                  <button class="btn btn-primary send-offer-btn" onclick="openSendOfferModalFromCard(this)">
                    <i class="fas fa-paper-plane me-2"></i>Hire Me
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Aisha Patel - Marketing -->
            <div class="col-md-6 col-lg-4 talent-card-col" data-category="marketing" data-talent-id="3"
                data-talent-name="Aisha Patel" 
                data-talent-title="Content Strategist" 
                data-talent-avatar="/api/placeholder/100/100"
                data-talent-bio="Results-driven content strategist with a knack for creating engaging narratives that drive traffic and conversions."
                data-talent-skills="SEO,Content Marketing,Copywriting,Content Planning,Analytics,Social Media"
                data-talent-summary="Strategic content creator with focus on SEO and audience engagement. Helped businesses increase organic traffic by up to 200%."
                data-talent-experience='[{"title":"Senior Content Strategist","company":"Marketing Wizards","date":"Jun 2021 - Present","description":"Created comprehensive content strategies that increased organic traffic by 200% for multiple clients."},{"title":"Content Writer","company":"Digital Content Agency","date":"Aug 2018 - May 2021","description":"Produced high-quality blog posts, website copy, and marketing materials for diverse industries."}]'
                data-talent-samples='[{"title":"SaaS Company Blog Strategy","description":"Developed and implemented a content strategy that grew blog traffic by 350% in 6 months.","link":"https://example.com/project1"},{"title":"E-commerce Product Descriptions","description":"Crafted compelling product descriptions that improved conversion rates by 30%.","link":"https://example.com/project2"}]'>
              <div class="talent-card">
                <div class="talent-header">
                  <div class="talent-avatar">
                    <img src="/api/placeholder/100/100" alt="Aisha Patel">
                  </div>
                  <div class="talent-info">
                    <h5 class="talent-name">Aisha Patel</h5>
                    <p class="talent-title">Content Strategist</p>
                  </div>
                </div>
                <div class="talent-portfolio">
                  <h6 class="portfolio-heading">Portfolio Summary</h6>
                  <p class="portfolio-summary">Strategic content creator with focus on SEO and audience engagement. Helped businesses increase organic traffic by up to 200%.</p>
                  <div class="portfolio-skills">
                    <span class="skill-tag">SEO</span>
                    <span class="skill-tag">Content Marketing</span>
                    <span class="skill-tag">Copywriting</span>
                  </div>
                </div>
                <div class="talent-actions">
                  <button class="btn btn-outline-primary view-portfolio-btn" onclick="openPortfolioModalFromCard(this)">
                    <i class="fas fa-eye me-2"></i>View Portfolio
                  </button>
                  <button class="btn btn-primary send-offer-btn" onclick="openSendOfferModalFromCard(this)">
                    <i class="fas fa-paper-plane me-2"></i>Hire Me
                  </button>
                </div>
              </div>
            </div>
            
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
                <h5 class="modal-title" id="portfolioModalLabel">Talent Portfolio</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- Properly centered portfolio content -->
                <div class="portfolio-modal-content">
                  <!-- Talent Profile Header -->
                  <div class="talent-profile-header">
                    <div class="talent-profile-avatar">
                      <img src="/api/placeholder/150/150" alt="Talent" id="modal-talent-avatar">
                    </div>
                    <div class="talent-profile-details">
                      <h4 id="modal-talent-name">Talent Name</h4>
                      <p class="talent-title" id="modal-talent-title">Profession</p>
                      <p class="talent-bio" id="modal-talent-bio">
                        Passionate professional with extensive experience delivering high-quality solutions for clients worldwide.
                      </p>
                    </div>
                  </div>
                  
                  <!-- Skills Section -->
                  <div class="portfolio-section card mb-4 w-100">
                    <div class="card-body">
                      <h5 class="mb-3">Skills</h5>
                      <div id="view-portfolio-skills">
                        <!-- Skills tags will be dynamically inserted here -->
                      </div>
                    </div>
                  </div>
                  
                  <!-- Work Experience Section -->
                  <div class="portfolio-section card mb-4 w-100">
                    <div class="card-header bg-light">
                      <h5 class="mb-0"><i class="fas fa-briefcase me-2"></i>Work Experience</h5>
                    </div>
                    <div class="card-body">
                      <div id="view-portfolio-experiences">
                        <!-- Work experience items will be dynamically inserted here -->
                      </div>
                    </div>
                  </div>
                  
                  <!-- Work Samples Section -->
                  <div class="portfolio-section card w-100">
                    <div class="card-header bg-light">
                      <h5 class="mb-0"><i class="fas fa-cubes me-2"></i>Work Samples</h5>
                    </div>
                    <div class="card-body">
                      <div id="view-portfolio-samples" class="row">
                        <!-- Work samples will be dynamically inserted here -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="modal-send-offer-btn">Hire Me</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Simplified Send Offer Modal -->
        <div class="modal fade" id="sendOfferModal" tabindex="-1" aria-labelledby="sendOfferModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="sendOfferModalLabel">Send Offer to <span id="offer-talent-name">Talent Name</span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="send-offer-modal-content">
                  <form id="offer-form" class="offer-form-simplified">
                    <div class="mb-3">
                      <label for="job-title" class="form-label">Job Title</label>
                      <input type="text" class="form-control" id="job-title" placeholder="e.g., Senior Front-End Developer" required>
                    </div>
                    
                    <div class="mb-4">
                      <label for="client-message" class="form-label">Message to Freelancer</label>
                      <textarea class="form-control" id="client-message" rows="6" placeholder="Introduce yourself and describe the job opportunity, requirements, and any other details the freelancer should know." required></textarea>
                      <div class="form-text mt-2">
                        <i class="fas fa-info-circle"></i> Your profile information will be automatically included with this offer.
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="submit-offer-btn" onclick="submitOfferForm()">Send Offer</button>
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
  
  <!-- Internal Script - All functionality embedded into HTML -->
  <script src="clientTalents.js"></script>
  </body>
  </html>
    