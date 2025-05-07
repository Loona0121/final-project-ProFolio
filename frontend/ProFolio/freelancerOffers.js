// Job Offers functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements for job offers
    const jobOffersList = document.getElementById('job-offers-list');
    const jobOffersContainer = document.querySelector('.job-offers-container');
    const jobDetailsPanel = document.getElementById('job-offer-details');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const backToListButton = document.querySelector('.back-to-list');
    const acceptButtons = document.querySelectorAll('.accept-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    const acceptOfferDetailBtn = document.querySelector('.accept-offer-btn');
    const declineOfferDetailBtn = document.querySelector('.decline-offer-btn');
  
    // View job details functionality
    if (viewDetailsButtons.length > 0) {
      viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
          const jobId = this.getAttribute('data-job-id');
          showJobDetails(jobId);
          
          // Hide list, show details
          if (jobOffersList) jobOffersList.style.display = 'none';
          if (jobDetailsPanel) jobDetailsPanel.style.display = 'block';
        });
      });
    }
  
    // Back to list functionality
    if (backToListButton) {
      backToListButton.addEventListener('click', function() {
        if (jobOffersList) jobOffersList.style.display = 'block';
        if (jobDetailsPanel) jobDetailsPanel.style.display = 'none';
      });
    }
  
    // Reject offer buttons (card)
    if (rejectButtons.length > 0) {
      rejectButtons.forEach(button => {
        button.addEventListener('click', function() {
          const jobItem = this.closest('.job-offer-full-item');
          const jobTitle = jobItem.querySelector('.job-title').textContent;
          showRejectModal(jobItem, jobTitle);
        });
      });
    }
  
    // Accept offer buttons (card)
    if (acceptButtons.length > 0) {
      acceptButtons.forEach(button => {
        button.addEventListener('click', function() {
          const jobItem = this.closest('.job-offer-full-item');
          const jobTitle = jobItem.querySelector('.job-title').textContent;
          showAcceptModal(jobItem, jobTitle);
        });
      });
    }
  
    // Accept offer button (details view)
    if (acceptOfferDetailBtn) {
      acceptOfferDetailBtn.addEventListener('click', function() {
        const jobTitle = document.getElementById('detail-job-title').textContent;
        const jobItem = getJobItemByTitle(jobTitle);
        showAcceptModal(jobItem, jobTitle, true);
      });
    }
  
    // Decline offer button (details view)
    if (declineOfferDetailBtn) {
      declineOfferDetailBtn.addEventListener('click', function() {
        const jobTitle = document.getElementById('detail-job-title').textContent;
        const jobItem = getJobItemByTitle(jobTitle);
        showRejectModal(jobItem, jobTitle, true);
      });
    }
  
    // Helper function to find job item by title
    function getJobItemByTitle(title) {
      const allJobItems = document.querySelectorAll('.job-offer-full-item');
      for (const item of allJobItems) {
        if (item.querySelector('.job-title').textContent === title) {
          return item;
        }
      }
      return null;
    }
  
    // Job details data (simplified for the example)
    const jobDetailsData = {
      'job1': {
        clientName: 'Michael Chen',
        clientRole: 'CTO at TechSolutions',
        clientEmail: 'michael@techsolutions.com',
        jobTitle: 'Senior Front-End Developer',
        description: 'Looking for an experienced developer to lead our front-end team on a new SaaS platform. You\'ll be working with React, TypeScript, and Redux to build responsive and user-friendly interfaces.',
        projectType: 'Contract (3-6 months)',
        rate: '$60-80/hr',
        deadline: 'June 15, 2025',
        skills: ['React', 'TypeScript', 'Redux', 'CSS-in-JS', 'RESTful APIs', 'Git', 'CI/CD', 'Agile'],
        scope: [
          'Design and implement user-facing features for our SaaS platform',
          'Build reusable components and libraries for future use',
          'Optimize application for maximum speed and scalability',
          'Collaborate with back-end developers to integrate frontend with API services',
          'Implement responsive design and ensure cross-browser compatibility'
        ],
        message: 'Hi Aran, I\'m impressed with your portfolio and think you\'d be a great fit for our project. Your experience with React and TypeScript aligns perfectly with what we\'re looking for. Would you be available to start within the next two weeks if you accept?'
      },
      'job2': {
        clientName: 'Sarah Patel',
        clientRole: 'Product Manager at FinTech Innovations',
        clientEmail: 'sarah@fintechinnovations.com',
        jobTitle: 'UI/UX Designer for Fintech App',
        description: 'Seeking a talented UI/UX designer to redesign our mobile banking application. You\'ll be responsible for creating intuitive user flows and visually appealing interfaces for our finance platform.',
        projectType: 'Full-time',
        rate: '$90K-110K/year',
        deadline: 'ASAP',
        skills: ['Figma', 'Mobile Design', 'User Testing', 'Fintech', 'UI/UX', 'Wireframing', 'Prototyping'],
        scope: [
          'Redesign our mobile banking application',
          'Create user flows and wireframes',
          'Design visually appealing interfaces',
          'Conduct user testing and implement feedback',
          'Collaborate with development team on implementation'
        ],
        message: 'Hello Aran, We\'ve been following your work and are impressed with your UI/UX design skills. Our banking app needs a complete redesign and we believe you have the right experience to help us create an intuitive and beautiful user experience.'
      },
      'job3': {
        clientName: 'David Rodriguez',
        clientRole: 'Founder at EduLearn',
        clientEmail: 'david@edulearn.com',
        jobTitle: 'Full-Stack Developer for Learning Platform',
        description: 'We need a skilled full-stack developer to help build our online learning platform. The project involves both frontend and backend development with a focus on performance and scalability.',
        projectType: 'Project-based',
        rate: '$12,000 fixed',
        deadline: 'July 30, 2025',
        skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'Express', 'Redux', 'REST APIs'],
        scope: [
          'Develop front-end and back-end components',
          'Implement authentication and user management',
          'Create database schema and API endpoints',
          'Set up AWS infrastructure and deployment pipelines',
          'Ensure platform scalability and performance'
        ],
        message: 'Hi Aran, I found your portfolio through a recommendation and was impressed by your full-stack projects. We\'re building an educational platform and need someone with your skills to help us create a solid foundation. The timeline is flexible but we\'d like to launch before August.'
      }
    };
  
    // Function to show job details
    function showJobDetails(jobId) {
      const jobData = jobDetailsData[jobId];
      if (!jobData) return;
  
      // Set client info
      document.getElementById('detail-client-name').textContent = jobData.clientName;
      
      // Set client meta info
      const clientMetaElements = document.querySelectorAll('.client-meta span');
      if (clientMetaElements.length >= 2) {
        clientMetaElements[0].innerHTML = `<i class="fas fa-briefcase"></i> ${jobData.clientRole}`;
        clientMetaElements[1].innerHTML = `<i class="fas fa-envelope"></i> ${jobData.clientEmail}`;
      }
  
      // Set job details
      document.getElementById('detail-job-title').textContent = jobData.jobTitle;
      document.getElementById('detail-description').textContent = jobData.description;
      document.getElementById('detail-type').textContent = jobData.projectType;
      document.getElementById('detail-rate').textContent = jobData.rate;
      document.getElementById('detail-deadline').textContent = jobData.deadline;
  
      // Set skills
      const skillsContainer = document.getElementById('detail-skills');
      skillsContainer.innerHTML = '';
      jobData.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'tag';
        skillTag.textContent = skill;
        skillsContainer.appendChild(skillTag);
      });
  
      // Set project scope
      const scopeList = document.querySelector('.job-detail-list');
      if (scopeList) {
        scopeList.innerHTML = '';
        jobData.scope.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = item;
          scopeList.appendChild(listItem);
        });
      }
  
      // Set client message
      const clientMessageElement = document.querySelector('.client-message p:first-child');
      if (clientMessageElement) {
        clientMessageElement.textContent = jobData.message;
      }
    }
  
    // Function to show accept modal
    function showAcceptModal(jobItem, jobTitle, fromDetails = false) {
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'modal-overlay';
      
      // Create modal
      const modal = document.createElement('div');
      modal.className = 'job-action-modal accept-modal';
      
      // Modal content
      modal.innerHTML = `
        <div class="modal-header">
          <h3><i class="fas fa-check-circle text-success"></i> Accept Job Offer</h3>
          <button class="close-modal-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p>You are about to accept the job: <strong>${jobTitle}</strong></p>
          <div class="form-group mt-3">
            <label for="accept-message">Additional details (optional):</label>
            <textarea id="accept-message" class="form-control" rows="3" placeholder="Thank you for the offer. I'm excited to work on this project..."></textarea>
          </div>
          <div class="form-group mt-3">
            <label for="contact-email">Please reach out to me at:</label>
            <input type="email" id="contact-email" class="form-control" placeholder="your@email.com">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light cancel-modal-btn">Cancel</button>
          <button class="btn btn-success confirm-accept-btn">Accept Offer</button>
        </div>
      `;
      
      // Add to DOM
      modalOverlay.appendChild(modal);
      document.body.appendChild(modalOverlay);
      
      // Show with animation
      setTimeout(() => {
        modalOverlay.classList.add('show');
        modal.classList.add('show');
      }, 10);
      
      // Close modal handlers
      const closeButton = modal.querySelector('.close-modal-btn');
      const cancelButton = modal.querySelector('.cancel-modal-btn');
      const confirmButton = modal.querySelector('.confirm-accept-btn');
      
      [closeButton, cancelButton].forEach(btn => {
        btn.addEventListener('click', () => {
          closeModal(modalOverlay, modal);
        });
      });
      
      // Confirm accept handler
      confirmButton.addEventListener('click', () => {
        const message = modal.querySelector('#accept-message').value;
        const email = modal.querySelector('#contact-email').value;
        
        // Close modal
        closeModal(modalOverlay, modal);
        
        // Remove job from list
        if (jobItem) {
          removeJobWithAnimation(jobItem);
        }
        
        // If accepting from details view, go back to list
        if (fromDetails) {
          if (jobOffersList) jobOffersList.style.display = 'block';
          if (jobDetailsPanel) jobDetailsPanel.style.display = 'none';
        }
        
        // Show success notification
        showNotification(`Offer accepted: ${jobTitle}`, 'success');
      });
    }
    
    // Function to show reject modal
    function showRejectModal(jobItem, jobTitle, fromDetails = false) {
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'modal-overlay';
      
      // Create modal
      const modal = document.createElement('div');
      modal.className = 'job-action-modal reject-modal';
      
      // Modal content
      modal.innerHTML = `
        <div class="modal-header">
          <h3><i class="fas fa-times-circle text-danger"></i> Decline Job Offer</h3>
          <button class="close-modal-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <p>You are about to decline the job: <strong>${jobTitle}</strong></p>
          <div class="form-group mt-3">
            <label for="reject-reason">Reason for declining (optional):</label>
            <textarea id="reject-reason" class="form-control" rows="3" placeholder="Thank you for considering me, but I'm not available..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-light cancel-modal-btn">Cancel</button>
          <button class="btn btn-danger confirm-reject-btn">Decline Offer</button>
        </div>
      `;
      
      // Add to DOM
      modalOverlay.appendChild(modal);
      document.body.appendChild(modalOverlay);
      
      // Show with animation
      setTimeout(() => {
        modalOverlay.classList.add('show');
        modal.classList.add('show');
      }, 10);
      
      // Close modal handlers
      const closeButton = modal.querySelector('.close-modal-btn');
      const cancelButton = modal.querySelector('.cancel-modal-btn');
      const confirmButton = modal.querySelector('.confirm-reject-btn');
      
      [closeButton, cancelButton].forEach(btn => {
        btn.addEventListener('click', () => {
          closeModal(modalOverlay, modal);
        });
      });
      
      // Confirm reject handler
      confirmButton.addEventListener('click', () => {
        const reason = modal.querySelector('#reject-reason').value;
        
        // Close modal
        closeModal(modalOverlay, modal);
        
        // Remove job from list
        if (jobItem) {
          removeJobWithAnimation(jobItem);
        }
        
        // If rejecting from details view, go back to list
        if (fromDetails) {
          if (jobOffersList) jobOffersList.style.display = 'block';
          if (jobDetailsPanel) jobDetailsPanel.style.display = 'none';
        }
        
        // Show rejected notification
        showNotification(`Offer declined: ${jobTitle}`, 'danger');
      });
    }
    
    // Helper function to close modal with animation
    function closeModal(overlay, modal) {
      modal.classList.remove('show');
      overlay.classList.remove('show');
      
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
    
    // Function to remove job item with animation
    function removeJobWithAnimation(jobItem) {
      jobItem.style.overflow = 'hidden';
      jobItem.style.transition = 'all 0.5s ease';
      jobItem.style.maxHeight = jobItem.offsetHeight + 'px';
      
      // Start animation
      setTimeout(() => {
        jobItem.style.opacity = '0';
        jobItem.style.maxHeight = '0';
        jobItem.style.padding = '0';
        jobItem.style.margin = '0';
        
        // Remove after animation
        setTimeout(() => {
          jobItem.remove();
          
          // Check if there are no more job items
          if (document.querySelectorAll('.job-offer-full-item').length === 0) {
            // Show no jobs message
            const noJobsMessage = document.createElement('div');
            noJobsMessage.className = 'no-jobs-message';
            noJobsMessage.innerHTML = `
              <div class="text-center py-5">
                <i class="fas fa-briefcase text-muted mb-3" style="font-size: 3rem;"></i>
                <h3>No Active Job Offers</h3>
                <p class="text-muted">You have no pending job offers at the moment. Check back later for new opportunities!</p>
              </div>
            `;
            
            jobOffersContainer.appendChild(noJobsMessage);
          }
        }, 500);
      }, 50);
    }
    
    // Function to show notifications
    function showNotification(message, type = 'success') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      
      // Set icon based on notification type
      let icon = 'check-circle';
      if (type === 'danger' || type === 'warning') {
        icon = 'times-circle';
      } else if (type === 'info') {
        icon = 'info-circle';
      }
      
      // Add content
      notification.innerHTML = `
        <i class="fas fa-${icon}"></i> ${message}
      `;
      
      // Add to DOM
      document.body.appendChild(notification);
      
      // Show with animation
      setTimeout(() => {
        notification.classList.add('show');
      }, 10);
      
      // Auto remove after delay
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }
  
    // Add CSS for notifications and modals
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #fff;
        color: #333;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1100;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
      }
      
      .notification.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .notification-success {
        border-left: 4px solid #28a745;
      }
      
      .notification-danger {
        border-left: 4px solid #dc3545;
      }
      
      .notification-info {
        border-left: 4px solid #17a2b8;
      }
      
      .notification-warning {
        border-left: 4px solid #ffc107;
      }
      
      .notification i {
        font-size: 18px;
      }
      
      .notification-success i {
        color: #28a745;
      }
      
      .notification-danger i {
        color: #dc3545;
      }
      
      .notification-info i {
        color: #17a2b8;
      }
      
      .notification-warning i {
        color: #ffc107;
      }
      
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .modal-overlay.show {
        opacity: 1;
      }
      
      .job-action-modal {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        width: 90%;
        max-width: 500px;
        transition: all 0.3s ease;
        transform: scale(0.9);
        opacity: 0;
      }
      
      .job-action-modal.show {
        transform: scale(1);
        opacity: 1;
      }
      
      .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .modal-header h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .close-modal-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        transition: color 0.2s ease;
      }
      
      .close-modal-btn:hover {
        color: #333;
      }
      
      .modal-body {
        padding: 20px;
      }
      
      .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    `;
    document.head.appendChild(style);
  });