<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProFolio - Register</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/register.css">

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
    
    <div class="container main-container">
        <div class="row mb-4">
            <div class="col-12">
            </div>
        </div>
        <h1 class="heading">Join Pro<span>Folio</span></h1>
        <p class="subtitle">Showcase your talent, land your dream projects.</p>
        
        <div class="row card-container">
            <div class="col-md-4 mb-4">
                <div class="role-card" id="client-card" onclick="selectRole('client')">
                    <div class="role-selector">
                        <div class="radio-custom" id="client-radio"></div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <div class="role-icon">
                            <i class="bi bi-briefcase"></i>👔
                        </div>
                    </div>
                    <h2 class="role-title">I'm a client</h2>
                    <div class="role-subtitle">hiring for a project</div>
                </div>
            </div>
            
            <div class="col-md-4 mb-4">
                <div class="role-card" id="freelancer-card" onclick="selectRole('freelancer')">
                    <div class="role-selector">
                        <div class="radio-custom" id="freelancer-radio"></div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <div class="role-icon">
                            <i class="bi bi-person"></i>👤
                        </div>
                    </div>
                    <h2 class="role-title">I'm a freelancer</h2>
                    <div class="role-subtitle">looking for work</div>
                </div>
            </div>
            
            <div class="col-md-4 mb-4">
                <div class="role-card" id="agency-card" onclick="selectRole('agency')">
                    <div class="role-selector">
                        <div class="radio-custom" id="agency-radio"></div>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <div class="role-icon">
                            <i class="bi bi-building"></i>🏢
                        </div>
                    </div>
                    <h2 class="role-title">I'm a business owner</h2>
                    <div class="role-subtitle">showcasing my agency</div>
                </div>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-6 text-center">
                <button id="create-btn" class="btn btn-create btn-lg w-100" onclick="createAccount()">Create Account</button>
            </div>
        </div>

        <div class="login-text">
            Already have an account? <a href="login.php" class="login-link">Log In</a>
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

    <!-- Bootstrap JS -->
    <script>
    function selectRole(role) {
        // Clear all previous role selections
        document.getElementById('client-card').classList.remove('selected');
        document.getElementById('freelancer-card').classList.remove('selected');
        document.getElementById('agency-card').classList.remove('selected');

        // Highlight selected card
        document.getElementById(role + '-card').classList.add('selected');

        const createBtn = document.getElementById('create-btn');

        // Change button behavior depending on selected role
        if (role === 'client') {
            createBtn.style.backgroundColor = '#1a4b84';
            createBtn.style.color = '#ffffff';
            createBtn.onclick = function () {
                window.location.href = 'registerClient.php';
            };
        } else if (role === 'freelancer') {
            createBtn.style.backgroundColor = '#1a4b84';
            createBtn.style.color = '#ffffff';
            createBtn.onclick = function () {
                window.location.href = 'registerFreelancer.php';
            };
        } else if (role === 'agency') {
            createBtn.style.backgroundColor = '#1a4b84';
            createBtn.style.color = '#ffffff';
            createBtn.onclick = function () {
                window.location.href = 'registerAgency.php';
            };
        }
    }

    function createAccount() {
        // Optional fallback logic if needed when no role is selected
    }
</script>


</body>
</html>
