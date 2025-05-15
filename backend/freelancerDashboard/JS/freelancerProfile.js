document.addEventListener('DOMContentLoaded', function() {
  // Profile photo elements
  const profilePhotoInput = document.getElementById('profile-photo-input');
  const profilePhotoContainer = document.querySelector('.profile-photo');
  const sidebarUserAvatar = document.querySelector('.sidebar-user .user-avatar');
  
  // Form elements
  const profileForm = document.getElementById('profile-form');
  const cancelBtn = document.querySelector('.cancel-btn');
  const jobTitleInput = document.querySelector('input[name="job_title"]');
  const professionalSummary = document.querySelector('textarea[name="summary"]');
  
  // Original values for cancel functionality
  let originalData = {
    jobTitle: jobTitleInput ? jobTitleInput.value : '',
    summary: professionalSummary ? professionalSummary.value : '',
    photoSrc: profilePhotoContainer ? profilePhotoContainer.querySelector('img')?.src : null
  };

  // Profile Photo Upload Handler
  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Create image element to replace the icon
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = "Profile Photo";
          img.className = "profile-img";
          
          // Update main profile photo
          if (profilePhotoContainer) {
            profilePhotoContainer.innerHTML = '';
            profilePhotoContainer.appendChild(img);
          }
          
          // Update sidebar avatar
          if (sidebarUserAvatar) {
            sidebarUserAvatar.innerHTML = '';
            const sidebarImg = img.cloneNode(true);
            sidebarUserAvatar.appendChild(sidebarImg);
          }
        }
        
        reader.readAsDataURL(file);
      }
    });
  }

  // Form submission handler to update user information
  if (profileForm) {
    profileForm.addEventListener('submit', function(event) {
      // Let the form submit normally, but update UI immediately
      const jobTitle = jobTitleInput ? jobTitleInput.value : '';
      
      // Always update the sidebar job title for immediate feedback, even if empty
      const sidebarJobTitle = document.querySelector('.sidebar-user .user-info .info-value:nth-child(2)');
      if (sidebarJobTitle) {
        sidebarJobTitle.textContent = jobTitle;
      }
      
      // Force a reload parameter to bust cache
      const timestamp = new Date().getTime();
      const formAction = `${profileForm.action}${profileForm.action.includes('?') ? '&' : '?'}cache_bust=${timestamp}`;
      profileForm.action = formAction;
    });
  }

  // Cancel Changes functionality
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Restore job title and summary
      if (jobTitleInput) jobTitleInput.value = originalData.jobTitle;
      if (professionalSummary) professionalSummary.value = originalData.summary;
      
      // Restore original photo if it was changed
      if (profilePhotoContainer && originalData.photoSrc) {
        const currentImg = profilePhotoContainer.querySelector('img');
        if (currentImg && currentImg.src !== originalData.photoSrc) {
          currentImg.src = originalData.photoSrc;
          
          // Also restore sidebar avatar
          if (sidebarUserAvatar) {
            const sidebarImg = sidebarUserAvatar.querySelector('img');
            if (sidebarImg) {
              sidebarImg.src = originalData.photoSrc;
            }
          }
        }
      }
      
      // Show canceled message
      showNotification('Changes discarded', 'warning');
    });
  }

  // Helper function to show notifications
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Force refresh on page load to ensure latest data
  if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
    // User navigated using back/forward buttons, force a refresh
    window.location.reload(true);
  }

  // Add basic CSS for notifications
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .notification.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .notification.warning {
      background-color: #ff9800;
    }
    
    .notification.error {
      background-color: #f44336;
    }
    
    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  `;
  document.head.appendChild(style);
});

// Function to display current date in the header
document.addEventListener('DOMContentLoaded', function() {
  // Get current date
  const now = new Date();
  
  // Format options for date display
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  // Format and display the date
  const formattedDate = now.toLocaleDateString('en-US', options);
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    currentDateElement.textContent = formattedDate;
  }
});

// Remove the functions that rely on localStorage
