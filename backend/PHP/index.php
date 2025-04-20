<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProFolio - Showcase Your Work</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Poppins:wght@400;500&display=swap">
    <link rel="stylesheet" href="../CSS/index.css">
</head>
<body>
<!-- Header -->
<header>
    <div class="container">
        <nav class="navbar">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-diamond"></i>
                </div>
                Pro<span>Folio</span>
            </div>
            <div class="auth-buttons">
                <a href="login.php" class="btn btn-secondary">Log In</a>
                <a href="register.php" class="btn btn-primary">Register</a>
            </div>
            <div class="mobile-menu">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </div>
</header>
<!-- Hero Section -->
<section class="hero">
    <div class="container">
        <div class="hero-content">
            <h1>Where your work shines and watch opportunities follow</h1>
            <p>Build your professional portfolio and connect with clients and employers to take your career to the next level.</p>
            <div class="hero-buttons">
                <a href="login.php" class="btn btn-primary">Get Started</a>
                <a href="login.php" class="btn btn-secondary">Learn more</a>
            </div>
        </div>
    </div>
</section>
<!-- How It Works Section -->
<section class="section how-it-works">
    <div class="container">
        <div class="section-header">
            <h2>How ProFolio Works</h2>
            <p>Three simple steps to connect your skills with opportunities</p>
        </div>
        <div class="steps">
            <div class="step">
                <div class="step-icon">
                    <i class="fas fa-user-edit"></i>
                </div>
                <h3>Create Your Profile</h3>
                <p>Build a portfolio that showcases your skills, experience, and past work samples.</p>
            </div>
            <div class="step">
                <div class="step-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Get Discovered</h3>
                <p>Clients and employers search for professionals with your specific skills and expertise.</p>
            </div>
            <div class="step">
                <div class="step-icon">
                    <i class="fas fa-handshake"></i>
                </div>
                <h3>Connect & Collaborate</h3>
                <p>Receive job offers, collaborate on projects, and build your professional network.</p>
            </div>
        </div>
    </div>
</section>
 <!-- User Segments Section -->
 <section class="py-5 bg-light">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="fw-bold">Who Benefits from ProFolio?</h2>
            <p class="text-muted">Designed for professionals across different career paths</p>
        </div>
        <div class="row g-4">
            <!-- First row -->
            <div class="col-md-6">
                <div class="card card-user-type h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-container me-3">
                                <i class="fas fa-laptop-code fa-2x text-primary"></i>
                            </div>
                            <h3>Freelancers</h3>
                        </div>
                        <p>Showcase your skills, past projects, and client reviews to attract new opportunities.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card card-user-type h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-container me-3">
                                <i class="fas fa-search fa-2x text-primary"></i>
                            </div>
                            <h3>Job Seekers</h3>
                        </div>
                        <p>Stand out from traditional resumes by demonstrating your capabilities through real work samples.</p>
                    </div>
                </div>
            </div>
            
            <!-- Second row -->
            <div class="col-md-6">
                <div class="card card-user-type h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-container me-3">
                                <i class="fas fa-building fa-2x text-primary"></i>
                            </div>
                            <h3>Businesses</h3>
                        </div>
                        <p>Create dedicated pages to showcase your services, past projects, and key team members. This helps potential clients see what your business offers.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card card-user-type h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-container me-3">
                                <i class="fas fa-user-tie fa-2x text-primary"></i>
                            </div>
                            <h3>Clients & Recruiters</h3>
                        </div>
                        <p>Search filters help narrow down candidates based on skills, location, and job type. Connect with verified professionals easily.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- CTA Section -->
<section class="py-5 bg-light">
    <div class="container text-center">
        <h2 class="fw-bold mb-4">Ready to Showcase Your Talents?</h2>
        <p class="lead mb-4">Join thousands of professionals who are using ProFolio to advance their careers</p>
        <a href="register.php" class="btn btn-primary btn-lg px-5">Create Your Portfolio</a>
    </div>
</section>

<!-- Footer -->
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-column">
                <h3>ProFolio</h3>
                <p>Showcase your talent, land your dream projects.</p>
            </div>
            <div class="footer-column">
                <h3>For Professionals</h3>
                <ul>
                    <li><a href="#">Create Portfolio</a></li>
                    <li><a href="#">Browse Jobs</a></li>
                    <li><a href="#">Success Stories</a></li>
                    <li><a href="#">Pricing</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>For Clients</h3>
                <ul>
                    <li><a href="#">Post a Job</a></li>
                    <li><a href="#">Find Talent</a></li>
                    <li><a href="#">Enterprise Solutions</a></li>
                    <li><a href="#">Client Reviews</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Resources</h3>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Community Forums</a></li>
                    <li><a href="#">Webinars</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Company</h3>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 ProFolio. All rights reserved.</p>
        </div>
    </div>
</footer>
</body>
</html>