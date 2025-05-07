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
});

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
  
  // Setup skills input in offer form
  const skillsInput = document.getElementById('skills-input');
  skillsInput?.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const skill = this.value.trim();
      if (skill) {
        addSkillTag(skill);
        this.value = '';
      }
    }
  });
  
  // Project type change event
  const projectTypeSelect = document.getElementById('project-type');
  projectTypeSelect?.addEventListener('change', function() {
    updateRateType(this.value);
  });
  
  // Submit offer button
  const submitOfferBtn = document.getElementById('submit-offer-btn');
  submitOfferBtn?.addEventListener('click', submitOfferForm);
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
  
  // Reset form
  document.getElementById('offer-form').reset();
  document.getElementById('skills-tags').innerHTML = '';
  document.getElementById('required-skills').value = '';
  
  // Set default date (2 weeks from now)
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  document.getElementById('deadline').value = twoWeeks.toISOString().split('T')[0];
  
  // Pre-fill top skills
  talent.skills.slice(0, 3).forEach(skill => addSkillTag(skill));
  
  // Show modal
  const modalInstance = new bootstrap.Modal(sendOfferModal);
  modalInstance.show();
}

// Add skill tag to offer form
function addSkillTag(skill) {
  const skillsTags = document.getElementById('skills-tags');
  
  // Create tag element
  const tagElement = document.createElement('div');
  tagElement.className = 'badge bg-primary d-flex align-items-center me-2 mb-2';
  tagElement.innerHTML = `
    ${skill}
    <button type="button" class="btn-close btn-close-white ms-2" aria-label="Remove"></button>
  `;
  
  // Add remove event
  const closeBtn = tagElement.querySelector('.btn-close');
  closeBtn.addEventListener('click', function() {
    tagElement.remove();
    updateRequiredSkillsValue();
  });
  
  // Add to container and update hidden input
  skillsTags.appendChild(tagElement);
  updateRequiredSkillsValue();
}

// Update hidden skills input value
function updateRequiredSkillsValue() {
  const skillsTags = document.getElementById('skills-tags');
  const requiredSkillsInput = document.getElementById('required-skills');
  
  const skills = Array.from(skillsTags.querySelectorAll('.badge'))
    .map(tag => tag.textContent.trim());
  
  requiredSkillsInput.value = skills.join(',');
}

// Update rate type based on project type
function updateRateType(projectType) {
  const rateTypeSpan = document.getElementById('rate-type');
  
  switch(projectType) {
    case 'hourly': rateTypeSpan.textContent = 'Per Hour'; break;
    case 'milestone': rateTypeSpan.textContent = 'Per Milestone'; break;
    case 'retainer': rateTypeSpan.textContent = 'Per Month'; break;
    default: rateTypeSpan.textContent = 'Total';
  }
}

// Submit offer form
function submitOfferForm() {
  const form = document.getElementById('offer-form');
  
  // Validate form
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Get data
  const sendOfferModal = document.getElementById('sendOfferModal');
  const talentId = parseInt(sendOfferModal.dataset.talentId);
  const talent = talentsData.find(t => t.id === talentId);
  
  // Create a floating notification
  const notification = document.createElement('div');
  notification.className = 'position-fixed top-50 start-50 translate-middle alert alert-success text-center p-3';
  notification.style.zIndex = '9999';
  notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  notification.style.maxWidth = '400px';
  notification.style.width = '90%';
  notification.innerHTML = `
    <strong>Success!</strong><br>
    Your offer for "${document.getElementById('job-title').value}" has been sent to ${talent.name}.
  `;
  
  // Add notification to body
  document.body.appendChild(notification);
  
  // Auto-remove after 2 seconds
  setTimeout(() => {
    notification.classList.add('fade');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
  
  // Close modal
  bootstrap.Modal.getInstance(sendOfferModal).hide();
}