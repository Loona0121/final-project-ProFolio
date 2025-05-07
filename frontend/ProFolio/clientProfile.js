document.addEventListener('DOMContentLoaded', function() {
  // Get current date
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);
  document.getElementById('current-date').textContent = formattedDate;

  // DOM elements
  const photoUpload = document.getElementById('photo-upload');
  const profilePhoto = document.getElementById('profile-photo');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const sidebarName = document.getElementById('sidebar-name');
  const sidebarRole = document.getElementById('sidebar-role');
  const profileForm = document.getElementById('profile-form');
  const cancelBtn = document.getElementById('cancel-btn');

  // Load profile photo from local storage if exists
  const savedPhoto = localStorage.getItem('profilePhoto');
  if (savedPhoto) {
    // Update profile photo in profile page
    if (profilePhoto.querySelector('img')) {
      profilePhoto.querySelector('img').src = savedPhoto;
    } else {
      const img = document.createElement('img');
      img.src = savedPhoto;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '50%';
      profilePhoto.innerHTML = '';
      profilePhoto.appendChild(img);
    }
    
    // Create and set the sidebar avatar image
    if (!sidebarAvatar.querySelector('img')) {
      const avatarImg = document.createElement('img');
      avatarImg.style.width = '100%';
      avatarImg.style.height = '100%';
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.borderRadius = '50%';
      sidebarAvatar.innerHTML = '';
      sidebarAvatar.appendChild(avatarImg);
    }
    sidebarAvatar.querySelector('img').src = savedPhoto;
  }

  // Photo upload handler
  photoUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Update main profile photo
        if (profilePhoto.querySelector('img')) {
          profilePhoto.querySelector('img').src = imageUrl;
        } else {
          const img = document.createElement('img');
          img.src = imageUrl;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '50%';
          profilePhoto.innerHTML = '';
          profilePhoto.appendChild(img);
        }
        
        // Update sidebar avatar
        if (!sidebarAvatar.querySelector('img')) {
          const avatarImg = document.createElement('img');
          avatarImg.style.width = '100%';
          avatarImg.style.height = '100%';
          avatarImg.style.objectFit = 'cover';
          avatarImg.style.borderRadius = '50%';
          sidebarAvatar.innerHTML = '';
          sidebarAvatar.appendChild(avatarImg);
        } else {
          sidebarAvatar.querySelector('img').src = imageUrl;
        }
        
        // Save to local storage
        localStorage.setItem('profilePhoto', imageUrl);
      };
      
      reader.readAsDataURL(file);
    }
  });

  // Load saved form data if exists
  const savedData = localStorage.getItem('profileData');
  if (savedData) {
    const profileData = JSON.parse(savedData);
    
    // Fill form fields (for non-editable fields, update the text content)
    document.getElementById('fullName').textContent = profileData.fullName || 'Aran Joshua';
    document.getElementById('emailAddress').textContent = profileData.email || 'aranjoshua@email.com';
    
    // For editable fields, update the value
    document.getElementById('companyName').value = profileData.company || '';
    
    // Update sidebar
    sidebarName.textContent = profileData.fullName || 'Aran Joshua';
    
    // Set role as company name if available, otherwise "Client"
    sidebarRole.textContent = profileData.company && profileData.company.trim() !== '' ? 
      profileData.company : 'Client';
  }

  // Form submission handler
  profileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form values - for non-editable fields, get the text content
    const formData = {
      fullName: document.getElementById('fullName').textContent,
      email: document.getElementById('emailAddress').textContent,
      company: document.getElementById('companyName').value
    };
    
    // Save form data to local storage
    localStorage.setItem('profileData', JSON.stringify(formData));
    
    // Update sidebar user info
    sidebarName.textContent = formData.fullName;
    
    // Set company name as role if available, otherwise "Client"
    sidebarRole.textContent = formData.company && formData.company.trim() !== '' ? 
      formData.company : 'Client';
    
    // Event to notify other tabs/pages about the profile update
    const profileUpdateEvent = new CustomEvent('profileUpdated', {
      detail: formData
    });
    
    // Dispatch the event
    window.dispatchEvent(profileUpdateEvent);
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
  });

  // Listen for profile updates from other tabs/pages
  window.addEventListener('storage', function(event) {
    if (event.key === 'profileData' && event.newValue) {
      const profileData = JSON.parse(event.newValue);
      
      // Update sidebar information
      sidebarName.textContent = profileData.fullName || 'Aran Joshua';
      sidebarRole.textContent = profileData.company && profileData.company.trim() !== '' ? 
        profileData.company : 'Client';
      
      // Update form fields if on profile page
      if (document.getElementById('fullName')) {
        document.getElementById('fullName').textContent = profileData.fullName || 'Aran Joshua';
      }
      if (document.getElementById('emailAddress')) {
        document.getElementById('emailAddress').textContent = profileData.email || 'aranjoshua@email.com';
      }
      if (document.getElementById('companyName')) {
        document.getElementById('companyName').value = profileData.company || '';
      }
    }
    
    if (event.key === 'profilePhoto' && event.newValue) {
      // Update profile photo and sidebar avatar
      updateProfileImages(event.newValue);
    }
  });

  // Function to update profile images across the site
  function updateProfileImages(imageUrl) {
    // Update profile photo if on profile page
    if (profilePhoto) {
      if (profilePhoto.querySelector('img')) {
        profilePhoto.querySelector('img').src = imageUrl;
      } else {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        profilePhoto.innerHTML = '';
        profilePhoto.appendChild(img);
      }
    }
    
    // Update sidebar avatar
    if (sidebarAvatar) {
      if (sidebarAvatar.querySelector('img')) {
        sidebarAvatar.querySelector('img').src = imageUrl;
      } else {
        const avatarImg = document.createElement('img');
        avatarImg.style.width = '100%';
        avatarImg.style.height = '100%';
        avatarImg.style.objectFit = 'cover';
        avatarImg.style.borderRadius = '50%';
        sidebarAvatar.innerHTML = '';
        sidebarAvatar.appendChild(avatarImg);
      }
    }
  }

  // Cancel button handler
  cancelBtn.addEventListener('click', function() {
    window.location.reload();
  });

  // Notification function
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-alert`;
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '9999',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      minWidth: '250px',
      animation: 'fadeIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Add CSS for notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
});