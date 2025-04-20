
<?php
include_once("../connection/connection.php");
$con = connection();

$role = isset($_GET['role']) ? $_GET['role'] : 'agency'; // Default to 'Agency' if not provided

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form data
    $agencyName = $_POST['agencyName'];

    // Handle file upload for logo
    if (isset($_FILES['agencyLogo']) && $_FILES['agencyLogo']['error'] == 0) {
        $logoTmp = $_FILES['agencyLogo']['tmp_name'];
        $logoName = $_FILES['agencyLogo']['name'];
        $logoExtension = strtolower(pathinfo($logoName, PATHINFO_EXTENSION));

        // Allowed file types
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        // Check if the file is of a valid type
        if (in_array($logoExtension, $allowedExtensions)) {
            $logoDestination = '../uploads/' . $logoName;

            // Check if file already exists
            if (file_exists($logoDestination)) {
                echo "Error: File already exists.";
                exit();
            } else {
                if (move_uploaded_file($logoTmp, $logoDestination)) {
                    $agencyLogo = $logoDestination;
                } else {
                    echo "Error uploading the file.";
                    exit();
                }
            }
        } else {
            echo "Error: Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.";
            exit();
        }
    } else {
        $agencyLogo = ''; // If no file uploaded
    }

    $agencyType = $_POST['agencyType'];
    $teamSize = $_POST['teamSize'];
    $agencyDescription = $_POST['agencyDescription'];

    // Handle services selection
    $services = isset($_POST['services']) && is_array($_POST['services']) ? implode(',', $_POST['services']) : '';

    $agencyWebsite = $_POST['agencyWebsite'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $jobTitle = $_POST['jobTitle'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password
    $country = $_POST['country'];
    $city = $_POST['city'];

    // Check if the email already exists
    $emailCheck = $con->prepare("SELECT email FROM _user WHERE email = ?");
    $emailCheck->bind_param("s", $email);
    $emailCheck->execute();
    $emailCheck->store_result();
    
    if ($emailCheck->num_rows > 0) {
        echo "Error: The email address is already registered!";
        $emailCheck->close();
        $con->close();
        exit();
    }
    $emailCheck->close();

    // Insert into database (without the 'id' field as it's auto-increment)
    $stmt = $con->prepare("INSERT INTO _user (first_name, last_name, email, password, country, city, agency_name, agency_type, agency_logo, team_size, agency_description, services, agency_website, agency_title, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("sssssssssssssss", $firstName, $lastName, $email, $password, $country, $city, $agencyName, $agencyType, $agencyLogo, $teamSize, $agencyDescription, $services, $agencyWebsite, $jobTitle, $role);

    if ($stmt->execute()) {
        echo "<script>alert('Registration successful! Redirecting to dashboard'); window.location.href='login.php';</script>";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
    $con->close();
}
?>






<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProFolio - Agency Registration</title>
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/agency.css">
</head>
<body>
</head>
<!-- Header -->
<header class="header">
 <div class="container">
   <div class="row">
     <div class="col-12">
       <div class="header-logo">
       Pro<span>Folio</span>
       </div>
     </div>
   </div>
 </div>
</header>

    <div class="container registration-container">
    <div class="text-center mb-4">
            <h1 class="mb-1">Register your Team</h1>
            <p class="text-muted">Sign up to showcase your team</p>
        </div>

        
        <!-- Registration Form -->
        <form method="POST" enctype="multipart/form-data">
    <!-- Agency Information -->
    <div class="form-section-title">
        <i></i>Agency Information
    </div>

    <div class="mb-3">
        <label for="agencyName" class="form-label">Agency Name<span style="color: red">*</span></label>
        <input type="text" class="form-control" id="agencyName" name="agencyName" required>
    </div>

    <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
            <label class="form-label">Agency Logo</label>
            <div class="upload-logo-box" onclick="document.getElementById('agencyLogoInput').click();">
                <div class="text-center">
                    <i class="fas fa-cloud-upload-alt fs-3 mb-2"></i>
                    <p class="mb-0">Click to upload your logo</p>
                    <small class="text-muted">PNG, JPG, or SVG (max 2MB)</small>
                    <input type="file" id="agencyLogoInput" name="agencyLogo" accept=".png,.jpg,.svg" class="d-none" required>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <label for="agencyType" class="form-label">Agency Type<span style="color: red">*</span></label>
            <select class="form-select mb-3" id="agencyType" name="agencyType" required>
                <option value="" selected disabled>Select agency type</option>
                <option value="Design Agency">Design Agency</option>
                <option value="Software Development">Software Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Creative Studio">Creative Studio</option>
                <option value="Consulting Firm">Consulting Firm</option>
                <option value="Branding Agency">Branding Agency</option>
                <option value="Web Development">Web Development</option>
                <option value="Other">Other</option>
            </select>

            <label for="teamSize" class="form-label">Team Size<span style="color: red">*</span></label>
            <select class="form-select" id="teamSize" name="teamSize" required>
                <option value="2-5">2-5 team members</option>
                <option value="6-10">6-10 team members</option>
                <option value="11-25">11-25 team members</option>
                <option value="26-50">26-50 team members</option>
                <option value="51-100">51-100 team members</option>
                <option value="100+">100+ team members</option>
            </select>
        </div>
    </div>

    <div class="mb-4">
        <label for="agencyDescription" class="form-label">Agency Description<span style="color: red">*</span></label>
        <textarea class="form-control" id="agencyDescription" name="agencyDescription" rows="3" placeholder="Tell potential clients about your agency, expertise, and what makes you unique..." required></textarea>
    </div>

    <div class="mb-4">
        <label class="form-label mb-2">Services Offered<span style="color: red">*</span></label>
        <div class="service-checkboxes">
            <div class="service-checkbox" onclick="toggleService(this)">Web Design</div>
            <div class="service-checkbox" onclick="toggleService(this)">Web Development</div>
            <div class="service-checkbox" onclick="toggleService(this)">Mobile App Development</div>
            <div class="service-checkbox" onclick="toggleService(this)">UI/UX Design</div>
            <div class="service-checkbox" onclick="toggleService(this)">Branding</div>
            <div class="service-checkbox" onclick="toggleService(this)">SEO</div>
            <div class="service-checkbox" onclick="toggleService(this)">Content Marketing</div>
            <div class="service-checkbox" onclick="toggleService(this)">Social Media</div>
            <div class="service-checkbox" onclick="toggleService(this)">Graphic Design</div>
            <div class="service-checkbox" onclick="toggleService(this)">Animation</div>
            <div class="service-checkbox" onclick="toggleService(this)">E-commerce</div>
            <div class="service-checkbox" onclick="toggleService(this)">+ Custom</div>
        </div>
        <input type="hidden" name="services[]" id="services" value="">
    </div>

    <div class="mb-3">
        <label for="agencyWebsite" class="form-label">Agency Website (Optional)</label>
        <input type="url" class="form-control" id="agencyWebsite" name="agencyWebsite" placeholder="https://">
    </div>

    <!-- Contact & Admin Information -->
    <div class="form-section-title mt-4">
        <i></i>Admin Account Information
    </div>

    <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
            <label for="firstName" class="form-label">First name<span style="color: red">*</span></label>
            <input type="text" class="form-control" id="firstName" name="firstName" required>
        </div>
        <div class="col-md-6">
            <label for="lastName" class="form-label">Last name<span style="color: red">*</span></label>
            <input type="text" class="form-control" id="lastName" name="lastName" required>
        </div>
    </div>

    <div class="mb-3">
        <label for="jobTitle" class="form-label">Your Position/Title<span style="color: red">*</span></label>
        <input type="text" class="form-control" id="jobTitle" name="jobTitle" placeholder="e.g. Creative Director, CEO, Founder" required>
    </div>

    <div class="mb-3">
        <label for="email" class="form-label">Work Email<span style="color: red">*</span></label>
        <input type="email" class="form-control" id="email" name="email" required>
    </div>

    <div class="mb-3 password-field">
        <label for="password" class="form-label">Password<span style="color: red">*</span></label>
        <input type="password" class="form-control" id="password" name="password" placeholder="Password (8 or more characters)" required>
        <span class="password-toggle" onclick="togglePassword()">
            <i class="far fa-eye-slash"></i>
        </span>
    </div>

    <div class="mb-3">
        <label for="country" class="form-label">Country<span style="color: red">*</span></label>
        <select class="form-select" id="country" name="country" required>
            <option value="Philippines" selected>Philippines</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Singapore">Singapore</option>
            <option value="India">India</option>
            <!-- Add more countries as needed -->
        </select>
    </div>

    <div class="mb-3">
        <label for="city" class="form-label">City<span style="color: red">*</span></label>
        <input type="text" class="form-control" id="city" name="city" required>
    </div>

    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="marketingEmails" name="marketingEmails">
        <label class="form-check-label" for="marketingEmails">
            Send me helpful emails about finding talent and growing my agency.
        </label>
    </div>

    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="termsAgree" name="termsAgree" required>
        <label class="form-check-label" for="termsAgree">
                    Yes, I understand and agree to the ProFolio <a href="#" class="text-success">Terms of Service</a>, including the <a href="#" class="text-success">User Agreement</a> and <a href="#" class="text-success">Privacy Policy</a>.
                </label>
    </div>

    <div class="text-center">
        <button type="submit" class="btn create-btn">Create Agency Account</button>
    </div>
</form>

        
        <div class="login-link">
            Already have an account? <a href="login.php" class="text-success">Log In</a>
        </div>
    </div>
     <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <ul class="footer-links">
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
        <div class="copyright">
          © 2025 ProFolio - Where you let your work shine and watch opportunities follow
        </div>
      </div>
    </div>
  </footer>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    
    <script>
        function togglePassword() {
            const passwordField = document.getElementById('password');
            const icon = document.querySelector('.password-toggle i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        }
        
        // Toggle service selection
function toggleService(serviceElement) {
    serviceElement.classList.toggle('selected');
    updateSelectedServices();
}

// Update the hidden input with selected services
function updateSelectedServices() {
    const selectedServices = document.querySelectorAll('.service-checkbox.selected');
    const servicesArray = Array.from(selectedServices).map(service => service.innerText);
    document.getElementById('services').value = servicesArray.join(',');
}
    </script>
</body>
</html>