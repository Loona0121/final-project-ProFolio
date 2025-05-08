document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutBtn = document.getElementById('pf-confirm-logout');
    const cancelLogoutBtn = document.getElementById('pf-cancel-logout');
    const logoutCard = document.querySelector('.pf-logout-card');
    const logoutIcon = document.querySelector('.pf-logout-icon i');
    const logoutTitle = document.querySelector('.pf-logout-title');
    const logoutMessage = document.querySelector('.pf-logout-message');
    const logoutButtons = document.querySelector('.pf-logout-buttons');
  
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
  
            // Loading animation
            confirmLogoutBtn.classList.add('loading');
            confirmLogoutBtn.textContent = 'Logging out...';
            confirmLogoutBtn.disabled = true;
            cancelLogoutBtn.style.display = 'none';
  
            logoutIcon.classList.remove('fa-sign-out-alt');
            logoutIcon.classList.add('fa-spinner', 'fa-spin');
  
            logoutTitle.textContent = 'Signing Out';
            logoutMessage.textContent = 'Securely ending your session...';
  
            // Progress bar
            const progressContainer = document.createElement('div');
            progressContainer.className = 'pf-logout-progress-container';
            const progressBar = document.createElement('div');
            progressBar.className = 'pf-logout-progress-bar';
            progressContainer.appendChild(progressBar);
            logoutButtons.before(progressContainer);
  
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
  
                    // Adding a short delay to let the progress bar complete before redirect
                    setTimeout(() => {
                        // Redirect to PHP logout, which handles session destruction
                        localStorage.clear();
                        window.location.href = 'logout.php'; // Use the correct logout script
                       
                    }, 500); // Delay of 500ms before redirecting
                } else {
                    width += 2;
                    progressBar.style.width = width + '%';
                }
            }, 20);
            
        });
        
    }
  
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
  
            // Cancel animation and go back to the dashboard
            logoutCard.style.opacity = '0';
            logoutCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                window.location.href = 'freelancerDashboard.php';  // Go back to the freelancer dashboard
            }, 400);
        });
    }
  });
  