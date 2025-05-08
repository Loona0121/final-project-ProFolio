document.addEventListener('DOMContentLoaded', function() {
  // Job offer data - in a real app, this would come from a database/API
  const jobOffers = {
    job1: {
      clientName: "Michael Chen",
      jobTitle: "Senior Front-End Developer",
      message: "Hi Aran, I'm impressed with your portfolio and think you'd be a great fit for our project. Your experience with React and TypeScript aligns perfectly with what we're looking for. Would you be available to start within the next two weeks if you accept?\n\nLooking forward to your response.\n\n- Michael Chen, CTO at TechSolutions"
    },
    job2: {
      clientName: "Sarah Patel",
      jobTitle: "UI/UX Designer for Fintech App",
      message: "Hello Aran, I've been following your work for some time and I'm really impressed with your UI/UX portfolio. We're looking for someone with your expertise to help redesign our fintech application. The project would involve creating a more intuitive user experience, implementing modern design patterns, and conducting user testing.\n\nWe're aiming to start in the next month. Would you be interested?\n\n- Sarah Patel, Product Manager at FinEdge"
    },
    job3: {
      clientName: "David Rodriguez",
      jobTitle: "Full-Stack Developer for Learning Platform",
      message: "Hi Aran, We need a skilled full-stack developer like you to help build our online learning platform. Based on your experience with both frontend and backend technologies, I believe you'd be perfect for this role.\n\nThe project will utilize React for the frontend and Node.js with MongoDB for the backend. We're planning a 3-month engagement with potential for extension.\n\nPlease let me know if you're interested in discussing further details.\n\n- David Rodriguez, Lead Developer at EduLearn"
    }
  };

  // DOM Elements
  const jobOffersList = document.getElementById('job-offers-list');
  const jobOfferDetails = document.getElementById('job-offer-details');
  const detailClientName = document.getElementById('detail-client-name');
  const detailJobTitle = document.getElementById('detail-job-title');
  const detailMessage = document.getElementById('detail-message');
  
  let currentJobId = null;

  // Create modal containers for accept and reject dialogs if they don't exist
  initializeModals();

  // Add event listeners
  addEventListeners();

  /**
   * Initialize modal dialogs for accepting and rejecting offers
   */
  function initializeModals() {
    // Create Accept Offer Modal
    if (!document.getElementById('acceptOfferModal')) {
      const acceptModal = document.createElement('div');
      acceptModal.className = 'modal fade';
      acceptModal.id = 'acceptOfferModal';
      acceptModal.tabIndex = '-1';
      acceptModal.setAttribute('aria-labelledby', 'acceptOfferModalLabel');
      acceptModal.setAttribute('aria-hidden', 'true');
      
      acceptModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="acceptOfferModalLabel">Accept Job Offer</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>You're accepting: <strong id="acceptJobTitle"></strong></p>
              <form id="acceptOfferForm">
                <div class="mb-3">
                  <label for="contactEmail" class="form-label">Your Email</label>
                  <input type="email" class="form-control" id="contactEmail" placeholder="your@email.com" required>
                </div>
                <div class="mb-3">
                  <label for="acceptMessage" class="form-label">Message (Optional)</label>
                  <textarea class="form-control" id="acceptMessage" rows="4" placeholder="Thank you for the offer. I'm excited to work with you..."></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-success" id="confirmAccept">Accept Offer</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(acceptModal);
    }
    
    // Create Reject Offer Modal
    if (!document.getElementById('rejectOfferModal')) {
      const rejectModal = document.createElement('div');
      rejectModal.className = 'modal fade';
      rejectModal.id = 'rejectOfferModal';
      rejectModal.tabIndex = '-1';
      rejectModal.setAttribute('aria-labelledby', 'rejectOfferModalLabel');
      rejectModal.setAttribute('aria-hidden', 'true');
      
      rejectModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="rejectOfferModalLabel">Decline Job Offer</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>You're declining: <strong id="rejectJobTitle"></strong></p>
              <form id="rejectOfferForm">
                <div class="mb-3">
                  <label for="rejectMessage" class="form-label">Message (Optional)</label>
                  <textarea class="form-control" id="rejectMessage" rows="4" placeholder="Thank you for considering me, but I'm unable to take on this project at the moment..."></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmReject">Decline Offer</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(rejectModal);
    }

    // Create Toast Notification container
    if (!document.getElementById('toastContainer')) {
      const toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.id = 'toastContainer';
      document.body.appendChild(toastContainer);
    }
  }

  /**
   * Add all event listeners for the page
   */
  function addEventListeners() {
    // View Details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
      button.addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id');
        showJobDetails(jobId);
      });
    });
    
    // Back button
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', function() {
      jobOffersList.style.display = 'block';
      jobOfferDetails.style.display = 'none';
    });
    
    // Accept offer buttons
    const acceptButtons = document.querySelectorAll('.btn-accept');
    acceptButtons.forEach(button => {
      button.addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id');
        const jobTitle = jobId === 'current' ? detailJobTitle.textContent : this.getAttribute('data-job-title');
        showAcceptOfferModal(jobId === 'current' ? currentJobId : jobId, jobTitle);
      });
    });
    
    // Reject offer buttons
    const rejectButtons = document.querySelectorAll('.btn-reject');
    rejectButtons.forEach(button => {
      button.addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id');
        const jobTitle = jobId === 'current' ? detailJobTitle.textContent : this.getAttribute('data-job-title');
        showRejectOfferModal(jobId === 'current' ? currentJobId : jobId, jobTitle);
      });
    });
    
    // Confirm Accept button in modal
    document.getElementById('confirmAccept').addEventListener('click', function() {
      const form = document.getElementById('acceptOfferForm');
      const email = document.getElementById('contactEmail');
      
      // Validate email
      if (!email.value) {
        email.classList.add('is-invalid');
        return;
      }
      
      acceptOffer(currentJobId);
    });
    
    // Confirm Reject button in modal
    document.getElementById('confirmReject').addEventListener('click', function() {
      rejectOffer(currentJobId);
    });
  }

  /**
   * Display the job offer details
   * @param {string} jobId - The ID of the job to display
   */
  function showJobDetails(jobId) {
    if (jobOffers[jobId]) {
      const jobData = jobOffers[jobId];
      
      // Update the details view with the job data
      detailClientName.textContent = jobData.clientName;
      detailJobTitle.textContent = jobData.jobTitle;
      detailMessage.innerHTML = jobData.message.replace(/\n/g, '<br>');
      
      // Update the data-job-id for the action buttons in the details view
      const detailActionButtons = jobOfferDetails.querySelectorAll('.btn-accept, .btn-reject');
      detailActionButtons.forEach(button => {
        button.setAttribute('data-job-id', 'current');
        button.setAttribute('data-job-title', jobData.jobTitle);
      });
      
      // Save the current job ID
      currentJobId = jobId;
      
      // Show the details view and hide the list view
      jobOffersList.style.display = 'none';
      jobOfferDetails.style.display = 'block';
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }

  /**
   * Show the accept offer modal
   * @param {string} jobId - The ID of the job being accepted
   * @param {string} jobTitle - The title of the job being accepted
   */
  function showAcceptOfferModal(jobId, jobTitle) {
    currentJobId = jobId;
    
    // Set the job title in the modal
    document.getElementById('acceptJobTitle').textContent = jobTitle;
    
    // Reset the form
    document.getElementById('acceptOfferForm').reset();
    document.getElementById('contactEmail').classList.remove('is-invalid');
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('acceptOfferModal'));
    modal.show();
  }

  /**
   * Show the reject offer modal
   * @param {string} jobId - The ID of the job being rejected
   * @param {string} jobTitle - The title of the job being rejected
   */
  function showRejectOfferModal(jobId, jobTitle) {
    currentJobId = jobId;
    
    // Set the job title in the modal
    document.getElementById('rejectJobTitle').textContent = jobTitle;
    
    // Reset the form
    document.getElementById('rejectOfferForm').reset();
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('rejectOfferModal'));
    modal.show();
  }

  /**
   * Accept the job offer
   * @param {string} jobId - The ID of the job being accepted
   */
  function acceptOffer(jobId) {
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('acceptMessage').value;
    
    // In a real app, you would send this data to your server
    console.log(`Accepting job ${jobId}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('acceptOfferModal'));
    modal.hide();
    
    // Remove the job offer from the list
    removeJobOffer(jobId);
    
    // Show success notification
    showNotification('Offer Accepted', `You've successfully accepted the job offer.`, 'success');
  }

  /**
   * Reject the job offer
   * @param {string} jobId - The ID of the job being rejected
   */
  function rejectOffer(jobId) {
    const message = document.getElementById('rejectMessage').value;
    
    // In a real app, you would send this data to your server
    console.log(`Rejecting job ${jobId}`);
    console.log(`Message: ${message}`);
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('rejectOfferModal'));
    modal.hide();
    
    // Remove the job offer from the list
    removeJobOffer(jobId);
    
    // Show success notification
    showNotification('Offer Declined', `You've declined the job offer.`, 'danger');
  }

  /**
   * Remove a job offer from the list and return to the list view if necessary
   * @param {string} jobId - The ID of the job to remove
   */
  function removeJobOffer(jobId) {
    // Remove the job offer element from the DOM
    const jobElement = document.querySelector(`.job-offer-item[data-job-id="${jobId}"]`);
    if (jobElement) {
      jobElement.style.opacity = '0';
      setTimeout(() => {
        jobElement.remove();
        
        // If there are no more jobs, show a message
        const remainingJobs = document.querySelectorAll('.job-offer-item');
        if (remainingJobs.length === 0) {
          const noJobsMessage = document.createElement('div');
          noJobsMessage.className = 'alert alert-info';
          noJobsMessage.textContent = 'You have no job offers at the moment.';
          document.querySelector('.job-offers-container').appendChild(noJobsMessage);
        }
      }, 300);
    }
    
    // If we're in the details view, go back to the list view
    if (jobOfferDetails.style.display === 'block') {
      jobOffersList.style.display = 'block';
      jobOfferDetails.style.display = 'none';
    }
  }

  /**
   * Show a toast notification
   * @param {string} title - The title of the notification
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (success, danger, etc.)
   */
  function showNotification(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong>${title}</strong>: ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    // Initialize and show the toast
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 3000
    });
    toast.show();
    
    // Remove toast from DOM after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
      toastElement.remove();
    });
  }
});