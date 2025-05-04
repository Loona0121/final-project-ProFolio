// Function to display the current date
function displayCurrentDate() {
  const currentDate = new Date();
  const options = {year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', options);
}

// Sample offers data - simplified to match "Find Talents" data structure
const offers = [
  {
    id: 1,
    jobTitle: "E-commerce Website Redesign",
    projectType: "fixed",
    projectOverview: "Complete redesign of our e-commerce platform focusing on user experience and conversion optimization.",
    rate: 2500,
    deadline: "2025-05-20",
    requiredSkills: ["UI/UX Design", "Adobe XD", "Figma", "Wireframing"],
    clientMessage: "Looking for a talented designer to help modernize our online store.",
    freelancerName: "Sarah Johnson",
    freelancerAvatar: "/api/placeholder/40/40",
    freelancerTitle: "UI/UX Designer",
    offerDate: "2025-03-10",
    status: "accepted",
    freelancerEmail: "sarah.johnson@emailprovider.com",
    freelancerMessage: "Thank you for your offer! I'm excited to work on redesigning your e-commerce platform. I have extensive experience with similar projects and will focus on creating an intuitive user experience that improves conversion rates."
  },
  {
    id: 2,
    jobTitle: "Mobile App Development",
    projectType: "fixed",
    projectOverview: "Development of a cross-platform mobile application for our fitness tracking service.",
    rate: 5000,
    deadline: "2025-07-15",
    requiredSkills: ["React Native", "iOS", "Android", "API Integration"],
    clientMessage: "We need an experienced mobile developer to create our new fitness app.",
    freelancerName: "Michael Chen",
    freelancerAvatar: "/api/placeholder/40/40",
    freelancerTitle: "Mobile Developer",
    offerDate: "2025-03-30",
    status: "accepted",
    freelancerEmail: "michael.chen@emailprovider.com",
    freelancerMessage: "I'm pleased to accept your offer for the fitness app development project. I've built several cross-platform mobile applications and am confident I can deliver a high-quality product that meets your requirements."
  },
  {
    id: 3,
    jobTitle: "Content Marketing Strategy",
    projectType: "fixed",
    projectOverview: "Development of a comprehensive content marketing strategy to increase our brand visibility.",
    rate: 1800,
    deadline: "2025-05-30",
    requiredSkills: ["Content Strategy", "SEO", "Social Media Marketing", "Editorial Planning"],
    clientMessage: "We're looking for a content strategist to help boost our online presence.",
    freelancerName: "Emily Rodriguez",
    freelancerAvatar: "/api/placeholder/40/40",
    freelancerTitle: "Content Strategist",
    offerDate: "2025-04-05",
    status: "pending"
  },
  {
    id: 4,
    jobTitle: "WordPress Blog Migration",
    projectType: "fixed",
    projectOverview: "Migration of existing blog content to a new WordPress platform with minimal downtime.",
    rate: 800,
    deadline: "2025-04-10",
    requiredSkills: ["WordPress", "PHP", "MySQL", "Content Migration"],
    clientMessage: "Need help migrating our blog to a new WordPress installation with custom theme.",
    freelancerName: "David Wilson",
    freelancerAvatar: "/api/placeholder/40/40",
    freelancerTitle: "WordPress Developer",
    offerDate: "2025-03-15",
    status: "accepted",
    freelancerEmail: "david.wilson@emailprovider.com",
    freelancerMessage: "Thanks for the opportunity! I specialize in WordPress migrations and can ensure a smooth transition with minimal downtime. I'll start by reviewing your current setup and creating a detailed migration plan."
  },
  {
    id: 5,
    jobTitle: "Logo Redesign",
    projectType: "fixed",
    projectOverview: "Redesign of company logo to better reflect our updated brand values and mission.",
    rate: 600,
    deadline: "2025-04-28",
    requiredSkills: ["Logo Design", "Branding", "Adobe Illustrator", "Vector Graphics"],
    clientMessage: "Looking for a creative designer to refresh our company logo.",
    freelancerName: "Alex Thompson",
    freelancerAvatar: "/api/placeholder/40/40",
    freelancerTitle: "Graphic Designer",
    offerDate: "2025-04-01",
    status: "declined",
    freelancerMessage: "Thank you for considering me for your logo redesign project. Unfortunately, I'm fully booked until June and wouldn't be able to meet your deadline. I wish you the best with finding another designer for your project."
  }
];

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

// Function to get status badge class
function getStatusBadgeClass(status) {
  switch(status) {
    case 'pending': return 'status-pending';
    case 'accepted': return 'status-accepted';
    case 'declined': return 'status-declined';
    default: return '';
  }
}

// Function to get formatted status text
function getStatusText(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// Function to get formatted project type text
function getProjectTypeText(type) {
  switch(type) {
    case 'fixed': return 'Fixed-price';
    case 'hourly': return 'Hourly rate';
    case 'milestone': return 'Milestone-based';
    case 'retainer': return 'Monthly retainer';
    default: return type;
  }
}

// Function to render offers
function renderOffers(filterStatus = 'all') {
  const offersList = document.getElementById('offers-list');
  offersList.innerHTML = '';
  
  let filteredOffers = offers;
  if (filterStatus !== 'all') {
    filteredOffers = offers.filter(offer => offer.status === filterStatus);
  }
  
  if (filteredOffers.length === 0) {
    offersList.innerHTML = `
      <div class="col-12">
        <div class="no-offers">
          <i class="fas fa-inbox fa-3x mb-3"></i>
          <h4>No offers found</h4>
          <p>There are no offers matching your current filter.</p>
        </div>
      </div>
    `;
    return;
  }
  
  filteredOffers.forEach(offer => {
    const offerCard = document.createElement('div');
    offerCard.className = 'col-lg-6 col-xl-4 mb-4';
    offerCard.innerHTML = `
      <div class="card offer-card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="offer-status ${getStatusBadgeClass(offer.status)}">${getStatusText(offer.status)}</span>
          </div>
          <h5 class="card-title">${offer.jobTitle}</h5>
          <p class="card-text text-truncate">${offer.projectOverview}</p>
          <div class="d-flex align-items-center mb-3">
            <img src="${offer.freelancerAvatar}" alt="${offer.freelancerName}" class="avatar-sm me-2">
            <div>
              <h6 class="mb-0">${offer.freelancerName}</h6>
              <small class="text-muted">${offer.freelancerTitle}</small>
            </div>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <div>
              <small class="text-muted d-block">Budget</small>
              <strong>$${offer.rate.toLocaleString()}</strong>
            </div>
            <div>
              <small class="text-muted d-block">Deadline</small>
              <strong>${formatDate(offer.deadline)}</strong>
            </div>
          </div>
        </div>
        <div class="card-footer bg-white border-top-0">
          <button class="btn btn-primary w-100" onclick="showOfferDetails(${offer.id})">
            <i class="fas fa-eye me-2"></i>View Details
          </button>
        </div>
      </div>
    `;
    offersList.appendChild(offerCard);
  });
}

// Function to show offer details
function showOfferDetails(offerId) {
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;
  
  const modal = new bootstrap.Modal(document.getElementById('offerDetailsModal'));
  
  document.getElementById('offerDetailsModalLabel').textContent = `Offer to ${offer.freelancerName}`;
  document.getElementById('offer-project-title').textContent = offer.jobTitle;
  
  const detailsContent = document.getElementById('offer-details-content');
  
  // Basic offer information
  let modalContent = `
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="d-flex align-items-center mb-3">
          <img src="${offer.freelancerAvatar}" alt="${offer.freelancerName}" class="avatar-md me-3">
          <div>
            <h5 class="mb-0">${offer.freelancerName}</h5>
            <p class="text-muted mb-0">${offer.freelancerTitle}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 text-md-end">
        <span class="offer-status ${getStatusBadgeClass(offer.status)}">${getStatusText(offer.status)}</span>
      </div>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="mb-3">
          <h6>Project Type</h6>
          <p>${getProjectTypeText(offer.projectType)}</p>
        </div>
        <div class="mb-3">
          <h6>Budget</h6>
          <p>$${offer.rate.toLocaleString()}</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="mb-3">
          <h6>Deadline</h6>
          <p>${formatDate(offer.deadline)}</p>
        </div>
        <div class="mb-3">
          <h6>Required Skills</h6>
          <div class="d-flex flex-wrap gap-2">
            ${offer.requiredSkills.map(skill => `
              <span class="badge bg-light text-dark">${skill}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    
    <div class="mb-4">
      <h6>Project Overview</h6>
      <p>${offer.projectOverview}</p>
    </div>
    
    <div class="mb-4">
      <h6>Your Message to Freelancer</h6>
      <p>${offer.clientMessage}</p>
    </div>
  `;
  
  // Add appropriate content based on offer status
  if (offer.status === 'accepted') {
    modalContent += `
      <div class="alert alert-success mb-4">
        <i class="fas fa-check-circle me-2"></i>
        This offer has been accepted by the freelancer.
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-light">
          <h6 class="mb-0"><i class="fas fa-reply me-2"></i>Freelancer's Response</h6>
        </div>
        <div class="card-body">
          <p class="mb-0">${offer.freelancerMessage}</p>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-light">
          <h6 class="mb-0"><i class="fas fa-envelope me-2"></i>Contact Information</h6>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center">
            <i class="fas fa-envelope-open-text me-2 text-primary"></i>
            <div>
              <p class="mb-0">Email: <a href="mailto:${offer.freelancerEmail}">${offer.freelancerEmail}</a></p>
              <small class="text-muted">You can now contact the freelancer directly to discuss project details.</small>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (offer.status === 'declined') {
    modalContent += `
      <div class="alert alert-danger mb-4">
        <i class="fas fa-times-circle me-2"></i>
        This offer was declined by the freelancer.
      </div>
      
      <div class="card mb-4">
        <div class="card-header bg-light">
          <h6 class="mb-0"><i class="fas fa-reply me-2"></i>Freelancer's Response</h6>
        </div>
        <div class="card-body">
          <p class="mb-0">${offer.freelancerMessage}</p>
        </div>
      </div>
    `;
  } else if (offer.status === 'pending') {
    modalContent += `
      <div class="alert alert-warning mb-4">
        <i class="fas fa-clock me-2"></i>
        This offer is pending a response from the freelancer.
      </div>
    `;
  }
  
  detailsContent.innerHTML = modalContent;
  
  // Hide the send offer button for all offer statuses
  document.getElementById('send-offer-btn').style.display = 'none';
  
  modal.show();
}

// Function to handle filter clicks
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Get filter value and render offers
      const filterValue = this.getAttribute('data-filter');
      renderOffers(filterValue);
    });
  });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
  displayCurrentDate();
  setupFilterButtons();
  renderOffers('all');
});