// Logout Microinteractions
document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutBtn = document.getElementById('pf-confirm-logout');
    const cancelLogoutBtn = document.getElementById('pf-cancel-logout');
    const logoutCard = document.querySelector('.pf-logout-card');
    const logoutContent = document.querySelector('.pf-logout-content');
    const logoutMessage = document.querySelector('.pf-logout-message');
    const logoutTitle = document.querySelector('.pf-logout-title');
    const logoutButtons = document.querySelector('.pf-logout-buttons');
    const logoutIcon = document.querySelector('.pf-logout-icon i');
  
    // Only execute if we're on the logout page
    if (confirmLogoutBtn && cancelLogoutBtn && logoutCard) {
      // Cancel logout with a clean slide-down transition
      cancelLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add a slide-down animation
        logoutCard.classList.add('slide-down-animation');
        
        // Fade out the content
        logoutCard.style.opacity = '0';
        logoutCard.style.transform = 'translateY(20px)';
        
        // After animation, return to the previous page
        setTimeout(() => {
          window.history.back();
        }, 400);
      });
  
      // Confirm logout with loading animation
      confirmLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Change button state
        confirmLogoutBtn.classList.add('loading');
        confirmLogoutBtn.textContent = 'Logging out...';
        confirmLogoutBtn.disabled = true;
        cancelLogoutBtn.style.display = 'none';
        
        // Change icon to loading spinner
        logoutIcon.classList.remove('fa-sign-out-alt');
        logoutIcon.classList.add('fa-spinner', 'fa-spin');
        
        // Update message
        logoutTitle.textContent = 'Signing Out';
        logoutMessage.textContent = 'Securely ending your session...';
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'pf-logout-progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'pf-logout-progress-bar';
        
        progressContainer.appendChild(progressBar);
        logoutButtons.before(progressContainer);
        
        // Animate progress bar
        let width = 0;
        const interval = setInterval(() => {
          if (width >= 100) {
            clearInterval(interval);
            
            // Show brief success message
            logoutIcon.classList.remove('fa-spinner', 'fa-spin');
            logoutIcon.classList.add('fa-check-circle');
            logoutTitle.textContent = 'Logged Out';
            logoutMessage.textContent = 'You have been securely logged out.';
            
            // Hide the buttons completely
            logoutButtons.style.display = 'none';
            
            // Automatically redirect to login page after brief success message
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 800);
          } else {
            width += 2;
            progressBar.style.width = width + '%';
          }
        }, 20);
      });
  
      // Add subtle hover effects to buttons
      [confirmLogoutBtn, cancelLogoutBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.classList.add('btn-hover');
        });
        
        btn.addEventListener('mouseleave', () => {
          btn.classList.remove('btn-hover');
        });
      });
  
      // Add focus effects for accessibility
      [confirmLogoutBtn, cancelLogoutBtn].forEach(btn => {
        btn.addEventListener('focus', () => {
          btn.classList.add('btn-focus');
        });
        
        btn.addEventListener('blur', () => {
          btn.classList.remove('btn-focus');
        });
      });
    }
  });
  
  // Add these CSS styles for logout page
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
      .pf-logout-progress-container {
        width: 100%;
        height: 6px;
        background-color: #e0e0e0;
        border-radius: 3px;
        margin: 20px 0;
        overflow: hidden;
      }
      
      .pf-logout-progress-bar {
        height: 100%;
        width: 0;
        background: linear-gradient(90deg, #4a88e5, #6e4ae5);
        border-radius: 3px;
        transition: width 0.1s ease;
      }
      
      .pf-btn-logout.loading {
        background-color: #7a7a7a;
        cursor: wait;
      }
      
      .btn-hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0,0,0,0.08);
        transition: all 0.2s ease;
      }
      
      .btn-focus {
        outline: 2px solid rgba(74, 136, 229, 0.5);
      }
      
      .pf-logout-card {
        transition: all 0.4s ease;
      }
      
      .slide-down-animation {
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      
      .pf-logout-icon i {
        transition: all 0.3s ease;
      }
      
      .fa-check-circle {
        color: #28a745;
      }
    `;
    document.head.appendChild(style);
  });