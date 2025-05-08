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
    projectOverview: "Complete redesign of our e-commerce platform focusing on user experience and conversion optimization.",
    clientMessage: "Looking for a talented designer to help modernize our online store. Your portfolio shows exactly the aesthetic we're looking for, and your experience with conversion optimization is impressive. We'd like to discuss our project with you if you're available.",
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
    projectOverview: "Development of a cross-platform mobile application for our fitness tracking service.",
    clientMessage: "We need an experienced mobile developer to create our new fitness app. We love your previous work with React Native projects, particularly your attention to performance optimization. Our app will need to interface with wearable devices.",
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
    projectOverview: "Development of a comprehensive content marketing strategy to increase our brand visibility.",
    clientMessage: "We're looking for a content strategist to help boost our online presence. Your case studies show impressive ROI for your clients, and we're hoping you can bring that same expertise to our company. We'd like to develop a 6-month content roadmap.",
    freelancerName: "Emily Rodriguez",
    freelancerAvatar: "/api/placeholder/40/40",
    freelancerTitle: "Content Strategist",
    offerDate: "2025-04-05",
    status: "pending"
  },
  {
    id: 4,
    jobTitle: "WordPress Blog Migration",
    projectOverview: "Migration of existing blog content to a new WordPress platform with minimal downtime.",
    clientMessage: "Need help migrating our blog to a new WordPress installation with custom theme. We have about 200 posts to migrate, along with comments and user accounts. Your WordPress expertise looks perfect for this job.",
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
    projectOverview: "Redesign of company logo to better reflect our updated brand values and mission.",
    clientMessage: "Looking for a creative designer to refresh our company logo. We're pivoting our brand toward sustainability and eco-friendliness and need our visual identity to reflect this change. Your previous branding work shows you understand how to communicate values through design.",
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

// Function to render offers list
function renderOffers(filterStatus = 'all') {
  const offersList = document.getElementById('offers-list');
  offersList.innerHTML = '';
  
  let filteredOffers = offers;
  if (filterStatus !== 'all') {
    filteredOffers = offers.filter(offer => offer.status === filterStatus);
  }
  
  if (filteredOffers.length === 0) {
    offersList.innerHTML = `
      <div class="no-offers">
        <i class="fas fa-inbox fa-3x mb-3"></i>
        <h4>No offers found</h4>
        <p>There are no offers matching your current filter.</p>
      </div>
    `;
    return;
  }
  
  filteredOffers.forEach(offer => {
    const offerElement = document.createElement('article');
    offerElement.className = 'offer-item';
    offerElement.setAttribute('data-offer-id', offer.id);
    
    offerElement.innerHTML = `
      <div class="offer-content">
        <div class="freelancer-info">
          <div class="freelancer-avatar">
            <i class="fas fa-user"></i>
          </div>
          <h4 class="freelancer-name">${offer.freelancerName}</h4>
        </div>
        <h3 class="job-title">${offer.jobTitle}</h3>
        <div class="offer-message">
          <p class="message-truncate">${offer.clientMessage}</p>
        </div>
      </div>
      <div class="offer-actions">
        <button class="btn btn-outline-primary view-details-btn" data-offer-id="${offer.id}">View Details</button>
        <span class="status-badge ${getStatusBadgeClass(offer.status)}">${getStatusText(offer.status)}</span>
      </div>
    `;
    
    offersList.appendChild(offerElement);
  });
  
  // Add event listeners to view details buttons
  document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', function() {
      const offerId = parseInt(this.getAttribute('data-offer-id'));
      showOfferDetails(offerId);
    });
  });
}

// Function to show offer details
function showOfferDetails(offerId) {
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;
  
  // Hide offers list section and show details section
  document.getElementById('offers-list-section').style.display = 'none';
  document.getElementById('offer-details').style.display = 'block';
  
  // Update detail view with offer information
  document.getElementById('detail-freelancer-name').textContent = offer.freelancerName;
  document.getElementById('detail-freelancer-title').textContent = offer.freelancerTitle;
  document.getElementById('detail-job-title').textContent = offer.jobTitle;
  document.getElementById('detail-status').textContent = getStatusText(offer.status);
  document.getElementById('detail-status').className = `status-badge ${getStatusBadgeClass(offer.status)}`;
  
  // Update client message
  document.getElementById('detail-client-message').innerHTML = `
    <p>${offer.clientMessage}</p>
    <p class="message-signature">- ${document.getElementById('sidebar-name').textContent}, Client</p>
  `;
  
  // Handle freelancer response based on status
  const freelancerMessageElement = document.getElementById('detail-freelancer-message');
  const contactInfoElement = document.getElementById('detail-contact-info');
  
  if (offer.status === 'accepted') {
    freelancerMessageElement.style.display = 'block';
    document.getElementById('detail-response-text').textContent = offer.freelancerMessage;
    document.getElementById('detail-freelancer-signature').textContent = `- ${offer.freelancerName}, ${offer.freelancerTitle}`;
    
    // Show contact info for accepted offers
    contactInfoElement.style.display = 'block';
    document.getElementById('detail-email').textContent = offer.freelancerEmail;
    document.getElementById('detail-email').href = `mailto:${offer.freelancerEmail}`;
  } 
  else if (offer.status === 'declined') {
    freelancerMessageElement.style.display = 'block';
    document.getElementById('detail-response-text').textContent = offer.freelancerMessage;
    document.getElementById('detail-freelancer-signature').textContent = `- ${offer.freelancerName}, ${offer.freelancerTitle}`;
    
    // Hide contact info for declined offers
    contactInfoElement.style.display = 'none';
  }
  else {
    // Hide both for pending offers
    freelancerMessageElement.style.display = 'none';
    contactInfoElement.style.display = 'none';
  }
}

// Function to handle back button click
function setupBackButton() {
  const backButton = document.querySelector('.back-btn');
  backButton.addEventListener('click', function() {
    document.getElementById('offer-details').style.display = 'none';
    document.getElementById('offers-list-section').style.display = 'block';
  });
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
  setupBackButton();
  renderOffers('all');
});