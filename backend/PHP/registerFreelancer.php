<?php
include_once("../connection/connection.php");
$con = connection();

// Retrieve the role from the URL parameter
$role = isset($_GET['role']) ? $_GET['role'] : 'freelancer'; // Default to 'freelancer' if not provided

// Handle Google Sign-Up

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['google_signup'])) {
  $firstName = isset($_POST['first_name']) ? mysqli_real_escape_string($con, $_POST['first_name']) : '';
  $lastName = isset($_POST['last_name']) ? mysqli_real_escape_string($con, $_POST['last_name']) : '';
  $email = isset($_POST['email']) ? mysqli_real_escape_string($con, $_POST['email']) : '';
  $role = 'freelancer';

  if (!empty($email)) {
      $checkUserSql = "SELECT * FROM _user WHERE email = '$email'";
      $result = $con->query($checkUserSql);

      if ($result->num_rows === 0) {
        // No user yet – proceed with Google sign-up
        $sql = "INSERT INTO _user (first_name, last_name, email, password, country, role)
                VALUES ('$firstName', '$lastName', '$email', '', '', '$role')";
        $con->query($sql);
        echo json_encode(['status' => 'success', 'message' => 'Signed in with Google!']);
        exit;
    } else {
        // Email already exists – do NOT allow Google sign-up again
        echo json_encode([
          'status' => 'redirect',
          'message' => 'Email already registered. Redirecting to login...',
          'redirect_url' => 'login.php'
      ]);
      
        exit;
    }
    
  }

  // Final fallback to ensure this block does NOT fall through to regular registration
  exit;
}




if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve POST data
    $firstName = isset($_POST['first_name']) ? mysqli_real_escape_string($con, $_POST['first_name']) : '';
    $lastName = isset($_POST['last_name']) ? mysqli_real_escape_string($con, $_POST['last_name']) : '';
    $email = isset($_POST['email']) ? mysqli_real_escape_string($con, $_POST['email']) : '';
    $password = isset($_POST['password']) ? password_hash($_POST['password'], PASSWORD_DEFAULT) : '';
    $country = isset($_POST['country']) ? mysqli_real_escape_string($con, $_POST['country']) : '';

    // Check if the email already exists
    $checkEmailSql = "SELECT * FROM _user WHERE email = '$email'";
    $result = $con->query($checkEmailSql);

    if ($result->num_rows > 0) {
        echo "<script>alert('Email already exists. Please use a different email.');</script>";
    } else {
        // Insert the data if email doesn't exist
        $sql = "INSERT INTO _user (first_name, last_name, email, password, country, role)
                VALUES ('$firstName', '$lastName', '$email', '$password', '$country', '$role')";

        if ($con->query($sql)) {
            echo "<script>alert('Registration successful!'); window.location.href='../freelancerDashboard/freelancerDashboard.php';</script>";
        } else {
            echo "Error: " . $con->error;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProFolio - Freelancer Registration</title>
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .header-logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #1a4b84;
        }
        .header-logo span {
            color: #3aafa9;
        }
        .registration-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
            flex: 1;
        }
        .registration-container h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #1a4b84;
            text-align: center;
            margin-bottom: 0.5rem;
        }
        .registration-container p {
            font-size: 1.1rem;
            color: #666;
            text-align: center;
            margin-bottom: 2rem;
        }
        .google-signin-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background-color: white;
            border: 1px solid #ddd;
            padding: 0.75rem;
            font-size: 1rem;
            color: #333;
            transition: all 0.3s ease;
        }
        .google-signin-btn:hover {
            background-color: #f8f9fa;
            border-color: #1a4b84;
        }
        .google-signin-btn img {
            width: 20px;
            height: 20px;
        }
        .divider {
            text-align: center;
            margin: 2rem 0;
            position: relative;
        }
        .divider::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: #ddd;
            z-index: 0;
        }
        .divider span {
            background-color: white;
            padding: 0 1rem;
            position: relative;
            z-index: 1;
            color: #666;
        }
        .form-label {
            font-weight: 500;
            color: #333;
        }
        .form-control {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .form-control:focus {
            border-color: #1a4b84;
            box-shadow: 0 0 0 0.2rem rgba(26, 75, 132, 0.15);
        }
        .password-field {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #666;
        }
        .form-check-label {
            color: #666;
        }
        .form-check-input:checked {
            background-color: #1a4b84;
            border-color: #1a4b84;
        }
        .create-btn {
            background-color: #1a4b84;
            color: white;
            padding: 0.75rem;
            font-size: 1.1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: none;
            width: 100%;
            margin-top: 1.5rem;
        }
        .create-btn:hover {
            background-color: #153a66;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .login-link {
            text-align: center;
            margin-top: 1.5rem;
            color: #666;
        }
        .login-link a {
            color: #1a4b84;
            text-decoration: none;
            font-weight: 500;
        }
        .login-link a:hover {
            text-decoration: underline;
        }
        .footer {
            background-color: white;
            padding: 2rem 0;
            margin-top: auto;
        }
        .footer-content {
            text-align: center;
        }
        .footer-links {
            list-style: none;
            padding: 0;
            margin-bottom: 1rem;
        }
        .footer-links li {
            display: inline;
            margin: 0 1rem;
        }
        .footer-links a {
            color: #666;
            text-decoration: none;
        }
        .footer-links a:hover {
            color: #1a4b84;
        }
        .copyright {
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
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
        <h1>Sign up as a Freelancer</h1>
        <p>Join our community of talented professionals</p>
        
        <!-- Google Sign-In Button -->
        <button type="button" class="btn google-signin-btn w-100 rounded" onclick="handleGoogleSignIn()">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo">
            Sign in with Google
        </button>

        <!-- Divider -->
        <div class="divider">
            <span>or</span>
        </div>
        
        <!-- Registration Form -->
        <form method="POST" action="">
            <div class="row mb-3">
                <div class="col-md-6 mb-3 mb-md-0">
                    <label for="firstName" class="form-label">First name<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="firstName" name="first_name" required>
                </div>
                <div class="col-md-6">
                    <label for="lastName" class="form-label">Last name<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="lastName" name="last_name" required>
                </div>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Email<span class="text-danger">*</span></label>
                <input type="email" class="form-control" id="email" name="email" required>
            </div>

            <div class="mb-3">
  <label for="password" class="form-label">
    Password <span class="text-danger">*</span>
  </label>

  <div class="position-relative">
    <input type="password" class="form-control pe-5" id="password" name="password" placeholder="Password (8 or more characters)" required>
    <span class="password-toggle" onclick="togglePassword()">
      <i class="far fa-eye-slash"></i>
    </span>
  </div>
</div>


            <div class="mb-3">
                <label for="country" class="form-label">Country<span class="text-danger">*</span></label>
                <select class="form-select" id="country" name="country" required>
                    <option value="Philippines" selected>Philippines</option>
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                </select>
            </div>

            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="marketingEmails">
                <label class="form-check-label" for="marketingEmails">
                    Send me helpful emails to find rewarding projects and opportunities.
                </label>
            </div>

            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="termsAgree" required>
                <label class="form-check-label" for="termsAgree">
                    Yes, I understand and agree to the ProFolio <a href="#" class="text-success">Terms of Service</a>, including the <a href="#" class="text-success">User Agreement</a> and <a href="#" class="text-success">Privacy Policy</a>.
                </label>
            </div>

            <button type="submit" class="btn create-btn">Create my account</button>
        </form>
        
        <div class="login-link">
            Already have an account? <a href="login.php">Log In</a>
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
                    © 2025 ProFolio - Where talent meets opportunity
                </div>
            </div>
        </div>
    </footer>

    <!-- Google Sign-In API -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const icon = document.querySelector('.password-toggle i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        }

        function handleGoogleSignIn() {
            const client = google.accounts.oauth2.initTokenClient({
                client_id: '524108211758-ji1nlvkhu866ub9m7024aecundfrbu51.apps.googleusercontent.com',
                scope: 'profile email',
                callback: (response) => {
                    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: {
                            'Authorization': `Bearer ${response.access_token}`
                        }
                    })
                    .then(res => res.json())
                    .then(profile => {
                        const params = new URLSearchParams();
                        params.append("google_signup", "1");
                        params.append("first_name", profile.given_name || '');
                        params.append("last_name", profile.family_name || '');
                        params.append("email", profile.email);

                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", "", true);
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                const res = JSON.parse(xhr.responseText);
                                if (xhr.status === 200) {
                                    if (res.status === "success") {
                                        alert("Google Sign-Up Successful!");
                                        window.location.href = "../freelancerDashboard/freelancerDashboard.php";
                                    } else if (res.status === "redirect") {
                                        alert(res.message);
                                        window.location.href = res.redirect_url;
                                    } else {
                                        alert("Google Sign-Up Failed: " + res.message);
                                    }
                                } else {
                                    alert("Something went wrong.");
                                }
                            }
                        };

                        xhr.send(params.toString());
                    });
                }
            });

            client.requestAccessToken();
        }
    </script>
</body>
</html>