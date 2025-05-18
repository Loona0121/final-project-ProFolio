<?php
session_start();
include_once("../connection/connection.php");
$con = connection();

// Read raw JSON input for Google sign-in
$input = json_decode(file_get_contents('php://input'), true);

// Handle Google sign-in via ID token (sent as JSON)
if (isset($input['id_token'])) {
    header('Content-Type: application/json');

    $id_token = $input['id_token'];
    $tokenParts = explode(".", $id_token);

    if (count($tokenParts) === 3) {
        $payloadRaw = $tokenParts[1];
        $payloadDecoded = base64_decode(strtr($payloadRaw, '-_', '+/'));
        $payload = json_decode($payloadDecoded, true);

        if (is_array($payload) && isset($payload['email'])) {
            $email = $payload['email'];
            $firstName = $payload['given_name'] ?? '';
            $lastName = $payload['family_name'] ?? '';

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

                echo json_encode([
                    'status' => 'redirect',
                    'message' => 'Login successful',
                    'redirect_url' => ($user['role'] === 'freelancer') 
                        ? '../freelancerDashboard/freelancerDashboard.php' 
                        : '../clientDashboard/clientDashboard.php'
                ]);
                exit();
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'This Google account is not registered. Please sign up first.'
                ]);
                exit();
            }

        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid token payload.'
            ]);
            exit();
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid ID token format.'
        ]);
        exit();
    }
}

// Handle regular email/password login POST
if ($_SERVER["REQUEST_METHOD"] === "POST" && !isset($_POST['google_signup'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $con->prepare("SELECT * FROM _user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['id'] = $user['id'];

            $redirect = match ($user['role']) {
                'freelancer' => '../freelancerDashboard/freelancerDashboard.php',
                'client' => '../clientDashboard/clientDashboard.php',
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

// Handle Google signup POST (when user completes registration via Google data)
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['google_signup'])) {
    header('Content-Type: application/json');

    $email = $_POST['email'];
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];

    $stmt = $con->prepare("SELECT * FROM _user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['id'] = $user['id'];

        $redirect = match ($user['role']) {
            'freelancer' => '../freelancerDashboard/freelancerDashboard.php',
            'client' => '../clientDashboard/clientDashboard.php',
            default => 'login.php'
        };

        echo json_encode([
            'status' => 'redirect',
            'message' => 'Welcome!!',
            'redirect_url' => $redirect
        ]);
        exit();
    } else {
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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ProFolio - Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../CSS/login.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>

<body>
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
                <input type="text" name="email" class="form-control" placeholder="Email" required />
              </div>
              <div class="input-with-icon">
                <i class="bi bi-lock"></i>
                <input type="password" name="password" class="form-control" placeholder="Password" required />
              </div>
              <div class="d-flex justify-content-between flex-wrap gap-2 align-items-center mb-3">
                <label class="remember-me m-0 d-flex align-items-center">
                  <input type="checkbox" id="rememberMe" class="me-2" />
                  Remember me
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
              </div>
              <button type="submit" class="btn login-btn">Continue</button>
            </form>

            <div class="divider">
              <hr /><span>or</span><hr />
            </div>

            <div id="g_id_signin"></div>

            <div class="signup-link">
              <p>Don't have ProFolio account?</p>
              <button class="btn signup-btn">
                <a href="register.php" class="signup-link">Sign Up</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
    window.onload = function() {
      if (!google || !google.accounts || !google.accounts.id) {
        console.error('Google API not loaded');
        return;
      }

      google.accounts.id.initialize({
        client_id: '372847968979-0dgcp25f92k1hv95o4takpp3o6igj512.apps.googleusercontent.com',
        callback: handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById('g_id_signin'),
        { theme: 'outline', size: 'large', width: '100%' }
      );

      google.accounts.id.prompt();
    };

    function handleCredentialResponse(response) {
      console.log('Encoded JWT ID token:', response.credential);

      fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Google sign-in response:', data);
        if (data.status === 'redirect') {
          window.location.href = data.redirect_url;
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error('Error during Google sign-in:', err);
      });
    }
  </script>
</body>
</html>
