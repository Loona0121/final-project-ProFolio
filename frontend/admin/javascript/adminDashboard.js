// AdminDashboard.js - Functionality for ProFolio Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSidebar();
    initializeVerificationQueue();
    initializeReports();
    initializePolicies();
    initializeActivityLog();
    initializeNotifications();
    initializeSearch();
    initializeStatsCards();
    initializeTooltips();
    
    // Update current date display
    updateDateDisplay();
});

// ======= SIDEBAR FUNCTIONALITY =======
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    const mainContent = document.getElementById('main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('show');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('show');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 768 && 
            sidebar.classList.contains('show') && 
            !sidebar.contains(event.target) && 
            event.target !== sidebarToggle) {
            sidebar.classList.remove('show');
        }
    });
    
    // Adjust for window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('show');
        }
    });
}

// ======= VERIFICATION FUNCTIONALITY =======
function initializeVerificationQueue() {
    // Individual verification actions
    const approveButtons = document.querySelectorAll('.verification-table .btn-success');
    const rejectButtons = document.querySelectorAll('.verification-table .btn-danger');
    const infoButtons = document.querySelectorAll('.verification-table .btn-info');
    
    // Process All buttons
    const processAllButton = document.querySelector('.card-footer .btn-primary');
    
    // Export list button
    const exportListButton = document.querySelector('.card-footer .btn-outline-secondary');
    
    // Add click events to approve buttons
    approveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const userName = row.querySelector('h6').textContent;
            approveVerification(row, userName);
        });
    });
    
    // Add click events to reject buttons
    rejectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const userName = row.querySelector('h6').textContent;
            openRejectModal(row, userName);
        });
    });
    
    // Add click events to "request more info" buttons
    infoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const userName = row.querySelector('h6').textContent;
            requestMoreInfo(row, userName);
        });
    });
    
    // Process All button functionality
    if (processAllButton) {
        processAllButton.addEventListener('click', function() {
            openProcessAllModal();
        });
    }
    
    // Export list functionality
    if (exportListButton) {
        exportListButton.addEventListener('click', function() {
            exportVerificationList();
        });
    }
    
    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.verification-table .btn-outline-primary');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const userName = row.querySelector('h6').textContent;
            viewPortfolio(userName);
        });
    });
    
    // Add event listeners to document view icons
    const docViewLinks = document.querySelectorAll('.verification-table .text-primary');
    docViewLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const userName = row.querySelector('h6').textContent;
            viewDocuments(userName);
        });
    });
}

function approveVerification(row, userName) {
    showToast('Success', `Approved verification for ${userName}`, 'success');
    
    // Update the status badge
    const statusBadge = row.querySelector('.badge');
    statusBadge.textContent = 'Approved';
    statusBadge.classList.remove('bg-warning', 'bg-info');
    statusBadge.classList.add('bg-success');
    
    // Disable action buttons
    const actionButtons = row.querySelectorAll('.btn-group .btn');
    actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
    
    // Create and add a "View Profile" button instead
    const btnGroup = row.querySelector('.btn-group');
    btnGroup.innerHTML = `
        <button class="btn btn-sm btn-primary" title="View Profile">
            <i class="fas fa-user me-1"></i>View Profile
        </button>
    `;
    
    // Add to activity log
    addActivityLogEntry('user-check', `You approved verification for <strong>${userName}</strong>`);
    
    // Update verification count in stats
    updateVerificationCount(-1);
    
    // Animate the row
    row.style.backgroundColor = '#d1e7dd';
    setTimeout(() => {
        row.style.transition = 'background-color 1s ease';
        row.style.backgroundColor = '';
    }, 100);
}

function openRejectModal(row, userName) {
    // Create modal if it doesn't exist
    if (!document.getElementById('rejectModal')) {
        const modalHTML = `
            <div class="modal fade" id="rejectModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Reject Verification</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You are about to reject the verification request for <strong id="rejectUserName"></strong>.</p>
                            <div class="mb-3">
                                <label for="rejectReason" class="form-label">Reason for rejection:</label>
                                <select class="form-select" id="rejectReason">
                                    <option value="">Select a reason</option>
                                    <option value="incomplete">Incomplete information</option>
                                    <option value="fake">Suspected fake documentation</option>
                                    <option value="quality">Portfolio quality doesn't meet standards</option>
                                    <option value="guidelines">Doesn't follow community guidelines</option>
                                    <option value="other">Other (specify below)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="rejectDetails" class="form-label">Additional details:</label>
                                <textarea class="form-control" id="rejectDetails" rows="3" placeholder="Provide specific details about the rejection..."></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="allowResubmit" checked>
                                <label class="form-check-label" for="allowResubmit">
                                    Allow resubmission after corrections
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmReject">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener to confirm button
        document.getElementById('confirmReject').addEventListener('click', function() {
            const reason = document.getElementById('rejectReason').value;
            const details = document.getElementById('rejectDetails').value;
            const allowResubmit = document.getElementById('allowResubmit').checked;
            const userName = document.getElementById('rejectUserName').textContent;
            
            // Find the row by username
            const rows = document.querySelectorAll('.verification-table tr');
            let targetRow = null;
            
            rows.forEach(r => {
                const name = r.querySelector('h6')?.textContent;
                if (name === userName) {
                    targetRow = r;
                }
            });
            
            if (targetRow) {
                rejectVerification(targetRow, userName, reason, details, allowResubmit);
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('rejectModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
    
    // Set the user name in the modal
    document.getElementById('rejectUserName').textContent = userName;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('rejectModal'));
    modal.show();
}

function rejectVerification(row, userName, reason, details, allowResubmit) {
    // Update the status badge
    const statusBadge = row.querySelector('.badge');
    statusBadge.textContent = 'Rejected';
    statusBadge.classList.remove('bg-warning', 'bg-info');
    statusBadge.classList.add('bg-danger');
    
    // Disable action buttons
    const actionButtons = row.querySelectorAll('.btn-group .btn');
    actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
    
    // Create and add a "View Rejection" button instead
    const btnGroup = row.querySelector('.btn-group');
    btnGroup.innerHTML = `
        <button class="btn btn-sm btn-outline-danger" title="View Rejection Details">
            <i class="fas fa-times-circle me-1"></i>View Rejection
        </button>
    `;
    
    // Show toast notification
    showToast('Rejection Sent', `Rejected verification for ${userName}`, 'danger');
    
    // Add to activity log
    addActivityLogEntry('user-times', `You rejected verification for <strong>${userName}</strong>`);
    
    // Update verification count in stats
    updateVerificationCount(-1);
    
    // Animate the row
    row.style.backgroundColor = '#f8d7da';
    setTimeout(() => {
        row.style.transition = 'background-color 1s ease';
        row.style.backgroundColor = '';
    }, 100);
}

function requestMoreInfo(row, userName) {
    // Create modal if it doesn't exist
    if (!document.getElementById('requestInfoModal')) {
        const modalHTML = `
            <div class="modal fade" id="requestInfoModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Request Additional Information</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Request additional information from <strong id="requestInfoUserName"></strong>.</p>
                            <div class="mb-3">
                                <label class="form-label">What information is needed?</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="infoIdentity">
                                    <label class="form-check-label" for="infoIdentity">
                                        Identity verification documents
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="infoPortfolio">
                                    <label class="form-check-label" for="infoPortfolio">
                                        Portfolio clarification
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="infoCredentials">
                                    <label class="form-check-label" for="infoCredentials">
                                        Professional credentials
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="infoReference">
                                    <label class="form-check-label" for="infoReference">
                                        Client/Employer references
                                    </label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="infoDetails" class="form-label">Specific details:</label>
                                <textarea class="form-control" id="infoDetails" rows="3" placeholder="Please specify exactly what documentation is needed..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmRequestInfo">Send Request</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener to confirm button
        document.getElementById('confirmRequestInfo').addEventListener('click', function() {
            const details = document.getElementById('infoDetails').value;
            const userName = document.getElementById('requestInfoUserName').textContent;
            
            // Find the row by username
            const rows = document.querySelectorAll('.verification-table tr');
            let targetRow = null;
            
            rows.forEach(r => {
                const name = r.querySelector('h6')?.textContent;
                if (name === userName) {
                    targetRow = r;
                }
            });
            
            if (targetRow) {
                sendInfoRequest(targetRow, userName, details);
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('requestInfoModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
    
    // Set the user name in the modal
    document.getElementById('requestInfoUserName').textContent = userName;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('requestInfoModal'));
    modal.show();
}

function sendInfoRequest(row, userName, details) {
    // Update the status badge
    const statusBadge = row.querySelector('.badge');
    statusBadge.textContent = 'Additional Info Requested';
    statusBadge.classList.remove('bg-warning', 'bg-danger');
    statusBadge.classList.add('bg-info');
    
    // Show toast notification
    showToast('Request Sent', `Requested additional information from ${userName}`, 'info');
    
    // Add to activity log
    addActivityLogEntry('info-circle', `You requested additional information from <strong>${userName}</strong>`);
    
    // Animate the row
    row.style.backgroundColor = '#cff4fc';
    setTimeout(() => {
        row.style.transition = 'background-color 1s ease';
        row.style.backgroundColor = '';
    }, 100);
}

function openProcessAllModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('processAllModal')) {
        const modalHTML = `
            <div class="modal fade" id="processAllModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Process All Verification Requests</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You're about to process all pending verification requests. Please select the action to take:</p>
                            <div class="mb-3">
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="processAction" id="actionApproveAll" value="approve">
                                    <label class="form-check-label" for="actionApproveAll">
                                        Approve all pending requests
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="processAction" id="actionRejectAll" value="reject">
                                    <label class="form-check-label" for="actionRejectAll">
                                        Reject all pending requests
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="processAction" id="actionReviewIndividually" value="review" checked>
                                    <label class="form-check-label" for="actionReviewIndividually">
                                        Assign to reviewers for individual assessment
                                    </label>
                                </div>
                            </div>
                            <div id="reviewerSection">
                                <div class="mb-3">
                                    <label for="assignReviewer" class="form-label">Assign to reviewer:</label>
                                    <select class="form-select" id="assignReviewer">
                                        <option value="current">Myself</option>
                                        <option value="jane">Admin Jane</option>
                                        <option value="mark">Admin Mark</option>
                                        <option value="john">Admin John</option>
                                        <option value="claire">Admin Claire</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewPriority" class="form-label">Priority level:</label>
                                    <select class="form-select" id="reviewPriority">
                                        <option value="high">High - Complete within 24 hours</option>
                                        <option value="medium" selected>Medium - Complete within 3 days</option>
                                        <option value="low">Low - Complete when possible</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div id="rejectionReasonSection" style="display: none;">
                                <div class="mb-3">
                                    <label for="bulkRejectReason" class="form-label">Standard rejection reason:</label>
                                    <select class="form-select" id="bulkRejectReason">
                                        <option value="guidelines">Does not meet community guidelines</option>
                                        <option value="incomplete">Incomplete information provided</option>
                                        <option value="policy">Policy violation detected</option>
                                        <option value="other">Other (requires specification)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="bulkRejectDetails" class="form-label">Additional details:</label>
                                    <textarea class="form-control" id="bulkRejectDetails" rows="3"></textarea>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="bulkAllowResubmit" checked>
                                    <label class="form-check-label" for="bulkAllowResubmit">
                                        Allow resubmission after corrections
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmProcessAll">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Toggle reason section visibility based on selection
        document.querySelectorAll('input[name="processAction"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const rejectionSection = document.getElementById('rejectionReasonSection');
                const reviewerSection = document.getElementById('reviewerSection');
                
                if (this.value === 'reject') {
                    rejectionSection.style.display = 'block';
                    reviewerSection.style.display = 'none';
                } else if (this.value === 'review') {
                    rejectionSection.style.display = 'none';
                    reviewerSection.style.display = 'block';
                } else {
                    rejectionSection.style.display = 'none';
                    reviewerSection.style.display = 'none';
                }
            });
        });
        
        // Add event listener to confirm button
        document.getElementById('confirmProcessAll').addEventListener('click', function() {
            const action = document.querySelector('input[name="processAction"]:checked').value;
            
            if (action === 'approve') {
                processAllApprove();
            } else if (action === 'reject') {
                const reason = document.getElementById('bulkRejectReason').value;
                const details = document.getElementById('bulkRejectDetails').value;
                const allowResubmit = document.getElementById('bulkAllowResubmit').checked;
                processAllReject(reason, details, allowResubmit);
            } else if (action === 'review') {
                const reviewer = document.getElementById('assignReviewer').value;
                const priority = document.getElementById('reviewPriority').value;
                processAllAssign(reviewer, priority);
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('processAllModal'));
            modal.hide();
        });
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('processAllModal'));
    modal.show();
}

function processAllApprove() {
    const pendingRows = getPendingVerificationRows();
    const count = pendingRows.length;
    
    pendingRows.forEach(row => {
        const userName = row.querySelector('h6').textContent;
        approveVerification(row, userName);
    });
    
    showToast('Bulk Action', `Approved ${count} verification requests`, 'success');
    
    // Add to activity log
    addActivityLogEntry('check-double', `You approved <strong>${count} verification requests</strong> in bulk`);
}

function processAllReject(reason, details, allowResubmit) {
    const pendingRows = getPendingVerificationRows();
    const count = pendingRows.length;
    
    pendingRows.forEach(row => {
        const userName = row.querySelector('h6').textContent;
        rejectVerification(row, userName, reason, details, allowResubmit);
    });
    
    showToast('Bulk Action', `Rejected ${count} verification requests`, 'danger');
    
    // Add to activity log
    addActivityLogEntry('times-circle', `You rejected <strong>${count} verification requests</strong> in bulk`);
}

function processAllAssign(reviewer, priority) {
    const pendingRows = getPendingVerificationRows();
    const count = pendingRows.length;
    
    // Update all pending requests with assignment label
    pendingRows.forEach(row => {
        const statusBadge = row.querySelector('.badge');
        
        // Add assignment badge
        const assignedTo = reviewer === 'current' ? 'You' : `Admin ${reviewer.charAt(0).toUpperCase() + reviewer.slice(1)}`;
        const priorityClass = {
            'high': 'bg-danger',
            'medium': 'bg-warning',
            'low': 'bg-info'
        }[priority];
        
        // Create assignment label
        const assignmentLabel = document.createElement('div');
        assignmentLabel.classList.add('mt-1');
        assignmentLabel.innerHTML = `<small class="badge ${priorityClass}" style="font-size: 10px;">
            <i class="fas fa-user-check me-1"></i>Assigned to ${assignedTo}
        </small>`;
        
        // Add to row
        statusBadge.parentNode.appendChild(assignmentLabel);
    });
    
    showToast('Bulk Action', `Assigned ${count} verification requests for review`, 'primary');
    
    // Add to activity log
    addActivityLogEntry('tasks', `You assigned <strong>${count} verification requests</strong> for review`);
}

function getPendingVerificationRows() {
    // Get rows with "Pending Review" status
    const rows = document.querySelectorAll('.verification-table tbody tr');
    const pendingRows = [];
    
    rows.forEach(row => {
        const statusBadge = row.querySelector('.badge');
        if (statusBadge && statusBadge.textContent === 'Pending Review') {
            pendingRows.push(row);
        }
    });
    
    return pendingRows;
}

function exportVerificationList() {
    showToast('Export Started', 'Exporting verification list as CSV...', 'primary');
    
    setTimeout(() => {
        showToast('Export Complete', 'Verification list has been exported successfully', 'success');
    }, 1500);
}

function viewPortfolio(userName) {
    // Create modal if it doesn't exist
    if (!document.getElementById('portfolioViewModal')) {
        const modalHTML = `
            <div class="modal fade" id="portfolioViewModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Portfolio Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="portfolioContent" class="bg-light p-3 rounded">
                                <div class="text-center mb-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading portfolio content...</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-primary">
                                <i class="fas fa-external-link-alt me-1"></i>Open in New Tab
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('portfolioViewModal'));
    modal.show();
    
    // Set the title
    document.querySelector('#portfolioViewModal .modal-title').textContent = `Portfolio Preview - ${userName}`;
    
    // Simulate loading portfolio content
    setTimeout(() => {
        let portfolioHTML = '';
        
        // Generate sample portfolio content based on username
        if (userName === 'Sarah Johnson') {
            portfolioHTML = `
                <div class="portfolio-header mb-4">
                    <div class="d-flex align-items-center">
                        <img src="/api/placeholder/64/64" alt="User avatar" class="rounded-circle me-3">
                        <div>
                            <h4 class="mb-1">Sarah Johnson</h4>
                            <p class="text-muted mb-2">Web Developer & UI Designer</p>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary me-2">HTML5</span>
                                <span class="badge bg-primary me-2">CSS3</span>
                                <span class="badge bg-primary me-2">JavaScript</span>
                                <span class="badge bg-primary me-2">React</span>
                                <span class="badge bg-primary">Node.js</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <h5>About Me</h5>
                    <p>Front-end developer with 5+ years of experience crafting responsive and accessible web applications. Passionate about creating intuitive user experiences and clean, maintainable code.</p>
                </div>
                <div class="mb-4">
                    <h5>Featured Projects</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="card h-100">
                                <img src="/api/placeholder/300/200" class="card-img-top" alt="Project thumbnail">
                                <div class="card-body">
                                    <h6 class="card-title">E-commerce Platform</h6>
                                    <p class="card-text small">Built with React, Node.js, and MongoDB. Features include user authentication, product filtering, and payment integration.</p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <small class="text-muted">Completed April 2024</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100">
                                <img src="/api/placeholder/300/200" class="card-img-top" alt="Project thumbnail">
                                <div class="card-body">
                                    <h6 class="card-title">Weather Dashboard App</h6>
                                    <p class="card-text small">Responsive weather application with location detection, 5-day forecast, and interactive maps.</p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <small class="text-muted">Completed January 2025</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (userName === 'Tech Solutions Inc.') {
            portfolioHTML = `
                <div class="portfolio-header mb-4">
                    <div class="d-flex align-items-center">
                        <img src="/api/placeholder/64/64" alt="Company logo" class="rounded me-3">
                        <div>
                            <h4 class="mb-1">Tech Solutions Inc.</h4>
                            <p class="text-muted mb-2">IT Services & Software Development</p>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary me-2">Enterprise Solutions</span>
                                <span class="badge bg-primary me-2">Cloud Infrastructure</span>
                                <span class="badge bg-primary">Cybersecurity</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <h5>About Us</h5>
                    <p>Tech Solutions Inc. is a trusted provider of innovative IT solutions and software development services for enterprise clients. With over 15 years in the industry, we specialize in digital transformation, cloud infrastructure, and custom software development.</p>
                </div>
                <div class="mb-4">
                    <h5>Featured Projects</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="card h-100">
                                <img src="/api/placeholder/300/200" class="card-img-top" alt="Project thumbnail">
                                <div class="card-body">
                                    <h6 class="card-title">Enterprise Resource Planning System</h6>
                                    <p class="card-text small">Custom ERP solution for manufacturing industry with inventory management, order processing, and business analytics.</p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <small class="text-muted">Completed September 2024</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100">
                                <img src="/api/placeholder/300/200" class="card-img-top" alt="Project thumbnail">
                                <div class="card-body">
                                    <h6 class="card-title">Cloud Migration & Infrastructure</h6>
                                    <p class="card-text small">Successful migration of legacy systems to AWS with improved security, scalability, and 40% cost reduction.</p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <small class="text-muted">Completed March 2025</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (userName === 'Alex Chen') {
            portfolioHTML = `
                <div class="portfolio-header mb-4">
                    <div class="d-flex align-items-center">
                        <img src="/api/placeholder/64/64" alt="User avatar" class="rounded-circle me-3">
                        <div>
                            <h4 class="mb-1">Alex Chen</h4>
                            <p class="text-muted mb-2">UX/UI Designer</p>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary me-2">Figma</span>
                                <span class="badge bg-primary me-2">Adobe XD</span>
                                <span class="badge bg-primary me-2">Prototyping</span>
                                <span class="badge bg-primary">User Research</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <h5>About Me</h5>
                    <p>Passionate UX/UI designer with 7+ years of experience creating user-centered digital experiences. Skilled in translating business requirements into intuitive interfaces that drive engagement and conversion.</p>
                </div>
                <div class="mb-4">
                    <h5>Featured Projects</h5>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="card h-100">
                                <img src="/api/placeholder/300/200" class="card-img-top" alt="Project thumbnail">
                                <div class="card-body">
                                    <h6 class="card-title">Healthcare Mobile App</h6>
                                    <p class="card-text small">Award-winning patient portal app with intuitive appointment scheduling, medical records access, and telehealth features.</p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <small class="text-muted">Completed July 2024</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100">
                                <img src="/api/placeholder/300/200" class="card-img-top" alt="Project thumbnail">
                                <div class="card-body">
                                    <h6 class="card-title">Finance Dashboard Redesign</h6>
                                    <p class="card-text small">Complete redesign of financial analytics dashboard with improved data visualization and user flow, resulting in 30% improvement in task completion time.</p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <small class="text-muted">Completed February 2025</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default portfolio for other users
            portfolioHTML = `
                <div class="portfolio-header mb-4">
                    <div class="d-flex align-items-center">
                        <img src="/api/placeholder/64/64" alt="User avatar" class="rounded-circle me-3">
                        <div>
                            <h4 class="mb-1">${userName}</h4>
                            <p class="text-muted mb-2">Creative Professional</p>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-primary me-2">Design</span>
                                <span class="badge bg-primary me-2">Development</span>
                                <span class="badge bg-primary">Creative</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <h5>About</h5>
                    <p>This is a sample portfolio for demonstration purposes. In a real application, this would contain actual portfolio data for ${userName}.</p>
                </div>
                <div class="mb-4">
                    <h5>Projects</h5>
                    <div class="d-flex justify-content-center align-items-center p-5">
                        <div class="text-center text-muted">
                            <i class="fas fa-folder-open fa-3x mb-3"></i>
                            <p>Portfolio projects will be displayed here once verification is complete.</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('portfolioContent').innerHTML = portfolioHTML;
        
        // Add to activity log
        addActivityLogEntry('eye', `You viewed ${userName}'s portfolio`);
    }, 1000);
}

function viewDocuments(userName) {
    // Create modal if it doesn't exist
    if (!document.getElementById('documentViewModal')) {
        const modalHTML = `
            <div class="modal fade" id="documentViewModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Verification Documents</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="documentContent" class="bg-light p-3 rounded">
                                <div class="text-center mb-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading documents...</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-primary" id="downloadDocsBtn">
                                <i class="fas fa-download me-1"></i>Download All
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener for download button
        document.getElementById('downloadDocsBtn').addEventListener('click', function() {
            const username = document.querySelector('#documentViewModal .modal-title').textContent.replace('Verification Documents - ', '');
            downloadVerificationDocuments(username);
        });
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('documentViewModal'));
    modal.show();
    
    // Set the title
    document.querySelector('#documentViewModal .modal-title').textContent = `Verification Documents - ${userName}`;
    
    // Simulate loading document content
    setTimeout(() => {
        let documentHTML = '';
        
        // Generate sample document content based on username
        if (userName === 'Sarah Johnson') {
            documentHTML = `
                <div class="documents-section">
                    <h5 class="mb-3">ID Verification</h5>
                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-id-card me-2 text-primary"></i>Driver's License</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 14, 2025</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="ID preview">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-user-circle me-2 text-primary"></i>Photo Verification</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 14, 2025</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="Photo verification">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="mb-3">Professional Credentials</h5>
                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-graduation-cap me-2 text-primary"></i>Degree Certificate</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 14, 2025</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="Certificate preview">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-award me-2 text-primary"></i>Professional Certification</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 14, 2025</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="Certification preview">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="mb-3">Additional Documents</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-file-alt me-2 text-primary"></i>Reference Letter</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 14, 2025</p>
                                    <div class="document-preview mb-2">
                                        <div class="p-3 bg-light rounded text-center">
                                            <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                                            <p class="mb-0">reference_letter.pdf</p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (userName === 'Tech Solutions Inc.') {
            documentHTML = `
                <div class="documents-section">
                    <h5 class="mb-3">Company Verification</h5>
                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-building me-2 text-primary"></i>Business Registration</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 10, 2025</p>
                                    <div class="document-preview mb-2">
                                        <div class="p-3 bg-light rounded text-center">
                                            <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                                            <p class="mb-0">business_registration.pdf</p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-shield-alt me-2 text-primary"></i>Tax ID Verification</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 10, 2025</p>
                                    <div class="document-preview mb-2">
                                        <div class="p-3 bg-light rounded text-center">
                                            <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                                            <p class="mb-0">tax_id_verification.pdf</p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h5 class="mb-3">Industry Certifications</h5>
                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-award me-2 text-primary"></i>ISO 27001 Certification</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 10, 2025</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="ISO certification">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-award me-2 text-primary"></i>Cloud Partnership Certificate</h6>
                                    <p class="card-text small mb-2">Uploaded on: April 10, 2025</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="Partnership certificate">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default document view for other users
            documentHTML = `
                <div class="documents-section">
                    <h5 class="mb-3">Verification Documents</h5>
                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-id-card me-2 text-primary"></i>Identity Verification</h6>
                                    <p class="card-text small mb-2">Uploaded recently</p>
                                    <div class="document-preview mb-2">
                                        <img src="/api/placeholder/300/180" class="img-fluid rounded" alt="ID preview">
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title"><i class="fas fa-file-alt me-2 text-primary"></i>Supporting Document</h6>
                                    <p class="card-text small mb-2">Uploaded recently</p>
                                    <div class="document-preview mb-2">
                                        <div class="p-3 bg-light rounded text-center">
                                            <i class="fas fa-file-pdf fa-3x text-danger mb-2"></i>
                                            <p class="mb-0">document.pdf</p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-search-plus me-1"></i>View</button>
                                        <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-download me-1"></i>Download</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('documentContent').innerHTML = documentHTML;
        
        // Add event listeners to document view buttons
        const viewButtons = document.querySelectorAll('#documentContent .btn-outline-primary');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const documentName = this.closest('.card-body').querySelector('.card-title').textContent.trim();
                openDocumentPreview(documentName, userName);
            });
        });
        
        // Add event listeners to document download buttons
        const downloadButtons = document.querySelectorAll('#documentContent .btn-outline-secondary');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const documentName = this.closest('.card-body').querySelector('.card-title').textContent.trim();
                downloadDocument(documentName, userName);
            });
        });
        
        // Add to activity log
        addActivityLogEntry('file-alt', `You viewed verification documents for <strong>${userName}</strong>`);
    }, 1000);
}

function downloadVerificationDocuments(userName) {
    showToast('Download Started', `Downloading all verification documents for ${userName}...`, 'primary');
    
    setTimeout(() => {
        showToast('Download Complete', 'All documents have been downloaded successfully', 'success');
    }, 1500);
}

function downloadDocument(documentName, userName) {
    showToast('Download Started', `Downloading ${documentName}...`, 'primary');
    
    setTimeout(() => {
        showToast('Download Complete', `${documentName} has been downloaded successfully`, 'success');
    }, 1000);
}

function openDocumentPreview(documentName, userName) {
    // Create modal if it doesn't exist
    if (!document.getElementById('documentPreviewModal')) {
        const modalHTML = `
            <div class="modal fade" id="documentPreviewModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Document Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div id="documentPreviewContent" class="text-center p-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p class="mt-2">Loading document preview...</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-primary" id="downloadPreviewBtn">
                                <i class="fas fa-download me-1"></i>Download
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener for download button
        document.getElementById('downloadPreviewBtn').addEventListener('click', function() {
            const documentName = document.querySelector('#documentPreviewModal .modal-title').textContent.replace('Document Preview - ', '');
            const userName = document.querySelector('#documentViewModal .modal-title').textContent.replace('Verification Documents - ', '');
            downloadDocument(documentName, userName);
        });
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('documentPreviewModal'));
    modal.show();
    
    // Set the title
    document.querySelector('#documentPreviewModal .modal-title').textContent = `Document Preview - ${documentName}`;
    
    // Simulate loading document preview
    setTimeout(() => {
        let previewHTML = '';
        
        // Check if document name suggests it's an image or a PDF
        if (documentName.includes('ID') || documentName.includes('Photo') || documentName.includes('Certificate') || documentName.includes('ISO')) {
            previewHTML = `
                <div class="document-full-preview">
                    <img src="/api/placeholder/600/800" class="img-fluid rounded" alt="Document preview">
                </div>
            `;
        } else {
            previewHTML = `
                <div class="document-full-preview p-4">
                    <div class="text-center mb-4">
                        <i class="fas fa-file-pdf fa-5x text-danger"></i>
                        <h5 class="mt-3">${documentName}.pdf</h5>
                        <p class="text-muted">PDF Document</p>
                    </div>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        PDF preview is not available. Please download the document to view its contents.
                    </div>
                </div>
            `;
        }
        
        document.getElementById('documentPreviewContent').innerHTML = previewHTML;
    }, 1000);
}

// ======= REPORTS FUNCTIONALITY =======
function initializeReports() {
    // Resolve buttons
    const resolveButtons = document.querySelectorAll('.report-actions .btn-success');
    
    // Dismiss buttons
    const dismissButtons = document.querySelectorAll('.report-actions .btn-secondary');
    
    // Escalate buttons
    const escalateButtons = document.querySelectorAll('.report-actions .btn-danger');
    
    // Add click events to resolve buttons
    resolveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.closest('.report-item');
            const reportTitle = item.querySelector('.report-title').textContent;
            resolveReport(item, reportTitle);
        });
    });
    
    // Add click events to dismiss buttons
    dismissButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.closest('.report-item');
            const reportTitle = item.querySelector('.report-title').textContent;
            dismissReport(item, reportTitle);
        });
    });
    
    // Add click events to escalate buttons
    escalateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const item = this.closest('.report-item');
            const reportTitle = item.querySelector('.report-title').textContent;
            escalateReport(item, reportTitle);
        });
    });
    
    // View details functionality
    const reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(item => {
        const reportTitle = item.querySelector('.report-title');
        if (reportTitle) {
            reportTitle.addEventListener('click', function() {
                const reportText = this.textContent;
                openReportDetails(reportText, item);
            });
        }
    });
}

function resolveReport(item, reportTitle) {
    // Open resolution modal
    openResolveModal(item, reportTitle);
}

function openResolveModal(item, reportTitle) {
    // Create modal if it doesn't exist
    if (!document.getElementById('resolveReportModal')) {
        const modalHTML = `
            <div class="modal fade" id="resolveReportModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Resolve Report</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You are about to mark the following report as resolved:</p>
                            <p><strong id="resolveReportTitle"></strong></p>
                            <div class="mb-3">
                                <label for="resolutionDetails" class="form-label">Resolution details:</label>
                                <textarea class="form-control"id="resolutionDetails" rows="3" placeholder="Provide details about how this report was resolved..."></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="notifyReporter" checked>
                                <label class="form-check-label" for="notifyReporter">
                                    Notify reporter about resolution
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="takeFurtherAction">
                                <label class="form-check-label" for="takeFurtherAction">
                                    Take further action on reported content/user
                                </label>
                            </div>
                            <div id="furtherActionSection" class="mb-3" style="display: none;">
                                <label for="furtherActionType" class="form-label">Action type:</label>
                                <select class="form-select" id="furtherActionType">
                                    <option value="warning">Issue warning</option>
                                    <option value="suspend">Temporarily suspend account</option>
                                    <option value="remove">Remove content</option>
                                    <option value="ban">Permanently ban account</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-success" id="confirmResolve">Confirm Resolution</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Toggle further action section visibility
        document.getElementById('takeFurtherAction').addEventListener('change', function() {
            document.getElementById('furtherActionSection').style.display = this.checked ? 'block' : 'none';
        });
        
        // Add event listener to confirm button
        document.getElementById('confirmResolve').addEventListener('click', function() {
            const resolutionDetails = document.getElementById('resolutionDetails').value;
            const notifyReporter = document.getElementById('notifyReporter').checked;
            const takeFurtherAction = document.getElementById('takeFurtherAction').checked;
            const furtherActionType = takeFurtherAction ? document.getElementById('furtherActionType').value : null;
            const reportTitle = document.getElementById('resolveReportTitle').textContent;
            
            // Find the item by report title
            const reportItems = document.querySelectorAll('.report-item');
            let targetItem = null;
            
            reportItems.forEach(item => {
                const title = item.querySelector('.report-title')?.textContent;
                if (title === reportTitle) {
                    targetItem = item;
                }
            });
            
            if (targetItem) {
                completeReportResolution(targetItem, reportTitle, resolutionDetails, notifyReporter, takeFurtherAction, furtherActionType);
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('resolveReportModal'));
            modal.hide();
        });
    }
    
    // Set the report title in the modal
    document.getElementById('resolveReportTitle').textContent = reportTitle;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('resolveReportModal'));
    modal.show();
}

function completeReportResolution(item, reportTitle, resolutionDetails, notifyReporter, takeFurtherAction, furtherActionType) {
    // Update the item status
    const statusBadge = item.querySelector('.badge');
    if (statusBadge) {
        statusBadge.textContent = 'Resolved';
        statusBadge.classList.remove('bg-danger', 'bg-warning');
        statusBadge.classList.add('bg-success');
    }
    
    // Disable the action buttons
    const actionButtons = item.querySelectorAll('.report-actions .btn');
    actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
    
    // Add resolution info
    const reportInfo = item.querySelector('.report-info');
    if (reportInfo) {
        const resolvedByEl = document.createElement('div');
        resolvedByEl.classList.add('text-muted', 'mt-2', 'small');
        resolvedByEl.innerHTML = `
            <i class="fas fa-check-circle text-success me-1"></i> 
            Resolved by you on ${new Date().toLocaleDateString()}
        `;
        reportInfo.appendChild(resolvedByEl);
    }
    
    // Show appropriate toast notification
    let toastMessage = `Report "${reportTitle}" has been resolved`;
    if (takeFurtherAction) {
        const actionTypes = {
            'warning': 'Warning issued',
            'suspend': 'Account temporarily suspended',
            'remove': 'Content removed',
            'ban': 'Account permanently banned'
        };
        toastMessage += ` and ${actionTypes[furtherActionType] || 'action taken'}`;
    }
    showToast('Report Resolved', toastMessage, 'success');
    
    // Add to activity log
    addActivityLogEntry('check-circle', `You resolved report: <strong>${reportTitle}</strong>`);
    
    // Update report count in stats
    updateReportCount(-1);
    
    // Animate the item
    item.style.backgroundColor = '#d1e7dd';
    setTimeout(() => {
        item.style.transition = 'background-color 1s ease';
        item.style.backgroundColor = '';
    }, 100);
}

function dismissReport(item, reportTitle) {
    // Create modal if it doesn't exist
    if (!document.getElementById('dismissReportModal')) {
        const modalHTML = `
            <div class="modal fade" id="dismissReportModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Dismiss Report</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You are about to dismiss the following report:</p>
                            <p><strong id="dismissReportTitle"></strong></p>
                            <div class="mb-3">
                                <label for="dismissReason" class="form-label">Reason for dismissal:</label>
                                <select class="form-select" id="dismissReason">
                                    <option value="">Select a reason</option>
                                    <option value="invalid">Invalid report</option>
                                    <option value="noviolation">No policy violation found</option>
                                    <option value="duplicate">Duplicate report</option>
                                    <option value="other">Other (specify below)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="dismissDetails" class="form-label">Additional details:</label>
                                <textarea class="form-control" id="dismissDetails" rows="3" placeholder="Provide details about why this report is being dismissed..."></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="notifyDismissReporter" checked>
                                <label class="form-check-label" for="notifyDismissReporter">
                                    Notify reporter about dismissal
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmDismiss">Confirm Dismissal</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener to confirm button
        document.getElementById('confirmDismiss').addEventListener('click', function() {
            const dismissReason = document.getElementById('dismissReason').value;
            const dismissDetails = document.getElementById('dismissDetails').value;
            const notifyReporter = document.getElementById('notifyDismissReporter').checked;
            const reportTitle = document.getElementById('dismissReportTitle').textContent;
            
            // Find the item by report title
            const reportItems = document.querySelectorAll('.report-item');
            let targetItem = null;
            
            reportItems.forEach(item => {
                const title = item.querySelector('.report-title')?.textContent;
                if (title === reportTitle) {
                    targetItem = item;
                }
            });
            
            if (targetItem) {
                completeReportDismissal(targetItem, reportTitle, dismissReason, dismissDetails, notifyReporter);
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('dismissReportModal'));
            modal.hide();
        });
    }
    
    // Set the report title in the modal
    document.getElementById('dismissReportTitle').textContent = reportTitle;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('dismissReportModal'));
    modal.show();
}

function completeReportDismissal(item, reportTitle, dismissReason, dismissDetails, notifyReporter) {
    // Update the item status
    const statusBadge = item.querySelector('.badge');
    if (statusBadge) {
        statusBadge.textContent = 'Dismissed';
        statusBadge.classList.remove('bg-danger', 'bg-warning');
        statusBadge.classList.add('bg-secondary');
    }
    
    // Disable the action buttons
    const actionButtons = item.querySelectorAll('.report-actions .btn');
    actionButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
    });
    
    // Add dismissal info
    const reportInfo = item.querySelector('.report-info');
    if (reportInfo) {
        const dismissedByEl = document.createElement('div');
        dismissedByEl.classList.add('text-muted', 'mt-2', 'small');
        dismissedByEl.innerHTML = `
            <i class="fas fa-times-circle text-secondary me-1"></i> 
            Dismissed by you on ${new Date().toLocaleDateString()}
        `;
        reportInfo.appendChild(dismissedByEl);
    }
    
    // Show toast notification
    showToast('Report Dismissed', `Report "${reportTitle}" has been dismissed`, 'secondary');
    
    // Add to activity log
    addActivityLogEntry('times-circle', `You dismissed report: <strong>${reportTitle}</strong>`);
    
    // Update report count in stats
    updateReportCount(-1);
    
    // Animate the item
    item.style.backgroundColor = '#e2e3e5';
    setTimeout(() => {
        item.style.transition = 'background-color 1s ease';
        item.style.backgroundColor = '';
    }, 100);
}

function escalateReport(item, reportTitle) {
    // Create modal if it doesn't exist
    if (!document.getElementById('escalateReportModal')) {
        const modalHTML = `
            <div class="modal fade" id="escalateReportModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Escalate Report</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You are about to escalate the following report:</p>
                            <p><strong id="escalateReportTitle"></strong></p>
                            <div class="mb-3">
                                <label for="escalationLevel" class="form-label">Escalation level:</label>
                                <select class="form-select" id="escalationLevel">
                                    <option value="senior">Senior administrator</option>
                                    <option value="legal">Legal team</option>
                                    <option value="security">Security team</option>
                                    <option value="management">Management team</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="escalationDetails" class="form-label">Escalation details:</label>
                                <textarea class="form-control" id="escalationDetails" rows="3" placeholder="Provide details about why this report requires escalation..."></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="escalationUrgent">
                                <label class="form-check-label" for="escalationUrgent">
                                    Mark as urgent (requires immediate attention)
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="confirmEscalate">Confirm Escalation</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener to confirm button
        document.getElementById('confirmEscalate').addEventListener('click', function() {
            const escalationLevel = document.getElementById('escalationLevel').value;
            const escalationDetails = document.getElementById('escalationDetails').value;
            const isUrgent = document.getElementById('escalationUrgent').checked;
            const reportTitle = document.getElementById('escalateReportTitle').textContent;
            
            // Find the item by report title
            const reportItems = document.querySelectorAll('.report-item');
            let targetItem = null;
            
            reportItems.forEach(item => {
                const title = item.querySelector('.report-title')?.textContent;
                if (title === reportTitle) {
                    targetItem = item;
                }
            });
            
            if (targetItem) {
                completeReportEscalation(targetItem, reportTitle, escalationLevel, escalationDetails, isUrgent);
            }
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('escalateReportModal'));
            modal.hide();
        });
    }
    
    // Set the report title in the modal
    document.getElementById('escalateReportTitle').textContent = reportTitle;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('escalateReportModal'));
    modal.show();
}

function completeReportEscalation(item, reportTitle, escalationLevel, escalationDetails, isUrgent) {
    // Update the item status
    const statusBadge = item.querySelector('.badge');
    if (statusBadge) {
        statusBadge.textContent = 'Escalated';
        statusBadge.classList.remove('bg-warning');
        statusBadge.classList.add('bg-danger');
    }
    
    // Add urgent marker if needed
    if (isUrgent) {
        const urgentMarker = document.createElement('span');
        urgentMarker.classList.add('badge', 'bg-danger', 'ms-1');
        urgentMarker.innerHTML = '<i class="fas fa-exclamation-circle"></i> URGENT';
        statusBadge.after(urgentMarker);
    }
    
    // Update the action buttons
    const actionContainer = item.querySelector('.report-actions');
    if (actionContainer) {
        actionContainer.innerHTML = `
            <button class="btn btn-sm btn-outline-danger w-100 mb-1" disabled>
                <i class="fas fa-arrow-up me-1"></i>Escalated to ${getEscalationLevelName(escalationLevel)}
            </button>
            <button class="btn btn-sm btn-outline-secondary w-100">
                <i class="fas fa-eye me-1"></i>View Escalation Details
            </button>
        `;
    }
    
    // Add escalation info
    const reportInfo = item.querySelector('.report-info');
    if (reportInfo) {
        const escalatedByEl = document.createElement('div');
        escalatedByEl.classList.add('text-muted', 'mt-2', 'small');
        escalatedByEl.innerHTML = `
            <i class="fas fa-arrow-circle-up text-danger me-1"></i> 
            Escalated by you on ${new Date().toLocaleDateString()}
        `;
        reportInfo.appendChild(escalatedByEl);
    }
    
    // Show toast notification
    showToast('Report Escalated', `Report "${reportTitle}" has been escalated to ${getEscalationLevelName(escalationLevel)}`, 'danger');
    
    // Add to activity log
    addActivityLogEntry('arrow-circle-up', `You escalated report: <strong>${reportTitle}</strong> to ${getEscalationLevelName(escalationLevel)}`);
    
    // Animate the item
    item.style.backgroundColor = '#f8d7da';
    setTimeout(() => {
        item.style.transition = 'background-color 1s ease';
        item.style.backgroundColor = '';
    }, 100);
}

function getEscalationLevelName(level) {
    const levels = {
        'senior': 'Senior Admin',
        'legal': 'Legal Team',
        'security': 'Security Team',
        'management': 'Management'
    };
    return levels[level] || level;
}

function openReportDetails(reportTitle, item) {
    // Create modal if it doesn't exist
    if (!document.getElementById('reportDetailsModal')) {
        const modalHTML = `
            <div class="modal fade" id="reportDetailsModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Report Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="report-details-content">
                                <div class="text-center p-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading report details...</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="btn-group me-auto">
                                <button type="button" class="btn btn-success" id="modalResolveReport">
                                    <i class="fas fa-check me-1"></i>Resolve
                                </button>
                                <button type="button" class="btn btn-secondary" id="modalDismissReport">
                                    <i class="fas fa-times me-1"></i>Dismiss
                                </button>
                                <button type="button" class="btn btn-danger" id="modalEscalateReport">
                                    <i class="fas fa-arrow-up me-1"></i>Escalate
                                </button>
                            </div>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners to modal action buttons
        document.getElementById('modalResolveReport').addEventListener('click', function() {
            const title = document.querySelector('#reportDetailsModal .report-subject').textContent;
            const items = document.querySelectorAll('.report-item');
            let targetItem = null;
            
            items.forEach(item => {
                const itemTitle = item.querySelector('.report-title')?.textContent;
                if (itemTitle === title) {
                    targetItem = item;
                }
            });
            
            if (targetItem) {
                // Hide details modal
                const detailsModal = bootstrap.Modal.getInstance(document.getElementById('reportDetailsModal'));
                detailsModal.hide();
                
                // Open resolve modal
                setTimeout(() => {
                    resolveReport(targetItem, title);
                }, 500);
            }
        });
        
        document.getElementById('modalDismissReport').addEventListener('click', function() {
            const title = document.querySelector('#reportDetailsModal .report-subject').textContent;
            const items = document.querySelectorAll('.report-item');
            let targetItem = null;
            
            items.forEach(item => {
                const itemTitle = item.querySelector('.report-title')?.textContent;
                if (itemTitle === title) {
                    targetItem = item;
                }
            });
            
            if (targetItem) {
                // Hide details modal
                const detailsModal = bootstrap.Modal.getInstance(document.getElementById('reportDetailsModal'));
                detailsModal.hide();
                
                // Open dismiss modal
                setTimeout(() => {
                    dismissReport(targetItem, title);
                }, 500);
            }
        });
        
        document.getElementById('modalEscalateReport').addEventListener('click', function() {
            const title = document.querySelector('#reportDetailsModal .report-subject').textContent;
            const items = document.querySelectorAll('.report-item');
            let targetItem = null;
            
            items.forEach(item => {
                const itemTitle = item.querySelector('.report-title')?.textContent;
                if (itemTitle === title) {
                    targetItem = item;
                }
            });
            
            if (targetItem) {
                // Hide details modal
                const detailsModal = bootstrap.Modal.getInstance(document.getElementById('reportDetailsModal'));
                detailsModal.hide();
                
                // Open escalate modal
                setTimeout(() => {
                    escalateReport(targetItem, title);
                }, 500);
            }
        });
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('reportDetailsModal'));
    modal.show();
    
    // Set the modal title
    document.querySelector('#reportDetailsModal .modal-title').textContent = `Report Details - ${reportTitle}`;
    
    // Get the report status from the item
    const statusText = item.querySelector('.badge')?.textContent || 'Pending';
    const statusClass = item.querySelector('.badge')?.classList.contains('bg-danger') ? 'danger' : 
                      item.querySelector('.badge')?.classList.contains('bg-success') ? 'success' : 'warning';
    
    // Get reporter and reported entity info
    const reporterName = item.querySelector('.report-reporter')?.textContent || 'Anonymous User';
    const reportedEntity = item.querySelector('.report-against')?.textContent || 'Unknown';
    const reportDate = item.querySelector('.report-date')?.textContent || new Date().toLocaleDateString();
    
    // Simulate loading report details
    setTimeout(() => {
        let detailsHTML = '';
        
        // Generate report details based on report title
        const reportType = reportTitle.includes('Copyright') ? 'copyright' : 
                          reportTitle.includes('harassment') ? 'harassment' : 
                          reportTitle.includes('Fake') ? 'fake' : 'general';
        
        // Create header section
        detailsHTML = `
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="report-subject mb-0">${reportTitle}</h5>
                    <span class="badge bg-${statusClass}">${statusText}</span>
                </div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title mb-3"><i class="fas fa-user-shield me-2 text-primary"></i>Reporter</h6>
                                <div class="d-flex align-items-center mb-2">
                                    <img src="/api/placeholder/40/40" class="rounded-circle me-2" alt="Reporter avatar">
                                    <div>
                                        <strong>${reporterName}</strong>
                                        <div class="small text-muted">Member since: Jan 2024</div>
                                    </div>
                                </div>
                                <hr>
                                <div class="small">
                                    <div class="mb-1"><i class="fas fa-envelope me-2 text-muted"></i>${reporterName.toLowerCase().replace(' ', '.')}@example.com</div>
                                    <div class="mb-1"><i class="fas fa-flag me-2 text-muted"></i>Previous reports: 2</div>
                                    <div><i class="fas fa-calendar me-2 text-muted"></i>Reported on: ${reportDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title mb-3"><i class="fas fa-exclamation-triangle me-2 text-warning"></i>Reported Entity</h6>
                                <div class="d-flex align-items-center mb-2">
                                    <img src="/api/placeholder/40/40" class="rounded-circle me-2" alt="Reported entity avatar">
                                    <div>
                                        <strong>${reportedEntity}</strong>
                                        <div class="small text-muted">Member since: Mar 2023</div>
                                    </div>
                                </div>
                                <hr>
                                <div class="small">
                                    <div class="mb-1"><i class="fas fa-envelope me-2 text-muted"></i>${reportedEntity.toLowerCase().replace(' ', '.')}@example.com</div>
                                    <div class="mb-1"><i class="fas fa-exclamation-circle me-2 text-muted"></i>Previous violations: 0</div>
                                    <div><i class="fas fa-check-circle me-2 text-muted"></i>Account status: Active</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Report details section based on type
        if (reportType === 'copyright') {
            detailsHTML += `
                <div class="mb-4">
                    <h6 class="mb-3">Report Details</h6>
                    <div class="card">
                        <div class="card-body">
                            <div class="mb-3">
                                <strong>Copyright Claim Information:</strong>
                                <p class="mt-2">The reported portfolio contains design assets that infringe on our copyright. These designs were created by our team and are being presented as the user's original work.</p>
                            </div>
                            <div class="mb-3">
                                <strong>Original Work Documentation:</strong>
                                <div class="d-flex mt-2">
                                    <div class="me-2">
                                        <div class="border rounded p-2 text-center">
                                            <i class="fas fa-file-pdf fa-2x text-danger"></i>
                                            <div class="small mt-1">copyright_proof.pdf</div>
                                        </div>
                                    </div>
                                    <div class="me-2">
                                        <div class="border rounded p-2 text-center">
                                            <i class="fas fa-file-image fa-2x text-primary"></i>
                                            <div class="small mt-1">original_design.jpg</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="border rounded p-2 text-center">
                                            <i class="fas fa-file-contract fa-2x text-info"></i>
                                            <div class="small mt-1">legal_notice.pdf</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <strong>Infringing Content Location:</strong>
                                <p class="mt-2">The infringing designs can be found in the "Web Design Portfolio" section, projects #3 and #5.</p>
                            </div>
                            <div>
                                <strong>DMCA Contact Information:</strong>
                                <p class="mt-2">Legal Department<br>Creative Design Studios<br>legal@creativedesignstudios.example<br>Phone: (555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <h6 class="mb-3">Reported Content</h6>
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <img src="/api/placeholder/400/250" class="img-fluid rounded" alt="Reported content">
                                    <div class="small text-muted mt-1">Portfolio Project #3</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <img src="/api/placeholder/400/250" class="img-fluid rounded" alt="Reported content">
                                    <div class="small text-muted mt-1">Portfolio Project #5</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (reportType === 'harassment') {
            detailsHTML += `
                <div class="mb-4">
                    <h6 class="mb-3">Report Details</h6>
                    <div class="card">
                        <div class="card-body">
                            <div class="mb-3">
                                <strong>Harassment Description:</strong>
                                <p class="mt-2">This user has been sending me repeated unwanted messages after I declined their project collaboration offer. The messages have become increasingly hostile and threatening.</p>
                            </div>
                            <div class="mb-3">
                                <strong>Timeline of Incidents:</strong>
                                <ul class="list-unstyled mt-2">
                                    <li class="mb-2"><i class="fas fa-calendar-day me-2 text-muted"></i><strong>April 5, 2025:</strong> Initial contact and collaborative project offer</li>
                                    <li class="mb-2"><i class="fas fa-calendar-day me-2 text-muted"></i><strong>April 7, 2025:</strong> I politely declined the offer