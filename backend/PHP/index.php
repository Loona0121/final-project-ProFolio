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
    <style>
        body {
            font-family: 'Poppins', 'Montserrat', 'Open Sans', Arial, sans-serif;
            background: #f6f8fa;
            color: #222;
        }
        /* Hero Section */
        .hero {
            background: linear-gradient(120deg, #1a4b84 60%, #3aafa9 100%), url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat;
            color: #fff;
            padding: 6rem 0 5rem 0;
            position: relative;
            min-height: 60vh;
            display: flex;
            align-items: center;
        }
        /* Remove double overlay, use only one for clarity */
        .hero::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(26,75,132,0.75); /* Single, strong overlay */
            z-index: 1;
        }
        .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            max-width: 700px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        .hero-content h1 {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: -1px;
            text-shadow: 0 2px 8px rgba(26,75,132,0.18);
        }
        .hero-content p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.97;
            text-shadow: 0 1px 6px rgba(26,75,132,0.12);
        }
        .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .hero-buttons .btn-primary {
            background: #3aafa9;
            border: none;
            font-weight: 600;
            font-size: 1.1rem;
            padding: 0.75rem 2.5rem;
            border-radius: 30px;
            box-shadow: 0 4px 24px rgba(58,175,169,0.15);
            transition: background 0.2s, transform 0.2s;
        }
        .hero-buttons .btn-primary:hover {
            background: #1a4b84;
            transform: translateY(-2px) scale(1.03);
        }
        .hero-buttons .btn-secondary {
            background: rgba(255,255,255,0.15);
            color: #fff;
            border: 1px solid #fff;
            font-weight: 500;
            border-radius: 30px;
            padding: 0.75rem 2.5rem;
            transition: background 0.2s, color 0.2s;
        }
        .hero-buttons .btn-secondary:hover {
            background: #fff;
            color: #1a4b84;
        }
        /* How It Works */
        .how-it-works {
            background: #fff;
            padding: 4.5rem 0 2.5rem 0;
        }
        .how-it-works .section-header h2 {
            font-weight: 700;
            color: #1a4b84;
        }
        .steps {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2.5rem;
            margin-top: 2.5rem;
        }
        .step {
            background: #f6f8fa;
            border-radius: 18px;
            box-shadow: 0 2px 16px rgba(58,175,169,0.07);
            padding: 2.2rem 1.5rem;
            width: 320px;
            text-align: center;
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative;
            overflow: visible;
            cursor: pointer;
            margin-bottom: 0;
        }
        .step:not(:last-child) {
            margin-bottom: 0;
        }
        .step:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 8px 32px rgba(26,75,132,0.13);
        }
        .step-icon {
            font-size: 2.5rem;
            color: #3aafa9;
            margin-bottom: 1rem;
        }
        .step h3 {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1a4b84;
            margin-bottom: 0.5rem;
        }
        .step p {
            color: #444;
            font-size: 1.05rem;
        }
        /* User Segments */
        .user-segments {
            background: linear-gradient(120deg, #f6f8fa 60%, #eaf6f6 100%);
            padding: 4.5rem 0 2.5rem 0;
        }
        .row.g-4 {
            margin-left: 0;
            margin-right: 0;
        }
        .card-user-type {
            border: none;
            border-radius: 18px;
            box-shadow: 0 2px 16px rgba(26,75,132,0.07);
            transition: transform 0.2s, box-shadow 0.2s;
            background: #fff;
            margin-bottom: 0;
        }
        .card-user-type:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 8px 32px rgba(58,175,169,0.13);
        }
        .card-user-type h3 {
            color: #3aafa9;
            font-weight: 700;
        }
        .icon-container {
            background: #eaf6f6;
            border-radius: 50%;
            padding: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card-user-type p {
            color: #444;
            font-size: 1.05rem;
        }
        /* CTA Section */
        .cta-section {
            background: linear-gradient(120deg, #1a4b84 60%, #3aafa9 100%);
            color: #fff;
            padding: 4rem 0 3rem 0;
            text-align: center;
        }
        .cta-section h2 {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        .cta-section p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        .cta-section .btn-primary {
            background: #fff;
            color: #1a4b84;
            font-weight: 700;
            border-radius: 30px;
            padding: 0.75rem 2.5rem;
            font-size: 1.1rem;
            border: none;
            box-shadow: 0 4px 24px rgba(255,255,255,0.15);
            transition: background 0.2s, color 0.2s;
        }
        .cta-section .btn-primary:hover {
            background: #3aafa9;
            color: #fff;
        }
        /* Footer */
        footer {
            background: #1a4b84;
            color: #fff;
            padding: 2.5rem 0 1rem 0;
        }
        .footer-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto 1.5rem auto;
        }
        .footer-column h3 {
            color: #3aafa9;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        .footer-column ul {
            padding: 0;
            list-style: none;
        }
        .footer-column ul li a {
            color: #fff;
            opacity: 0.85;
            transition: color 0.2s, opacity 0.2s;
        }
        .footer-column ul li a:hover {
            color: #3aafa9;
            opacity: 1;
        }
        .footer-bottom {
            text-align: center;
            color: #eaf6f6;
            font-size: 0.95rem;
            opacity: 0.8;
        }
        /* Animations */
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.8s forwards;
        }
        .fade-in.delay-1 { animation-delay: 0.2s; }
        .fade-in.delay-2 { animation-delay: 0.4s; }
        .fade-in.delay-3 { animation-delay: 0.6s; }
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: none;
            }
        }
        @media (max-width: 991px) {
            .steps { flex-direction: column; align-items: center; }
            .footer-content { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 600px) {
            .hero-content h1 { font-size: 2rem; }
            .cta-section h2 { font-size: 1.5rem; }
            .hero { padding: 3.5rem 0 2.5rem 0; min-height: 40vh; }
            .how-it-works, .user-segments { padding: 2.5rem 0 1.5rem 0; }
        }
    </style>
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
        <div class="hero-content fade-in">
            <h1>Showcase Your Talent. Connect. Grow.</h1>
            <p>Build a stunning portfolio, connect with clients, and take your freelance career to the next level—all in one place.</p>
            <div class="hero-buttons">
                <a href="register.php" class="btn btn-primary">Get Started</a>
                <a href="login.php" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    </div>
</section>
<!-- How It Works Section -->
<section class="section how-it-works">
    <div class="container">
        <div class="section-header text-center">
            <h2>How ProFolio Works</h2>
            <p>Three simple steps to connect freelancers with clients</p>
        </div>
        <div class="steps">
            <div class="step fade-in delay-1">
                <div class="step-icon">
                    <i class="fas fa-user-edit"></i>
                </div>
                <h3>Create Your Profile</h3>
                <p>Build a portfolio that showcases your skills, experience, and past work samples.</p>
            </div>
            <div class="step fade-in delay-2">
                <div class="step-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Get Discovered</h3>
                <p>Clients search for talented freelancers with your specific skills and expertise.</p>
            </div>
            <div class="step fade-in delay-3">
                <div class="step-icon">
                    <i class="fas fa-handshake"></i>
                </div>
                <h3>Connect & Collaborate</h3>
                <p>Connect with clients, collaborate on projects, and build your professional network.</p>
            </div>
        </div>
    </div>
</section>
<!-- User Segments Section -->
<section class="user-segments">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="fw-bold">Who Benefits from ProFolio?</h2>
            <p class="text-muted">Designed for freelancers and clients</p>
        </div>
        <div class="row g-4 justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="card card-user-type h-100 fade-in delay-1">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-container me-3">
                                <i class="fas fa-laptop-code fa-2x text-primary"></i>
                            </div>
                            <h3>Freelancers</h3>
                        </div>
                        <p>Showcase your skills and past projects to attract new opportunities. Build a professional portfolio that highlights your expertise and experience.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-5">
                <div class="card card-user-type h-100 fade-in delay-2">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="icon-container me-3">
                                <i class="fas fa-user-tie fa-2x text-primary"></i>
                            </div>
                            <h3>Clients</h3>
                        </div>
                        <p>Find talented freelancers for your projects. Browse through detailed portfolios and connect with professionals who match your requirements.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <h2 class="fw-bold mb-4">Ready to Start Your Journey?</h2>
        <p class="lead mb-4">Join our community of talented freelancers and clients</p>
        <a href="register.php" class="btn btn-primary btn-lg px-5">Get Started</a>
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
                <h3>For Freelancers</h3>
                <ul>
                    <li><a href="#">Create Portfolio</a></li>
                    <li><a href="#">Browse Projects</a></li>
                    <li><a href="#">Success Stories</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>For Clients</h3>
                <ul>
                    <li><a href="#">Post a Project</a></li>
                    <li><a href="#">Find Talent</a></li>
                    <li><a href="#">How It Works</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Resources</h3>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Community Forums</a></li>
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