<?php
session_start();
include_once("../connection/connection.php");
$con = connection();

if ($_SERVER["REQUEST_METHOD"] === "POST" && !isset($_POST['google_signup'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $con->prepare("SELECT * FROM _user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the hashed password
        if (password_verify($password, $user['password'])) {
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['id'] = $user['id'];


            $redirect = match ($user['role']) {
                'freelancer' => '../FreelancerDashboard/freelancerDashboard.php',
                'client' => 'client_dashboard.php',
                default => 'login.php'
            };

            header("Location: $redirect");
            exit();
        } else {
            $_SESSION['error'] = "Invalid email or password.";
        }
    } else {
        $_SESSION['error'] = "Invalid email or password.";
    }

    header("Location: login.php");
    exit();
}
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['google_signup'])) {
  header('Content-Type: application/json');

  $email = $_POST['email'];
  $firstName = $_POST['first_name'];
  $lastName = $_POST['last_name'];

  // Check if user exists
  $stmt = $con->prepare("SELECT * FROM _user WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
      $user = $result->fetch_assoc();
      $_SESSION['email'] = $user['email'];
      $_SESSION['role'] = $user['role'];
      $_SESSION['id'] = $user['id'];


      // Redirect based on role
      $redirect = match ($user['role']) {
          'freelancer' => '../FreelancerDashboard/freelancerDashboard.php',
          'client' => 'client_dashboard.php',
          default => 'login.php'
      };

      echo json_encode([
          'status' => 'redirect',
          'message' => 'Welcome back!',
          'redirect_url' => $redirect
      ]);
      exit();
  } else {
      // New user, redirect to registration
      $_SESSION['google_email'] = $email;
      $_SESSION['google_first_name'] = $firstName;
      $_SESSION['google_last_name'] = $lastName;

      echo json_encode([
          'status' => 'redirect',
          'message' => 'Complete your registration.',
          'redirect_url' => 'register.php'
      ]);
      exit();
  }
}

?>



   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProFolio - Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../CSS/login.css">
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
 
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
  <body>
  <!-- Login Container -->
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="login-container">
          <div class="login-box">
            <h2 class="login-title">Log in to ProFolio</h2>


            <?php if (isset($_SESSION['error'])): ?>
  <div class="alert alert-danger text-center" role="alert">
    <?php
      echo $_SESSION['error'];
      unset($_SESSION['error']);
    ?>
  </div>
<?php endif; ?>

            
            <form method="POST" action="login.php">
  <div class="input-with-icon">
    <i class="bi bi-person"></i>
    <input type="text" name="email" class="form-control" placeholder="Email" required>
  </div>
  <div class="input-with-icon">
    <i class="bi bi-lock"></i>
    <input type="password" name="password" class="form-control" placeholder="Password" required>
  </div>
  <div class="d-flex justify-content-between flex-wrap gap-2 align-items-center mb-3">
  <label class="remember-me m-0 d-flex align-items-center">
    <input type="checkbox" id="rememberMe" class="me-2">
    Remember me
  </label>
  <a href="#" class="forgot-password">Forgot password?</a>
</div>

                
  <button type="submit" class="btn login-btn">Continue</button>
</form>


            <div class="divider">
              <hr><span>or</span><hr>
            </div>

            <button type="button" class="btn google-signin-btn w-100 rounded" onclick="handleGoogleSignIn()">
  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo">
  Sign in with Google
</button>


            
            <div class="signup-link">
              <p>Don't have ProFolio account?</p>
              <button class="btn signup-btn"><a href="register.php" class="signup-link">Sign Up</a></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </body>
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

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script>
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
        window.location.href = "dashboard.php"; // redirect new user
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
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>


</html>     