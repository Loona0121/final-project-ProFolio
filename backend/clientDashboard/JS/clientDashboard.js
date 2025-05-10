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
  document.getElementById('current-date').textContent = formattedDate;
  
  // Update user information from localStorage
  updateUserInfoFromStorage();
  
  // Listen for changes to the local storage
  window.addEventListener('storage', function(event) {
    if (event.key === 'profileData' || event.key === 'profilePhoto') {
      updateUserInfoFromStorage();
    }
  });
  
  // Function to update user information from localStorage
  function updateUserInfoFromStorage() {
    // Update user name and role in sidebar
    const sidebarName = document.querySelector('.sidebar .user-name');
    const sidebarRole = document.querySelector('.sidebar .user-role');
    const welcomeTitle = document.querySelector('.welcome-title');
    
    // Get saved profile data
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      const profileData = JSON.parse(savedData);
      
      // Update sidebar
      if (sidebarName) {
        sidebarName.textContent = profileData.fullName || 'Aran Joshua';
      }
      
      if (sidebarRole) {
        sidebarRole.textContent = profileData.company && profileData.company.trim() !== '' ? 
          profileData.company : 'Client';
      }
      
      // Update welcome message
      if (welcomeTitle) {
        const firstName = profileData.fullName ? profileData.fullName.split(' ')[0] : 'Aran';
        welcomeTitle.textContent = `Welcome, ${firstName}!`;
      }
    }
    
    // Update profile photo
    const sidebarAvatar = document.querySelector('.sidebar .user-avatar');
    const savedPhoto = localStorage.getItem('profilePhoto');
    
    if (savedPhoto && sidebarAvatar) {
      if (sidebarAvatar.querySelector('img')) {
        sidebarAvatar.querySelector('img').src = savedPhoto;
      } else {
        const avatarImg = document.createElement('img');
        avatarImg.src = savedPhoto;
        avatarImg.style.width = '100%';
        avatarImg.style.height = '100%';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.borderRadius = '50%';
        sidebarAvatar.innerHTML = '';
        sidebarAvatar.appendChild(avatarImg);
      }
    }
  }
});