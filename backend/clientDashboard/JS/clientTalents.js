// Display current date on page load
document.addEventListener('DOMContentLoaded', function() {
  // Format and display current date
  const currentDate = new Date();
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', options);
  
  // Load user profile data
  loadUserProfile();
  
  // Setup search and filter functionality
  setupSearchAndFilter();
  
  // Setup modal events and connections
  setupModals();
});

// Load user profile data from localStorage
function loadUserProfile() {
  const profileData = localStorage.getItem('profileData');
  const storedPhoto = localStorage.getItem('profilePhoto');
  
  if (profileData) {
    const userData = JSON.parse(profileData);
    
    // Update sidebar name if available
    if (userData.fullName) {
      document.getElementById('sidebar-name').textContent = userData.fullName;
    }
    
    // Update sidebar role/company if available
    if (userData.company && userData.company.trim() !== '') {
      document.getElementById('sidebar-role').textContent = userData.company;
    } else {
      document.getElementById('sidebar-role').textContent = 'Client';
    }
  }
  
  // Update avatar if a photo URL is stored
  if (storedPhoto) {
    const avatarElement = document.getElementById('sidebar-avatar');
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
  
  // Listen for profile updates
  window.addEventListener('storage', function(event) {
    if (event.key === 'profileData' && event.newValue) {
      const updatedProfile = JSON.parse(event.newValue);
      
      // Update sidebar information
      document.getElementById('sidebar-name').textContent = updatedProfile.fullName || 'Aran Joshua';
      document.getElementById('sidebar-role').textContent = updatedProfile.company && updatedProfile.company.trim() !== '' ? 
        updatedProfile.company : 'Client';
    }
    
    if (event.key === 'profilePhoto' && event.newValue) {
      // Update avatar image
      const avatarElement = document.getElementById('sidebar-avatar');
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
  });
}

// Setup search and filter functionality
function setupSearchAndFilter() {
  const searchInput = document.getElementById('talent-search');
  const categoryFilter = document.getElementById('category-filter');
  
  // Search input event
  searchInput.addEventListener('input', debounce(function() {
    filterTalents();
  }, 300));
  
  // Enter key in search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      filterTalents();
    }
  });
  
  // Category filter change
  categoryFilter.addEventListener('change', function() {
    filterTalents();
  });
}

// Filter talents based on search and category
function filterTalents() {
  const searchQuery = document.getElementById('talent-search').value.toLowerCase().trim();
  const categoryFilter = document.getElementById('category-filter').value;
  
  // Get all talent cards
  const talentCards = document.querySelectorAll('.talent-card-col');
  let visibleCount = 0;
  
  // Loop through each card and check if it matches filters
  talentCards.forEach(card => {
    // Get talent data from data attributes
    const category = card.dataset.category;
    const talentName = card.dataset.talentName.toLowerCase();
    const talentTitle = card.dataset.talentTitle.toLowerCase();
    const talentSummary = card.dataset.talentSummary.toLowerCase();
    const talentSkills = card.dataset.talentSkills.toLowerCase();
    
    // Check category match
    const categoryMatch = !categoryFilter || category === categoryFilter;
    
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
    if (categoryMatch && searchMatch) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show "no results" if no cards visible
  const noResultsTemplate = document.getElementById('no-results-template');
  if (visibleCount === 0) {
    noResultsTemplate.style.display = 'block';
  } else {
    noResultsTemplate.style.display = 'none';
  }
}

// Setup modal events
function setupModals() {
  // Modal send offer button from portfolio modal
  document.getElementById('modal-send-offer-btn').addEventListener('click', function() {
    const portfolioModal = document.getElementById('portfolioModal');
    const talentId = portfolioModal.getAttribute('data-talent-id');
    
    // Close portfolio modal
    bootstrap.Modal.getInstance(portfolioModal).hide();
    
    // Find selected talent card
    const talentCard = document.querySelector(`.talent-card-col[data-talent-id="${talentId}"]`);
    openSendOfferModal(talentCard);
  });
}

// Open portfolio modal from a card button click
function openPortfolioModalFromCard(button) {
  const talentCard = button.closest('.talent-card-col');
  openPortfolioModal(talentCard);
}

// Open send offer modal from a card button click
function openSendOfferModalFromCard(button) {
  const talentCard = button.closest('.talent-card-col');
  openSendOfferModal(talentCard);
}

// Open portfolio modal with talent data
function openPortfolioModal(talentCard) {
  // Get data from the talent card's data attributes
  const talentId = talentCard.dataset.talentId;
  const talentName = talentCard.dataset.talentName;
  const talentTitle = talentCard.dataset.talentTitle;
  const talentBio = talentCard.dataset.talentBio;
  const talentAvatar = talentCard.dataset.talentAvatar;
  const talentSkills = talentCard.dataset.talentSkills.split(',');
  const talentExperience = JSON.parse(talentCard.dataset.talentExperience);
  const talentSamples = JSON.parse(talentCard.dataset.talentSamples);
  
  // Set modal data attributes
  const portfolioModal = document.getElementById('portfolioModal');
  portfolioModal.setAttribute('data-talent-id', talentId);
  
  // Update modal content
  document.getElementById('modal-talent-name').textContent = talentName;
  document.getElementById('modal-talent-title').textContent = talentTitle;
  document.getElementById('modal-talent-bio').textContent = talentBio;
  document.getElementById('modal-talent-avatar').src = talentAvatar;
  
  // Update skills
  const skillsContainer = document.getElementById('view-portfolio-skills');
  skillsContainer.innerHTML = talentSkills.map(skill => 
    `<span class="tag">${skill}</span>`
  ).join('');
  
  // Update experience
  const experiencesContainer = document.getElementById('view-portfolio-experiences');
  experiencesContainer.innerHTML = talentExperience.map(exp => `
    <div class="experience-item mb-4">
      <div class="d-flex justify-content-between">
        <h6 class="experience-title">${exp.title}</h6>
        <span class="experience-date">${exp.date}</span>
      </div>
      <div class="experience-company mb-2">${exp.company}</div>
      <p class="experience-description">${exp.description}</p>
    </div>
  `).join('');
  
  // Update work samples
  const samplesContainer = document.getElementById('view-portfolio-samples');
  samplesContainer.innerHTML = talentSamples.map(sample => `
    <div class="col-md-6 mb-4">
      <div class="portfolio-project">
        <div class="project-info mb-3">
          <h6 class="project-title">${sample.title}</h6>
          <p class="project-description">${sample.description}</p>
          <a href="${sample.link}" class="btn btn-sm btn-outline-primary mt-2" target="_blank">View Project</a>
        </div>
      </div>
    </div>
  `).join('');
  
  // Show modal
  const modalInstance = new bootstrap.Modal(portfolioModal);
  modalInstance.show();
}

// Open send offer modal
function openSendOfferModal(talentCard) {
  // Get data from the talent card
  const talentId = talentCard.dataset.talentId;
  const talentName = talentCard.dataset.talentName;
  const talentTitle = talentCard.dataset.talentTitle;
  
  // Set modal data
  const sendOfferModal = document.getElementById('sendOfferModal');
  sendOfferModal.setAttribute('data-talent-id', talentId);
  
  // Set talent name
  document.getElementById('offer-talent-name').textContent = talentName;
  
  // Add talent title to job title placeholder
  document.getElementById('job-title').placeholder = `e.g., ${talentTitle} Position`;
  
  // Reset form
  // Continue the openSendOfferModal function
  document.getElementById('offer-form').reset();
  
  // Show modal
  const modalInstance = new bootstrap.Modal(sendOfferModal);
  modalInstance.show();
}

// Submit offer form
function submitOfferForm() {
  // Get form values
  const talentId = document.getElementById('sendOfferModal').getAttribute('data-talent-id');
  const jobTitle = document.getElementById('job-title').value;
  const clientMessage = document.getElementById('client-message').value;
  
  // Simple validation
  if (!jobTitle.trim() || !clientMessage.trim()) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Find talent data
  const talentCard = document.querySelector(`.talent-card-col[data-talent-id="${talentId}"]`);
  const talentName = talentCard.dataset.talentName;
  
  // Create offer object
  const offerData = {
    talentId,
    talentName,
    jobTitle,
    clientMessage,
    sentDate: new Date().toISOString(),
    status: 'pending'
  };
  
  // Store offer in localStorage
  saveOffer(offerData);
  
  // Close modal
  bootstrap.Modal.getInstance(document.getElementById('sendOfferModal')).hide();
  
  // Show success toast
  showToast(`Offer sent to ${talentName}!`, 'success');
}

// Save offer to localStorage
function saveOffer(offerData) {
  // Get existing offers or initialize empty array
  let sentOffers = JSON.parse(localStorage.getItem('sentOffers')) || [];
  
  // Add new offer with unique ID
  offerData.id = Date.now().toString();
  sentOffers.push(offerData);
  
  // Save back to localStorage
  localStorage.setItem('sentOffers', JSON.stringify(sentOffers));
}

// Show a toast notification
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  
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
}

// Debounce function for search input
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Add more talent cards dynamically (example for future implementation)
function addMoreTalents(talentsData) {
  const talentsGrid = document.getElementById('talents-grid');
  
  talentsData.forEach(talent => {
    // Create card element
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6 col-lg-4 talent-card-col';
    cardCol.dataset.category = talent.category;
    cardCol.dataset.talentId = talent.id;
    cardCol.dataset.talentName = talent.name;
    cardCol.dataset.talentTitle = talent.title;
    cardCol.dataset.talentAvatar = talent.avatar;
    cardCol.dataset.talentBio = talent.bio;
    cardCol.dataset.talentSkills = talent.skills.join(',');
    cardCol.dataset.talentSummary = talent.summary;
    cardCol.dataset.talentExperience = JSON.stringify(talent.experience);
    cardCol.dataset.talentSamples = JSON.stringify(talent.samples);
    
    // Create card inner HTML
    cardCol.innerHTML = `
      <div class="talent-card">
        <div class="talent-header">
          <div class="talent-avatar">
            <img src="${talent.avatar}" alt="${talent.name}">
          </div>
          <div class="talent-info">
            <h5 class="talent-name">${talent.name}</h5>
            <p class="talent-title">${talent.title}</p>
          </div>
        </div>
        <div class="talent-portfolio">
          <h6 class="portfolio-heading">Portfolio Summary</h6>
          <p class="portfolio-summary">${talent.summary}</p>
          <div class="portfolio-skills">
            ${talent.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        <div class="talent-actions">
          <button class="btn btn-outline-primary view-portfolio-btn" onclick="openPortfolioModalFromCard(this)">
            <i class="fas fa-eye me-2"></i>View Portfolio
          </button>
          <button class="btn btn-primary send-offer-btn" onclick="openSendOfferModalFromCard(this)">
            <i class="fas fa-paper-plane me-2"></i>Hire Me
          </button>
        </div>
      </div>
    `;
    
    // Add to grid
    talentsGrid.appendChild(cardCol);
  });
  
  // Update search and filter after adding new talents
  filterTalents();
}

// Mock example for loading more talents
function loadMoreTalents() {
  const lastTalentId = document.querySelectorAll('.talent-card-col').length;
  
  // Simulating API call with setTimeout
  setTimeout(() => {
    // New talents data could come from server
    const newTalents = [
      {
        id: lastTalentId + 1,
        name: "David Wilson",
        title: "Video Editor",
        category: "video",
        avatar: "/api/placeholder/100/100",
        bio: "Professional video editor with expertise in storytelling and creating engaging visual content.",
        skills: ["Video Editing", "Adobe Premiere Pro", "After Effects", "Motion Graphics", "Color Grading"],
        summary: "Skilled video editor with 7+ years of experience creating compelling visual stories for brands and agencies.",
        experience: [
          {
            title: "Senior Video Editor",
            company: "Visual Studios",
            date: "Apr 2020 - Present",
            description: "Lead video editor for high-profile client projects, specializing in commercials and branded content."
          },
          {
            title: "Video Editor",
            company: "Creative Productions",
            date: "Feb 2017 - Mar 2020",
            description: "Edited promotional videos, social media content, and event highlight reels."
          }
        ],
        samples: [
          {
            title: "Brand Commercial",
            description: "30-second commercial for a major sports brand that aired nationally.",
            link: "https://example.com/project1"
          },
          {
            title: "Corporate Documentary",
            description: "15-minute documentary highlighting a company's sustainability initiatives.",
            link: "https://example.com/project2"
          }
        ]
      },
      {
        id: lastTalentId + 2,
        name: "Emma Rodriguez",
        title: "Content Writer",
        category: "writing",
        avatar: "/api/placeholder/100/100",
        bio: "Versatile content writer with a strong background in SEO and digital marketing.",
        skills: ["Blog Writing", "SEO", "Technical Writing", "Copywriting", "Content Strategy"],
        summary: "Experienced writer delivering engaging, SEO-optimized content that drives traffic and conversions.",
        experience: [
          {
            title: "Senior Content Writer",
            company: "Digital Words Agency",
            date: "Jan 2021 - Present",
            description: "Produce high-quality blog posts, website copy, and marketing materials for diverse clients."
          },
          {
            title: "Content Specialist",
            company: "SEO Solutions",
            date: "Mar 2018 - Dec 2020",
            description: "Created SEO-optimized content strategies and managed content calendars for multiple clients."
          }
        ],
        samples: [
          {
            title: "Tech Blog Series",
            description: "10-part blog series on emerging technologies that increased client traffic by 45%.",
            link: "https://example.com/project1"
          },
          {
            title: "Website Copy Revamp",
            description: "Complete website copywriting project that improved conversion rates by 30%.",
            link: "https://example.com/project2"
          }
        ]
      }
    ];
    
    // Add new talents to the grid
    addMoreTalents(newTalents);
  }, 1000);
}

// Initialize infinite scroll for future implementation
function initInfiniteScroll() {
  // Add scroll event listener for when user reaches bottom of page
  window.addEventListener('scroll', debounce(function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      // Load more talents when user is near bottom of page
      loadMoreTalents();
    }
  }, 300));
}

// Function to export talent contact information
function exportTalentContact(talentId) {
  // Find talent data
  const talentCard = document.querySelector(`.talent-card-col[data-talent-id="${talentId}"]`);
  const talentName = talentCard.dataset.talentName;
  const talentTitle = talentCard.dataset.talentTitle;
  
  // Create vCard format
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${talentName}
TITLE:${talentTitle}
NOTE:Contacted via ProFolio
END:VCARD`;
  
  // Create blob and download link
  const blob = new Blob([vCardData], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${talentName.replace(/\s+/g, '_')}_contact.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Show toast notification
  showToast(`Contact information for ${talentName} downloaded`, 'success');
}