<?php
session_start();
include_once("../connection/connection.php");
$con = connection();
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProFolio - Join Our Community</title>
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
        .main-container {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 2rem;
            flex: 1;
        }
        .heading {
            font-size: 2.5rem;
            font-weight: bold;
            color: #1a4b84;
            text-align: center;
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #666;
            text-align: center;
            margin-bottom: 3rem;
        }
        .card-container {
            margin-bottom: 2rem;
        }
        .role-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid #e9ecef;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        .role-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border-color: #1a4b84;
        }
        .role-card.selected {
            border-color: #1a4b84;
            background-color: #f8f9fa;
        }
        .role-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #1a4b84;
        }
        .role-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a4b84;
            margin-bottom: 0.5rem;
        }
        .role-subtitle {
            color: #666;
            font-size: 1rem;
        }
        .btn-create {
            background-color: #1a4b84;
            color: white;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            border: none;
            opacity: 0.7;
        }
        .btn-create:hover {
            background-color: #153a66;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .btn-create.active {
            opacity: 1;
        }
        .login-text {
            text-align: center;
            margin-top: 2rem;
            color: #666;
        }
        .login-link {
            color: #1a4b84;
            text-decoration: none;
            font-weight: 500;
        }
        .login-link:hover {
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

    <div class="container main-container">
        <h1 class="heading">Join Pro<span>Folio</span></h1>
        <p class="subtitle">Connect with top talent or find your next project</p>
        
        <div class="row card-container">
            <div class="col-md-6 mb-4">
                <div class="role-card" id="client-card" onclick="selectRole('client')">
                    <div class="role-icon">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <h2 class="role-title">I'm a Client</h2>
                    <div class="role-subtitle">Looking to hire talented freelancers for my projects</div>
                </div>
            </div>
            
            <div class="col-md-6 mb-4">
                <div class="role-card" id="freelancer-card" onclick="selectRole('freelancer')">
                    <div class="role-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h2 class="role-title">I'm a Freelancer</h2>
                    <div class="role-subtitle">Ready to showcase my skills and find new opportunities</div>
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
                    © 2025 ProFolio - Where talent meets opportunity
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS + Custom JS -->
    <script>
    function selectRole(role) {
        // Remove selection from all cards
        document.getElementById('client-card').classList.remove('selected');
        document.getElementById('freelancer-card').classList.remove('selected');

        // Add selection to the chosen role
        document.getElementById(role + '-card').classList.add('selected');

        const createBtn = document.getElementById('create-btn');
        createBtn.classList.add('active');
        createBtn.style.backgroundColor = '#1a4b84';
        createBtn.style.color = '#ffffff';

        // Set destination based on role
        if (role === 'client') {
            createBtn.onclick = function () {
                window.location.href = 'registerClient.php';
            };
        } else if (role === 'freelancer') {
            createBtn.onclick = function () {
                window.location.href = 'registerFreelancer.php';
            };
        }
    }

    function createAccount() {
        // Show alert if no role is selected
        if (!document.querySelector('.role-card.selected')) {
            alert('Please select whether you are a client or freelancer');
        }
    }
    </script>
</body>
</html>
