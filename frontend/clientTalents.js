// Mock data for talents to simulate a backend
// Talent data - reduced to 3 talents
const talentsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "UX/UI Designer",
    avatar: "/api/placeholder/100/100",
    category: "design",
    bio: "Passionate designer with 5+ years of experience creating intuitive and beautiful user interfaces. I specialize in mobile app design and responsive web interfaces.",
    skills: ["UI Design", "Figma", "Prototyping", "Adobe XD", "Wireframing", "UX Research"],
    experience: [
      {
        title: "Senior UX Designer",
        company: "Design Innovations Ltd",
        date: "Mar 2022 - Present",
        description: "Lead UX/UI design for enterprise clients, creating user-centered designs that increased engagement by 40%."
      },
      {
        title: "UI Designer",
        company: "Creative Solutions",
        date: "Jan 2019 - Feb 2022",
        description: "Designed mobile app interfaces and web applications for startups and mid-sized businesses."
      }
    ],
    samples: [
      {
        title: "E-commerce App Redesign",
        description: "Complete redesign of a fashion e-commerce app, improving conversion rates by 25%.",
        link: "https://example.com/project1"
      },
      {
        title: "Finance Dashboard",
        description: "Intuitive dashboard design for a financial management platform, simplifying complex data visualization.",
        link: "https://example.com/project2"
      }
    ],
    summary: "Expert in creating intuitive user interfaces with 5+ years of experience. Specialized in mobile app design and responsive web interfaces."
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Full Stack Developer",
    avatar: "/api/placeholder/100/100",
    category: "development",
    bio: "Full stack developer with strong expertise in modern JavaScript frameworks. I build scalable web applications with clean, maintainable code.",
    skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "AWS"],
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Solutions Inc.",
        date: "Jan 2022 - Present",
        description: "Lead developer for enterprise web applications, implementing best practices and improving performance by 40%."
      },
      {
        title: "Frontend Developer",
        company: "Digital Innovations",
        date: "Mar 2019 - Dec 2021",
        description: "Developed responsive web interfaces for various clients using modern JavaScript frameworks and CSS preprocessors."
      }
    ],
    samples: [
      {
        title: "E-commerce Platform",
        description: "Fully responsive e-commerce website with integrated payment processing and inventory management.",
        link: "https://example.com/project1"
      },
      {
        title: "Real-time Chat Application",
        description: "Scalable chat application with real-time messaging, file sharing, and user authentication.",
        link: "https://example.com/project2"
      }
    ],
    summary: "Experienced developer with expertise in React, Node.js, and MongoDB. Built scalable applications for startups and enterprise clients."
  },
  {
    id: 3,
    name: "Aisha Patel",
    title: "Content Strategist",
    avatar: "/api/placeholder/100/100",
    category: "marketing",
    bio: "Results-driven content strategist with a knack for creating engaging narratives that drive traffic and conversions.",
    skills: ["SEO", "Content Marketing", "Copywriting", "Content Planning", "Analytics", "Social Media"],
    experience: [
      {
        title: "Senior Content Strategist",
        company: "Marketing Wizards",
        date: "Jun 2021 - Present",
        description: "Created comprehensive content strategies that increased organic traffic by 200% for multiple clients."
      },
      {
        title: "Content Writer",
        company: "Digital Content Agency",
        date: "Aug 2018 - May 2021",
        description: "Produced high-quality blog posts, website copy, and marketing materials for diverse industries."
      }
    ],
    samples: [
      {
        title: "SaaS Company Blog Strategy",
        description: "Developed and implemented a content strategy that grew blog traffic by 350% in 6 months.",
        link: "https://example.com/project1"
      },
      {
        title: "E-commerce Product Descriptions",
        description: "Crafted compelling product descriptions that improved conversion rates by 30%.",
        link: "https://example.com/project2"
      }
    ],
    summary: "Strategic content creator with focus on SEO and audience engagement. Helped businesses increase organic traffic by up to 200%."
  }
];

document.addEventListener('DOMContentLoaded', function() {
  // Init date display
  const currentDate = new Date();
  const options = {year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', options);
  
  // Render initial talent grid
  renderTalentsGrid(talentsData);
  
  // Setup search and filter events
  setupSearchAndFilter();
  
  // Setup modals
  setupModals();
  
  // Make sure the global filterTalents function is properly connected
  window.filterTalents = filterAndRenderTalents;
  
  // Initialize toast components
  initializeToasts();
});

// Initialize toast components
function initializeToasts() {
  // Create toast container if it doesn't exist
  if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '5';
    document.body.appendChild(toastContainer);
  }
}

// Show toast notification
function showToast(title, message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  
  const toastId = 'toast-' + Date.now();
  const toastEl = document.createElement('div');
  toastEl.id = toastId;
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  
  const iconClass = type === 'success' ? 'check-circle' : 'info-circle';
  const bgClass = type === 'success' ? 'bg-success' : 'bg-info';
  
  toastEl.innerHTML = `
    <div class="toast-header ${bgClass} text-white">
      <i class="fas fa-${iconClass} me-2"></i>
      <strong class="me-auto">${title}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  toastContainer.appendChild(toastEl);
  
  const toast = new bootstrap.Toast(toastEl, {
    delay: 5000
  });
  
  toast.show();
  
  // Remove toast element after it's hidden
  toastEl.addEventListener('hidden.bs.toast', function() {
    toastEl.remove();
  });
}

// Render talents grid based on filtered data
function renderTalentsGrid(talents) {
  const talentsGrid = document.getElementById('talents-grid');
  
  // Clear existing content
  talentsGrid.innerHTML = '';
  
  if (talents.length === 0) {
    talentsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No results found</h4>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }
  
  // Add all filtered talents
  talents.forEach(talent => {
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6 col-lg-4 talent-card-col';
    cardCol.dataset.category = talent.category;
    cardCol.dataset.talentId = talent.id;
    
    // Generate skills HTML (max 3)
    const skillsHtml = talent.skills.slice(0, 3).map(skill => 
      `<span class="skill-tag">${skill}</span>`
    ).join('');
    
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
            ${skillsHtml}
          </div>
        </div>
        <div class="talent-actions">
          <button class="btn btn-outline-primary view-portfolio-btn" data-talent-id="${talent.id}">
            <i class="fas fa-eye me-2"></i>View Portfolio
          </button>
          <button class="btn btn-primary send-offer-btn" data-talent-id="${talent.id}">
            <i class="fas fa-paper-plane me-2"></i>Hire Me
          </button>
        </div>
      </div>
    `;
    
    talentsGrid.appendChild(cardCol);
  });
  
  // Attach event listeners to buttons
  attachCardEventListeners();
}

// Attach event listeners to talent cards
function attachCardEventListeners() {
  // Portfolio buttons
  document.querySelectorAll('.view-portfolio-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const talentId = parseInt(this.getAttribute('data-talent-id'));
      openPortfolioModal(talentId);
    });
  });
  
  // Offer buttons
  document.querySelectorAll('.send-offer-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const talentId = parseInt(this.getAttribute('data-talent-id'));
      openSendOfferModal(talentId);
    });
  });
}

// Setup search and filter functionality
function setupSearchAndFilter() {
  const searchInput = document.getElementById('talent-search');
  const categoryFilter = document.getElementById('category-filter');
  
  // Search input with debounce
  searchInput.addEventListener('input', debounce(function() {
    filterAndRenderTalents();
  }, 300));
  
  // Enter key in search
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      filterAndRenderTalents();
    }
  });
  
  // Category filter change
  categoryFilter.addEventListener('change', function() {
    filterAndRenderTalents();
  });
}

// Filter talent data and update grid
function filterAndRenderTalents() {
  console.log("Filtering talents..."); // Debug log
  const searchQuery = document.getElementById('talent-search').value.toLowerCase().trim();
  const categoryFilter = document.getElementById('category-filter').value;
  
  console.log(`Search query: "${searchQuery}", Category: "${categoryFilter}"`); // Debug log
  
  // Filter talents
  const filteredTalents = talentsData.filter(talent => {
    // Category filter
    const matchesCategory = !categoryFilter || talent.category === categoryFilter;
    
    // Search filter (name, title, skills, summary)
    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = 
        talent.name.toLowerCase().includes(searchQuery) ||
        talent.title.toLowerCase().includes(searchQuery) ||
        talent.summary.toLowerCase().includes(searchQuery) ||
        talent.skills.some(skill => skill.toLowerCase().includes(searchQuery));
    }
    
    return matchesCategory && matchesSearch;
  });
  
  console.log(`Found ${filteredTalents.length} matching talents`); // Debug log
  
  // Update UI with filtered talents
  renderTalentsGrid(filteredTalents);
}

// Debounce function to limit function calls
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
}

// Setup portfolio and offer modals
function setupModals() {
  // Modal send offer button
  const modalSendOfferBtn = document.getElementById('modal-send-offer-btn');
  modalSendOfferBtn?.addEventListener('click', function() {
    const portfolioModal = document.getElementById('portfolioModal');
    const talentId = parseInt(portfolioModal.dataset.talentId);
    
    bootstrap.Modal.getInstance(portfolioModal).hide();
    openSendOfferModal(talentId);
  });
  
  // Submit offer button
  document.getElementById('submit-offer-btn').addEventListener('click', function() {
    submitOfferForm();
  });
  
  // Add keyboard event listener for offer form
  document.getElementById('offer-form').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitOfferForm();
    }
  });
}

// Open portfolio modal
function openPortfolioModal(talentId) {
  const talent = talentsData.find(t => t.id === talentId);
  if (!talent) return;
  
  const portfolioModal = document.getElementById('portfolioModal');
  portfolioModal.dataset.talentId = talentId;
  
  // Update modal content
  document.getElementById('modal-talent-name').textContent = talent.name;
  document.getElementById('modal-talent-title').textContent = talent.title;
  document.getElementById('modal-talent-bio').textContent = talent.bio;
  document.getElementById('modal-talent-avatar').src = talent.avatar;
  
  // Update skills
  const skillsContainer = document.getElementById('view-portfolio-skills');
  skillsContainer.innerHTML = talent.skills.map(skill => 
    `<span class="tag">${skill}</span>`
  ).join('');
  
  // Update experience
  const experiencesContainer = document.getElementById('view-portfolio-experiences');
  experiencesContainer.innerHTML = talent.experience.map(exp => `
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
  samplesContainer.innerHTML = talent.samples.map(sample => `
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
function openSendOfferModal(talentId) {
  const talent = talentsData.find(t => t.id === talentId);
  if (!talent) return;
  
  const sendOfferModal = document.getElementById('sendOfferModal');
  sendOfferModal.dataset.talentId = talentId;
  
  // Set talent name
  document.getElementById('offer-talent-name').textContent = talent.name;
  
  // Add talent name to job title placeholder
  document.getElementById('job-title').placeholder = `e.g., ${talent.title} Position`;
  
  // Reset form
  document.getElementById('offer-form').reset();
  
  // Show modal
  const modalInstance = new bootstrap.Modal(sendOfferModal);
  modalInstance.show();
  
  // Focus on job title field
  setTimeout(() => {
    document.getElementById('job-title').focus();
  }, 500);
}

// Submit offer form
function submitOfferForm() {
  // Get form values
  const jobTitle = document.getElementById('job-title').value.trim();
  const clientMessage = document.getElementById('client-message').value.trim();
  const talentName = document.getElementById('offer-talent-name').textContent;
  
  // Validate form with visual feedback
  let isValid = true;
  
  // Check job title
  const jobTitleInput = document.getElementById('job-title');
  if (!jobTitle) {
    jobTitleInput.classList.add('is-invalid');
    isValid = false;
  } else {
    jobTitleInput.classList.remove('is-invalid');
    jobTitleInput.classList.add('is-valid');
  }
  
  // Check client message
  const clientMessageInput = document.getElementById('client-message');
  if (!clientMessage) {
    clientMessageInput.classList.add('is-invalid');
    isValid = false;
  } else {
    clientMessageInput.classList.remove('is-invalid');
    clientMessageInput.classList.add('is-valid');
  }
  
  if (!isValid) {
    return;
  }
  
  // Get client info from localStorage
  const profileData = localStorage.getItem('profileData');
  let clientName = 'Aran Joshua'; // Default name
  let clientCompany = 'Client'; // Default role
  
  if (profileData) {
    const userData = JSON.parse(profileData);
    if (userData.fullName) {
      clientName = userData.fullName;
    }
    if (userData.company && userData.company.trim() !== '') {
      clientCompany = userData.company;
    }
  }
  
  // Create offer object that matches the structure in freelancerOffers.html
  const offerData = {
    talentName: talentName,
    clientName: clientName,
    clientCompany: clientCompany,
    jobTitle: jobTitle,
    message: clientMessage,
    date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})
  };
  
  // Save the offer to localStorage
  let sentOffers = JSON.parse(localStorage.getItem('sentOffers') || '[]');
  sentOffers.push(offerData);
  localStorage.setItem('sentOffers', JSON.stringify(sentOffers));
  
  // Prepare submit button with loading state
  const submitBtn = document.getElementById('submit-offer-btn');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
  submitBtn.disabled = true;
  
  // Simulate sending delay (remove in production)
  setTimeout(() => {
    // Reset submit button
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
    
    // Close modal
    const sendOfferModal = document.getElementById('sendOfferModal');
    bootstrap.Modal.getInstance(sendOfferModal).hide();
    
    // Reset form and validation classes
    document.getElementById('offer-form').reset();
    document.getElementById('job-title').classList.remove('is-valid');
    document.getElementById('client-message').classList.remove('is-valid');
    
    // Show success toast
    showToast('Offer Sent Successfully', `Your job offer has been sent to ${talentName}.`, 'success');
  }, 1200);
}