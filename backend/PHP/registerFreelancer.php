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
    <title>ProFolio - Registration</title>
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/freelancer.css">




    
     <!-- Google Sign-In API -->
     <script src="https://accounts.google.com/gsi/client" async defer></script>
<script>
  window.onload = function () {
    google.accounts.id.initialize({
      client_id: '524108211758-ji1nlvkhu866ub9m7024aecundfrbu51.apps.googleusercontent.com', // replace with your actual client ID
      callback: handleCredentialResponse
    });
  };
</script>


    
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
        <h1 class="text-center mb-4">Sign up as a Freelancer</h1>
        <p class="text-muted">Sign up to showcase your expertise</p>
        
        

        <!-- Google Sign-In Button from Google -->
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
            <label for="firstName" class="form-label">First name<span style="color: red">*</span></label>
            <input type="text" class="form-control" id="firstName" name="first_name" required>
        </div>
        <div class="col-md-6">
            <label for="lastName" class="form-label">Last name<span style="color: red">*</span></label>
            <input type="text" class="form-control" id="lastName" name="last_name" required>
        </div>
    </div>

    <div class="mb-3">
        <label for="email" class="form-label">Email<span style="color: red">*</span></label>
        <input type="email" class="form-control" id="email" name="email" required>
    </div>

    <div class="mb-3 password-field">
        <label for="password" class="form-label">Password<span style="color: red">*</span></label>
        <input type="password" class="form-control" id="password" name="password" placeholder="Password (8 or more characters)" required >
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
        </select>
    </div>

    <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="marketingEmails">
        <label class="form-check-label" for="marketingEmails">
                    Send me helpful emails to find rewarding work and job leads.
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
    <script src="https://accounts.google.com/gsi/client" async defer></script>
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
    
        function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  window.onload = function () {
    google.accounts.id.initialize({
      client_id: '524108211758-ji1nlvkhu866ub9m7024aecundfrbu51.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    // Render the official Google button
    google.accounts.id.renderButton(
      document.getElementById("g_id_signin"),
      {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with"
      }
    );

   
  };

  function handleCredentialResponse(response) {
  const responsePayload = parseJwt(response.credential);

  const firstName = responsePayload.given_name || '';
  const lastName = responsePayload.family_name || '';
  const email = responsePayload.email;

  const params = new URLSearchParams();
  params.append("google_signup", "1");
  params.append("first_name", firstName);
  params.append("last_name", lastName);
  params.append("email", email);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    const res = JSON.parse(xhr.responseText);

    if (xhr.status === 200) {
      if (res.status === "success") {
        alert("Google Sign-Up Successful!");
        window.location.href = "../freelancerDashboard/freelancerDashboard.php"; // redirect new user
      } else if (res.status === "redirect") {
        alert(res.message);
        window.location.href = res.redirect_url; // redirect existing user to login.php
      } else {
        alert("Google Sign-Up Failed: " + res.message);
      }
    } else {
      alert("Something went wrong.");
    }
  }
};


  xhr.send(params.toString());
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
        console.log('Google profile:', profile);

        // Prepare data
        const params = new URLSearchParams();
        params.append("google_signup", "1");
        params.append("first_name", profile.given_name || '');
        params.append("last_name", profile.family_name || '');
        params.append("email", profile.email);

        // Send data to PHP backend
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    const res = JSON.parse(xhr.responseText);

    if (xhr.status === 200) {
      if (res.status === "success") {
        alert("Google Sign-Up Successful!");
        window.location.href = "../freelancerDashboard/freelancerDashboard.php"; // redirect new user
      } else if (res.status === "redirect") {
        alert(res.message);
        window.location.href = res.redirect_url; // redirect existing user to login.php
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