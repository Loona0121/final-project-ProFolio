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

  // Load profile photo from database if exists
  const savedPhoto = document.querySelector('#profile-photo img');
  if (savedPhoto) {
    const photoUrl = savedPhoto.src;
    
    // Update sidebar avatar
    if (!sidebarAvatar.querySelector('img')) {
      const avatarImg = document.createElement('img');
      avatarImg.style.width = '100%';
      avatarImg.style.height = '100%';
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.borderRadius = '50%';
      avatarImg.src = photoUrl;
      sidebarAvatar.innerHTML = '';
      sidebarAvatar.appendChild(avatarImg);
    } else {
      sidebarAvatar.querySelector('img').src = photoUrl;
    }
    
    // Also save to localStorage for other pages
    localStorage.setItem('profilePhoto', photoUrl);
  } else {
    // Check localStorage as fallback
    const storedPhoto = localStorage.getItem('profilePhoto');
    if (storedPhoto) {
      // Update profile photo in profile page
      if (profilePhoto.querySelector('img')) {
        profilePhoto.querySelector('img').src = storedPhoto;
      } else {
        const img = document.createElement('img');
        img.src = storedPhoto;
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
        avatarImg.src = storedPhoto;
        sidebarAvatar.innerHTML = '';
        sidebarAvatar.appendChild(avatarImg);
      } else {
        sidebarAvatar.querySelector('img').src = storedPhoto;
      }
    }
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
        }
        sidebarAvatar.querySelector('img').src = imageUrl;
        
        // Save to local storage
        localStorage.setItem('profilePhoto', imageUrl);
        
        // Upload to server
        uploadProfilePhoto(imageUrl);
      };
      
      reader.readAsDataURL(file);
    }
  });

  // Function to upload the profile photo to the server
  function uploadProfilePhoto(imageData) {
    // Create form data for the AJAX request
    const formData = new FormData();
    formData.append('image_data', imageData);
    
    // Show a loading notification
    const loadingNotification = showNotification('Uploading profile photo...', 'info', false);
    
    // Send the image to the server
    fetch('updateProfilePhoto.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Remove the loading notification
      if (loadingNotification && document.body.contains(loadingNotification)) {
        document.body.removeChild(loadingNotification);
      }
      
      if (data.success) {
        // Show success modal
        showSuccessModal('Profile Photo Updated', 'Your profile photo has been successfully updated!');
      } else {
        console.error('Error updating profile photo:', data.message);
        showNotification('Failed to update profile photo on server. It will only be saved locally.', 'warning');
      }
    })
    .catch(error => {
      // Remove the loading notification
      if (loadingNotification && document.body.contains(loadingNotification)) {
        document.body.removeChild(loadingNotification);
      }
      
      console.error('Error uploading profile photo:', error);
      showNotification('Error uploading profile photo. It will only be saved locally.', 'warning');
    });
  }

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
    console.log('Form submitted!');
    
    // Get form values
    const companyName = document.getElementById('companyName').value;
    console.log('Company name:', companyName);
    
    // Show loading indicator
    const saveBtn = document.getElementById('save-btn');
    const originalBtnText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';
    saveBtn.disabled = true;
    
    // Save company name to database using traditional AJAX parameters
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'updateCompanyName.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    xhr.onload = function() {
      // Reset button
      saveBtn.innerHTML = originalBtnText;
      saveBtn.disabled = false;
      
      console.log('Response received:', xhr.status, xhr.responseText);
      
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log('Data parsed:', data);
          
          if (data.success) {
            console.log('Success!');
            
            // Save form data to local storage
            localStorage.setItem('profileData', JSON.stringify({
              company: companyName
            }));
            
            // Update sidebar role if needed
            const sidebarRole = document.getElementById('sidebar-role');
            if (sidebarRole) {
              sidebarRole.textContent = companyName && companyName.trim() !== '' ? 
                companyName : 'Client';
            }
            
            // Try to show a fancy notification
            try {
              showSuccessModal('Profile Updated', 'Your profile has been successfully updated!');
            } catch (e) {
              console.error('Error showing modal:', e);
              // Simple alert as last resort fallback
              alert('Profile updated successfully!');
            }
          } else {
            console.error('Error updating profile:', data.message);
            showNotification('Failed to update profile: ' + data.message, 'warning');
            // Simple alert as fallback
            alert('Failed to update profile: ' + data.message);
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          showNotification('Error processing server response', 'warning');
          // Simple alert as fallback
          alert('Error processing server response');
        }
      } else {
        console.error('Server error:', xhr.status);
        showNotification('Server error: ' + xhr.status, 'warning');
        // Simple alert as fallback
        alert('Server error: ' + xhr.status);
      }
    };
    
    xhr.onerror = function() {
      console.error('Network error');
      saveBtn.innerHTML = originalBtnText;
      saveBtn.disabled = false;
      showNotification('Network error. Please try again.', 'warning');
    };
    
    xhr.send('company_name=' + encodeURIComponent(companyName));
  });

  // Function to show a modal success message
  function showSuccessModal(title, message) {
    console.log('Showing success modal with title:', title, 'and message:', message);
    
    // Create modal elements
    const modalId = 'successModal' + Date.now(); // Unique ID to prevent conflicts
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = modalId;
    modalDiv.tabIndex = '-1';
    modalDiv.setAttribute('aria-labelledby', modalId + 'Label');
    modalDiv.setAttribute('aria-hidden', 'true');
    
    modalDiv.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="${modalId}Label">
              <i class="fas fa-check-circle me-2"></i>${title}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-4">
            <div class="text-center mb-3">
              <div class="success-checkmark">
                <div class="check-icon">
                  <span class="icon-line line-tip"></span>
                  <span class="icon-line line-long"></span>
                </div>
              </div>
              <p class="fs-5 mt-3">${message}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modalDiv);
    
    console.log('Modal added to document with ID:', modalId);
    
    // Add CSS for the checkmark animation
    const style = document.createElement('style');
    style.textContent = `
      .success-checkmark {
        width: 80px;
        height: 80px;
        margin: 0 auto;
      }
      .success-checkmark .check-icon {
        width: 80px;
        height: 80px;
        position: relative;
        border-radius: 50%;
        box-sizing: content-box;
        border: 4px solid #4CAF50;
      }
      .success-checkmark .check-icon::before {
        top: 3px;
        left: -2px;
        width: 30px;
        transform-origin: 100% 50%;
        border-radius: 100px 0 0 100px;
      }
      .success-checkmark .check-icon::after {
        top: 0;
        left: 30px;
        width: 60px;
        transform-origin: 0 50%;
        border-radius: 0 100px 100px 0;
        animation: rotate-circle 4.25s ease-in;
      }
      .success-checkmark .check-icon::before, .success-checkmark .check-icon::after {
        content: '';
        height: 100px;
        position: absolute;
        background: #FFFFFF;
        transform: rotate(-45deg);
      }
      .success-checkmark .check-icon .icon-line {
        height: 5px;
        background-color: #4CAF50;
        display: block;
        border-radius: 2px;
        position: absolute;
        z-index: 10;
      }
      .success-checkmark .check-icon .icon-line.line-tip {
        top: 46px;
        left: 14px;
        width: 25px;
        transform: rotate(45deg);
        animation: icon-line-tip 0.75s;
      }
      .success-checkmark .check-icon .icon-line.line-long {
        top: 38px;
        right: 8px;
        width: 47px;
        transform: rotate(-45deg);
        animation: icon-line-long 0.75s;
      }
      @keyframes icon-line-tip {
        0% {
          width: 0;
          left: 1px;
          top: 19px;
        }
        54% {
          width: 0;
          left: 1px;
          top: 19px;
        }
        70% {
          width: 50px;
          left: -8px;
          top: 37px;
        }
        84% {
          width: 17px;
          left: 21px;
          top: 48px;
        }
        100% {
          width: 25px;
          left: 14px;
          top: 45px;
        }
      }
      @keyframes icon-line-long {
        0% {
          width: 0;
          right: 46px;
          top: 54px;
        }
        65% {
          width: 0;
          right: 46px;
          top: 54px;
        }
        84% {
          width: 55px;
          right: 0px;
          top: 35px;
        }
        100% {
          width: 47px;
          right: 8px;
          top: 38px;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Show the modal with Bootstrap 5
    try {
      console.log('Attempting to initialize modal');
      if (typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        console.log('Modal initialized, now showing');
        modal.show();
      } else {
        console.error('Bootstrap is not defined');
        // Fallback to simple notification
        showNotification(message, 'success');
      }
    } catch (e) {
      console.error('Error showing modal:', e);
      // Fallback to simple notification
      showNotification(title + ': ' + message, 'success');
    }
    
    // Remove modal after it's hidden
    modalDiv.addEventListener('hidden.bs.modal', function () {
      document.body.removeChild(modalDiv);
    });
  }

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
  function showNotification(message, type = 'info', autoRemove = true) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-alert`;
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
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
    
    if (autoRemove) {
      setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
    
    return notification;
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