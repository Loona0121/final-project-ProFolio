// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Profile photo elements
    const profilePhotoInput = document.getElementById('profile-photo-input');
    const profilePhotoContainer = document.querySelector('.profile-photo');
    const sidebarUserAvatar = document.querySelector('.sidebar-user .user-avatar');
    
    // Form elements
    const saveChangesBtn = document.querySelector('.save-changes-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const jobTitleInput = document.querySelector('.info-input');
    const professionalSummary = document.querySelector('.profile-summary textarea');
    
    // Original values for cancel functionality
    let originalData = {
      jobTitle: jobTitleInput ? jobTitleInput.value : '',
      summary: professionalSummary ? professionalSummary.value : '',
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
            
            // Save to localStorage for persistence
            localStorage.setItem('profilePhoto', e.target.result);
          }
          
          reader.readAsDataURL(file);
        }
      });
    }
  
    // Save Changes functionality
    if (saveChangesBtn) {
      saveChangesBtn.addEventListener('click', function() {
        // Get all form values
        const newData = {
          jobTitle: jobTitleInput ? jobTitleInput.value : '',
          summary: professionalSummary ? professionalSummary.value : '',
        };
        
        // Update sidebar job title
        const userRoleElement = document.querySelector('.user-role');
        if (userRoleElement) {
          userRoleElement.textContent = newData.jobTitle;
        }
        
        // Save data to localStorage
        localStorage.setItem('freelancerProfile', JSON.stringify(newData));
        
        // Update original data reference
        originalData = {...newData};
        
        // Show success message
        showNotification('Profile updated successfully!');
      });
    }
  
    // Cancel Changes functionality
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        // Restore job title and summary
        if (jobTitleInput) jobTitleInput.value = originalData.jobTitle;
        if (professionalSummary) professionalSummary.value = originalData.summary;
        
        // Show canceled message
        showNotification('Changes discarded');
      });
    }
  
    // Show notification message
    function showNotification(message) {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'notification';
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
  
    // Load saved data from localStorage on page load
    function loadSavedData() {
      // Load profile data
      const savedProfile = localStorage.getItem('freelancerProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        
        // Restore values
        if (jobTitleInput) jobTitleInput.value = profileData.jobTitle;
        if (professionalSummary) professionalSummary.value = profileData.summary;
        
        const userRoleElement = document.querySelector('.user-role');
        if (userRoleElement) {
          userRoleElement.textContent = profileData.jobTitle;
        }
        
        // Set original data reference
        originalData = {...profileData};
      }
      
      // Load profile photo if exists
      const savedPhoto = localStorage.getItem('profilePhoto');
      if (savedPhoto) {
        // Create image element
        const img = document.createElement('img');
        img.src = savedPhoto;
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
    }
  
    // Initialize
    loadSavedData();
    
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
      
      .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Function to load profile data on any page
  function loadProfileDataGlobally() {
    // Get sidebar elements that exist on all pages
    const sidebarUserAvatar = document.querySelector('.sidebar-user .user-avatar');
    const userRoleElement = document.querySelector('.user-role');
  
    // Load profile data
    const savedProfile = localStorage.getItem('freelancerProfile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      
      // Update job title in sidebar
      if (profileData.jobTitle && userRoleElement) {
        userRoleElement.textContent = profileData.jobTitle;
      }
    }
  
    // Load profile photo if exists
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto && sidebarUserAvatar) {
      // Create image element
      const img = document.createElement('img');
      img.src = savedPhoto;
      img.alt = "Profile Photo";
      img.className = "profile-img";
      
      // Update sidebar avatar
      sidebarUserAvatar.innerHTML = '';
      sidebarUserAvatar.appendChild(img);
    }
  }
  
  // Call the function to load profile data on every page load
  document.addEventListener('DOMContentLoaded', function() {
    loadProfileDataGlobally();
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