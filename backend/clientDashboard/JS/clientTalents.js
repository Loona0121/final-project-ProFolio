// Display current date on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('clientTalents.js loaded');
  
  // Format and display current date
  const currentDate = new Date();
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    currentDateElement.textContent = currentDate.toLocaleDateString('en-US', options);
  }
  
  // Load user profile data
  loadUserProfile();
  
  // Setup search and filter functionality
  setupSearchAndFilter();
  
  // Setup modal events
  setupModals();
});

// Load user profile data from localStorage
function loadUserProfile() {
  const profileData = localStorage.getItem('profileData');
  const storedPhoto = localStorage.getItem('profilePhoto');
  
  if (profileData) {
    const userData = JSON.parse(profileData);
    
    // Update sidebar name if available
    const sidebarName = document.getElementById('sidebar-name');
    if (sidebarName && userData.fullName) {
      sidebarName.textContent = userData.fullName;
    }
    
    // Update sidebar role/company if available
    const sidebarRole = document.getElementById('sidebar-role');
    if (sidebarRole) {
      if (userData.company && userData.company.trim() !== '') {
        sidebarRole.textContent = userData.company;
      } else {
        sidebarRole.textContent = 'Client';
      }
    }
  }
  
  // Update avatar if a photo URL is stored
  if (storedPhoto) {
    const avatarElement = document.getElementById('sidebar-avatar');
    if (avatarElement) {
      avatarElement.innerHTML = ''; // Clear default icon
      
      const avatarImg = document.createElement('img');
      avatarImg.src = storedPhoto;
      avatarImg.alt = 'User Avatar';
      avatarImg.style.width = '100%';
      avatarImg.style.height = '100%';
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.borderRadius = '50%';
      
      avatarElement.appendChild(avatarImg);
    }
  }
  
  // Listen for profile updates
  window.addEventListener('storage', function(event) {
    if (event.key === 'profileData' && event.newValue) {
      const updatedProfile = JSON.parse(event.newValue);
      
      // Update sidebar information
      const sidebarName = document.getElementById('sidebar-name');
      const sidebarRole = document.getElementById('sidebar-role');
      
      if (sidebarName) {
        sidebarName.textContent = updatedProfile.fullName || 'Aran Joshua';
      }
      
      if (sidebarRole) {
        sidebarRole.textContent = updatedProfile.company && updatedProfile.company.trim() !== '' ? 
          updatedProfile.company : 'Client';
      }
    }
    
    if (event.key === 'profilePhoto' && event.newValue) {
      // Update avatar image
      const avatarElement = document.getElementById('sidebar-avatar');
      if (avatarElement) {
        if (avatarElement.querySelector('img')) {
          avatarElement.querySelector('img').src = event.newValue;
        } else {
          avatarElement.innerHTML = ''; // Clear default icon
          const avatarImg = document.createElement('img');
          avatarImg.src = event.newValue;
          avatarImg.alt = 'User Avatar';
          avatarImg.style.width = '100%';
          avatarImg.style.height = '100%';
          avatarImg.style.objectFit = 'cover';
          avatarImg.style.borderRadius = '50%';
          avatarElement.appendChild(avatarImg);
        }
      }
    }
  });
}

// Setup search and filter functionality
function setupSearchAndFilter() {
  const searchInput = document.getElementById('talent-search');
  
  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      filterTalents();
    }, 300));
    
    // Enter key in search
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        filterTalents();
      }
    });
  }
}

// Filter talents based on search
function filterTalents() {
  const searchInput = document.getElementById('talent-search');
  
  if (!searchInput) return;
  
  const searchQuery = searchInput.value.toLowerCase().trim();
  
  // Get all talent cards
  const talentCards = document.querySelectorAll('.talent-card-col');
  let visibleCount = 0;
  
  // Loop through each card and check if it matches filters
  talentCards.forEach(card => {
    // Get talent data from data attributes
    const talentName = card.dataset.talentName.toLowerCase();
    const talentTitle = card.dataset.talentTitle.toLowerCase();
    const talentSummary = card.dataset.talentSummary.toLowerCase();
    const talentSkills = card.dataset.talentSkills.toLowerCase();
    
    // Check search match
    let searchMatch = true;
    if (searchQuery) {
      searchMatch = 
        talentName.includes(searchQuery) ||
        talentTitle.includes(searchQuery) ||
        talentSummary.includes(searchQuery) ||
        talentSkills.includes(searchQuery);
    }
    
    // Show or hide based on matches
    if (searchMatch) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show "no results" if no cards visible
  const noResultsTemplate = document.getElementById('no-results-template');
  if (noResultsTemplate) {
    if (visibleCount === 0) {
      noResultsTemplate.style.display = 'block';
    } else {
      noResultsTemplate.style.display = 'none';
    }
  }
}

// Setup modal events
function setupModals() {
  console.log('Setting up modal events in the JS file');
  
  // Make sure back button works
  const backBtn = document.getElementById('back-to-selection-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      const selectionView = document.getElementById('portfolio-selection-view');
      const detailView = document.getElementById('portfolio-detail-view');
      
      if (selectionView && detailView) {
        selectionView.style.display = 'block';
        detailView.style.display = 'none';
        
        // Update modal title
        const modalLabel = document.getElementById('portfolioModalLabel');
        if (modalLabel) {
          modalLabel.textContent = 'Portfolio Selection';
        }
      }
    });
  }
  
  // Add listeners to portfolio buttons (for safety - redundant with inline script)
  const viewButtons = document.querySelectorAll('.view-portfolio-btn');
  console.log('In JS file: Found ' + viewButtons.length + ' portfolio buttons');
  
  viewButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      console.log('Button clicked in JS file handler');
      const talentCard = button.closest('.talent-card-col');
      if (talentCard) {
        window.openPortfolioModal(talentCard);
      }
    });
  });
}

// Open portfolio modal from a card button click - Make global
window.openPortfolioModalFromCard = function(button) {
  console.log('openPortfolioModalFromCard called');
  const talentCard = button.closest('.talent-card-col');
  if (talentCard) {
    window.openPortfolioModal(talentCard);
  } else {
    console.error('Could not find parent talent card');
  }
};

// Open portfolio modal with talent data - Make global
window.openPortfolioModal = function(talentCard) {
  console.log('openPortfolioModal called with talentCard:', talentCard);
  
  if (!talentCard) {
    console.error('No talent card provided');
    return;
  }
  
  // Get data from the talent card's data attributes
  const talentId = talentCard.dataset.talentId;
  const talentName = talentCard.dataset.talentName;
  const talentTitle = talentCard.dataset.talentTitle;
  const talentBio = talentCard.dataset.talentBio;
  const talentAvatar = talentCard.dataset.talentAvatar;
  
  console.log('Talent data:', { talentId, talentName, talentTitle });
  
  // Set modal data attributes
  const portfolioModal = document.getElementById('portfolioModal');
  if (!portfolioModal) {
    console.error('Portfolio modal not found');
    return;
  }
  
  portfolioModal.setAttribute('data-talent-id', talentId);
  
  // Update talent information in the selection view
  const talentNameElement = document.getElementById('select-talent-name');
  const talentTitleElement = document.getElementById('select-talent-title');
  const talentBioElement = document.getElementById('select-talent-bio');
  const talentAvatarElement = document.getElementById('select-talent-avatar');
  
  if (talentNameElement) talentNameElement.textContent = talentName;
  if (talentTitleElement) talentTitleElement.textContent = talentTitle;
  if (talentBioElement) talentBioElement.textContent = talentBio;
  if (talentAvatarElement) talentAvatarElement.src = talentAvatar;
  
  // Show selection view, hide detail view
  const selectionView = document.getElementById('portfolio-selection-view');
  const detailView = document.getElementById('portfolio-detail-view');
  
  if (selectionView) selectionView.style.display = 'block';
  if (detailView) detailView.style.display = 'none';
  
  // Load portfolio list for this talent
  console.log('About to call loadTalentPortfolios with talentId:', talentId);
  try {
    window.loadTalentPortfolios(talentId);
  } catch (error) {
    console.error('Error calling loadTalentPortfolios:', error);
  }
  
  // Show modal
  try {
    const bsModal = new bootstrap.Modal(portfolioModal);
    bsModal.show();
    console.log('Modal should be showing now');
  } catch (error) {
    console.error('Error showing modal:', error);
    alert('There was a problem displaying the portfolio modal. Please try again.');
  }
};

// Load portfolio list for a talent - Make global
window.loadTalentPortfolios = function(talentId) {
  console.log('Loading portfolios for talent ID:', talentId);
  
  // Get the portfolio container
  const portfolioContainer = document.getElementById('portfolio-selection-container');
  if (!portfolioContainer) {
    console.error('Portfolio container not found');
    return;
  }
  
  // Show loading indicator
  portfolioContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading portfolios...</p>
    </div>
  `;
  
  // Create the URL for the AJAX request
  const ajaxUrl = `clientTalents.php?action=get_portfolios&user_id=${talentId}`;
  console.log('AJAX URL:', ajaxUrl);
  
  // Fetch portfolios via AJAX from the server
  fetch(ajaxUrl)
    .then(response => {
      console.log('AJAX response received:', response);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Portfolio data received:', data);
      portfolioContainer.innerHTML = '';
      
      // Check if response has expected structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format received from server');
      }
      
      const portfolios = data.portfolios || [];
      console.log('Found', portfolios.length, 'portfolios');
      
      if (portfolios.length === 0) {
        portfolioContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No portfolios available</h5>
            <p>This freelancer hasn't created any portfolios yet.</p>
            ${data.debug ? `
            <div class="mt-4 text-start bg-light p-3 rounded" style="max-width: 600px; margin: 0 auto; font-size: 0.8rem;">
              <p class="mb-1"><strong>Debug information:</strong></p>
              <pre>${JSON.stringify(data.debug, null, 2)}</pre>
            </div>` : ''}
          </div>
        `;
        return;
      }
      
      // Create a card for each portfolio
      portfolios.forEach(portfolio => {
        console.log('Processing portfolio:', portfolio.id, portfolio.title);
        
        // Make sure skills_array exists
        if (!portfolio.skills_array && portfolio.skills) {
          portfolio.skills_array = portfolio.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        }
        
        if (!Array.isArray(portfolio.skills_array)) {
          portfolio.skills_array = [];
        }
        
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'col-md-6 col-lg-4 mb-4';
        portfolioCard.innerHTML = `
          <div class="card h-100 portfolio-card">
            <div class="card-body p-4">
              <h5 class="card-title mb-3">${portfolio.title || 'Untitled Portfolio'}</h5>
              <p class="card-text text-muted mb-4">${portfolio.description || 'No description available.'}</p>
              <div class="portfolio-skills mb-4">
                ${portfolio.skills_array.slice(0, 3).map(skill => `<span class="tag">${skill}</span>`).join('')}
                ${portfolio.skills_array.length > 3 ? `<span class="tag">+${portfolio.skills_array.length - 3} more</span>` : ''}
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 pb-4 px-4">
              <button class="btn btn-primary w-100 view-detail-btn" data-portfolio-id="${portfolio.id}">
                <i class="fas fa-eye me-2"></i>View Details
              </button>
            </div>
          </div>
        `;
        portfolioContainer.appendChild(portfolioCard);
        
        // Add click event for the view details button
        const viewDetailsBtn = portfolioCard.querySelector('.view-detail-btn');
        viewDetailsBtn.addEventListener('click', function() {
          console.log('View details clicked for portfolio:', portfolio.id);
          window.viewPortfolioDetail(talentId, portfolio);
        });
      });
      
      console.log('Added', portfolios.length, 'portfolio cards');
    })
    .catch(error => {
      console.error('Error fetching portfolios:', error);
      portfolioContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h5 class="text-muted">Error Loading Portfolios</h5>
          <p>There was a problem loading the portfolios.</p>
          <div class="mt-3 text-start bg-light p-3 rounded" style="max-width: 700px; margin: 0 auto; font-size: 0.8rem;">
            <p class="mb-1"><strong>Error details:</strong></p>
            <pre>${error.message || 'Unknown error'}</pre>
            <p class="mt-3 mb-1"><strong>Request URL:</strong></p>
            <pre>${ajaxUrl}</pre>
            <p class="mt-3 mb-0">Please check your browser console for more details.</p>
          </div>
        </div>
      `;
    });
};

// View a specific portfolio detail - Make global
window.viewPortfolioDetail = function(talentId, portfolio) {
  console.log('Viewing portfolio detail:', talentId, portfolio);
  
  // Update modal title
  const modalTitle = document.getElementById('portfolioModalLabel');
  if (modalTitle) modalTitle.textContent = 'Portfolio Details';
  
  // Hide selection view, show detail view
  const selectionView = document.getElementById('portfolio-selection-view');
  const detailView = document.getElementById('portfolio-detail-view');
  
  if (selectionView) selectionView.style.display = 'none';
  if (detailView) detailView.style.display = 'block';
  
  // Update portfolio details
  const portfolioTitle = document.getElementById('portfolio-title');
  const portfolioDescription = document.getElementById('portfolio-description');
  
  if (portfolioTitle) portfolioTitle.textContent = portfolio.title || 'Untitled Portfolio';
  if (portfolioDescription) portfolioDescription.textContent = portfolio.description || 'No description available.';
  
  // Ensure skills_array exists
  if (!portfolio.skills_array && portfolio.skills) {
    portfolio.skills_array = portfolio.skills.split(',').map(skill => skill.trim());
  }
  
  if (!Array.isArray(portfolio.skills_array)) {
    portfolio.skills_array = [];
  }
  
  // Update skills
  const skillsContainer = document.getElementById('view-portfolio-skills');
  if (skillsContainer) {
    if (portfolio.skills_array.length > 0) {
      skillsContainer.innerHTML = portfolio.skills_array.map(skill => 
        `<span class="tag">${skill}</span>`
      ).join('');
    } else {
      skillsContainer.innerHTML = '<p class="text-muted">No skills listed</p>';
    }
  }
  
  // Ensure experience array exists
  if (!Array.isArray(portfolio.experience)) {
    portfolio.experience = [];
  }
  
  // Update experience
  const experiencesContainer = document.getElementById('view-portfolio-experiences');
  if (experiencesContainer) {
    if (portfolio.experience.length > 0) {
      experiencesContainer.innerHTML = portfolio.experience.map(exp => `
        <div class="experience-item mb-4">
          <div class="d-flex justify-content-between">
            <h6 class="experience-title">${exp.title || 'Position'}</h6>
            <span class="experience-date">${exp.date || 'No date provided'}</span>
          </div>
          <div class="experience-company mb-2">${exp.company || 'Company'}</div>
          <p class="experience-description">${exp.description || 'No description provided.'}</p>
        </div>
      `).join('');
    } else {
      experiencesContainer.innerHTML = '<div class="text-center py-4"><p class="text-muted">No work experience listed</p></div>';
    }
  }
  
  // Ensure samples array exists
  if (!Array.isArray(portfolio.samples)) {
    portfolio.samples = [];
  }
  
  // Update work samples
  const samplesContainer = document.getElementById('view-portfolio-samples');
  if (samplesContainer) {
    if (portfolio.samples.length > 0) {
      samplesContainer.innerHTML = portfolio.samples.map(sample => `
        <div class="col-md-6 mb-4">
          <div class="portfolio-project">
            <div class="project-info mb-3">
              <h6 class="project-title">${sample.title || 'Project'}</h6>
              <p class="project-description">${sample.description || 'No description provided.'}</p>
              <a href="${sample.link || '#'}" class="btn btn-sm btn-outline-primary mt-2" target="_blank">View Project</a>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      samplesContainer.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">No work samples listed</p></div>';
    }
  }
  
  console.log('Portfolio detail view updated');
};

// Debounce function for search input - Make global
window.debounce = function(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

// Show a toast notification - Make global
window.showToast = function(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    console.error('Toast container not found');
    return;
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  // Set content
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Initialize and show
  const toastInstance = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 5000
  });
  
  toastInstance.show();
  
  // Remove from DOM after hidden
  toast.addEventListener('hidden.bs.toast', function() {
    toast.remove();
  });
};