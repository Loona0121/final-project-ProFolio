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

// Process form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Get the company name from the form
  $companyName = isset($_POST['company_name']) ? trim($_POST['company_name']) : '';
  
  // Process photo upload if provided
  $profilePhotoPath = isset($userData['profile_photo']) ? $userData['profile_photo'] : 'default-profile-photo.jpg';
  
  if (isset($_FILES['profile_photo']) && $_FILES['profile_photo']['error'] == 0) {
    $targetDir = "../uploads/";  
    if (!file_exists($targetDir)) {
      mkdir($targetDir, 0777, true);
    }
    $fileName = time() . '_' . basename($_FILES["profile_photo"]["name"]);
    $targetFilePath = $targetDir . $fileName;
    move_uploaded_file($_FILES["profile_photo"]["tmp_name"], $targetFilePath);
    $profilePhotoPath = $targetFilePath;
  }
  
  // Update database
  $updateQuery = "UPDATE _user SET job_title = ?, profile_photo = ? WHERE id = ?";
  $stmt = $con->prepare($updateQuery);
  $stmt->bind_param("ssi", $companyName, $profilePhotoPath, $userID);
  
  if ($stmt->execute()) {
    // Success - Set session flag for notification
    $_SESSION['profile_just_updated'] = true;
    
    // Redirect back to the profile page with success parameter
    header("Location: clientProfile.php?profileUpdated=true&refresh=" . time());
    exit();
  } else {
    // Error - Set error message
    $errorMessage = "Failed to update profile: " . $stmt->error;
  }
}

// Get fresh user data after potential update
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
  #success-notification {
    transition: opacity 0.3s ease-out;
  }
  
  /* Enhanced styling for Change Photo button */
  .change-photo-btn {
    display: inline-block;
    background-color: #4e73df;
    color: white;
    padding: 8px 15px;
    border-radius: 50px;
    margin-top: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    text-align: center;
    width: auto;
  }
  
  .change-photo-btn:hover {
    background-color: #375bc8;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
  
  .change-photo-btn i {
    margin-right: 5px;
  }
  
  .profile-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border: 3px solid #e0e0e0;
    overflow: hidden;
    position: relative;
  }
  
  .profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-photo i {
    font-size: 50px;
    color: #adb5bd;
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
            <a href="clientTalents.php" class="nav-link">
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
        <?php if (isset($_GET['profileUpdated']) && $_GET['profileUpdated'] == 'true' && isset($_SESSION['profile_just_updated'])): 
          // Clear the session flag to prevent showing on refresh
          unset($_SESSION['profile_just_updated']);
        ?>
        <div class="alert alert-success fade show" role="alert" id="success-notification">
          <i class="fas fa-check-circle me-2"></i> Profile updated successfully!
        </div>
        <?php endif; ?>

        <!-- Error message if there was an issue -->
        <?php if (isset($errorMessage)): ?>
        <div class="alert alert-danger fade show" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i> <?php echo $errorMessage; ?>
        </div>
        <?php endif; ?>

        <!-- Profile Content -->
        <div class="profile-container">
          <div class="card profile-card">
            <div class="card-body">
              <form id="profile-form" action="clientProfile.php" method="POST" enctype="multipart/form-data">
                <div class="row">
                  <div class="col-md-3 text-center mb-4">
                    <div class="profile-photo-container">
                      <div class="profile-photo" id="profile-photo">
                        <?php if (!empty($userData['profile_photo']) && $userData['profile_photo'] != 'default-profile-photo.jpg'): ?>
                          <img src="<?php echo htmlspecialchars($userData['profile_photo']); ?>" alt="Profile Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                        <?php else: ?>
                          <i class="fas fa-user"></i>
                        <?php endif; ?>
                      </div>
                      <label for="photo-upload" class="change-photo-btn">
                        <i class="fas fa-camera me-2"></i> Change Photo
                      </label>
                      <input type="file" name="profile_photo" id="photo-upload" class="d-none" accept="image/*">
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
                      <input type="text" name="company_name" class="form-control" id="companyName" placeholder="Enter your company name" value="<?php echo htmlspecialchars($userData['job_title'] ?? ''); ?>">
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
      
      // Auto-dismiss notification after 2 seconds
      const successNotification = document.getElementById('success-notification');
      if (successNotification) {
        setTimeout(function() {
          successNotification.style.opacity = '0';
          setTimeout(function() {
            successNotification.style.display = 'none';
          }, 300);
        }, 2000);
      }
      
      // Cancel button handler
      document.getElementById('cancel-btn').addEventListener('click', function() {
        window.location.href = 'clientProfile.php';
      });
      
      // Photo upload preview handler
      const photoUpload = document.getElementById('photo-upload');
      const profilePhoto = document.getElementById('profile-photo');
      const sidebarAvatar = document.getElementById('sidebar-avatar');
      
      photoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const imageUrl = e.target.result;
            
            // Update main profile photo
            if (profilePhoto.querySelector('img')) {
              profilePhoto.querySelector('img').src = imageUrl;
            } else {
              const img = document.createElement('img');
              img.src = imageUrl;
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';
              img.style.borderRadius = '50%';
              profilePhoto.innerHTML = '';
              profilePhoto.appendChild(img);
            }
            
            // Update sidebar avatar
            if (sidebarAvatar.querySelector('img')) {
              sidebarAvatar.querySelector('img').src = imageUrl;
            } else {
              const avatarImg = document.createElement('img');
              avatarImg.src = imageUrl;
              avatarImg.style.width = '100%';
              avatarImg.style.height = '100%';
              avatarImg.style.objectFit = 'cover';
              avatarImg.style.borderRadius = '50%';
              sidebarAvatar.innerHTML = '';
              sidebarAvatar.appendChild(avatarImg);
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
    });
  </script>
</body>
</html>