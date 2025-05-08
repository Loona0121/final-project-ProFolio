/**
 * ProFolio - Dashboard JavaScript
 * This file contains all JavaScript functionality specific to the freelancer dashboard page.
 */

// DOM Content Loaded Event Handler
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
  
    // Load profile data from localStorage for the sidebar
    loadProfileDataGlobally();
  });
  
  /**
   * Function to load profile data on any page, including the dashboard
   * This updates the sidebar user avatar and job title based on localStorage data
   */
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
  
  // Add basic CSS for profile photo
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
      .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);
  });