/**
 * ProFolio Admin Verification System
 * Main JavaScript file for admin verification functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // ------------------- Sidebar Functionality -------------------
    initializeSidebar();
    
    // ------------------- Selection & Bulk Actions -------------------
    initializeSelectionSystem();
    
    // ------------------- Filter System -------------------
    initializeFilterSystem();
    
    // ------------------- Document Viewer -------------------
    initializeDocumentViewer();
    
    // ------------------- Portfolio Viewer -------------------
    initializePortfolioViewer();
    
    // ------------------- Request More Info -------------------
    initializeInfoRequest();
    
    // ------------------- Approval & Rejection System -------------------
    initializeApprovalSystem();
    
    // ------------------- Responsive Adjustments -------------------
    initializeResponsiveLayout();

    // ------------------- Initialize Tooltips and Popovers -------------------
    initializeBootstrapComponents();
  });
  
  /**
   * Initialize Bootstrap components like tooltips and popovers
   */
  function initializeBootstrapComponents() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }

  /**
   * Initialize sidebar functionality
   */
  function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const sidebarClose = document.querySelector('.sidebar-close');
    
    if (sidebarToggle && sidebar && mainContent) {
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
      });
    }
    
    if (sidebarClose) {
      sidebarClose.addEventListener('click', function() {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
      });
    }

    // Active sidebar item highlight
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * Initialize selection system and bulk action buttons
   */
  function initializeSelectionSystem() {
    const selectAll = document.getElementById('selectAll');
    const requestCheckboxes = document.querySelectorAll('.request-checkbox');
    const approveSelectedBtn = document.getElementById('approveSelected');
    const rejectSelectedBtn = document.getElementById('rejectSelected');
    
    // Select all checkbox
    if (selectAll) {
      selectAll.addEventListener('change', function() {
        requestCheckboxes.forEach(checkbox => {
          checkbox.checked = selectAll.checked;
        });
        updateBulkActionButtons();
      });
    }
    
    // Individual checkboxes
    requestCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateBulkActionButtons();
        
        // Update selectAll checkbox state
        const allChecked = Array.from(requestCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(requestCheckboxes).some(cb => cb.checked);
        
        if (selectAll) {
          selectAll.checked = allChecked;
          selectAll.indeterminate = someChecked && !allChecked;
        }
      });
    });
    
    // Bulk action buttons
    function updateBulkActionButtons() {
      const checkedCount = document.querySelectorAll('.request-checkbox:checked').length;
      
      if (approveSelectedBtn) {
        approveSelectedBtn.disabled = checkedCount === 0;
        // Update button text to show count
        approveSelectedBtn.textContent = checkedCount > 0 ? `Approve Selected (${checkedCount})` : 'Approve Selected';
      }
      
      if (rejectSelectedBtn) {
        rejectSelectedBtn.disabled = checkedCount === 0;
        // Update button text to show count  
        rejectSelectedBtn.textContent = checkedCount > 0 ? `Reject Selected (${checkedCount})` : 'Reject Selected';
      }
    }
    
    // Initialize bulk approve functionality
    if (approveSelectedBtn) {
      approveSelectedBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Confirmation modal for bulk approve
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmActionModal'));
        const confirmModalTitle = document.getElementById('confirmActionModalLabel');
        const confirmModalBody = document.getElementById('confirmActionModalBody');
        const confirmModalButton = document.getElementById('confirmActionButton');
        
        const selectedCount = document.querySelectorAll('.request-checkbox:checked').length;
        
        confirmModalTitle.textContent = 'Confirm Bulk Approval';
        confirmModalBody.textContent = `Are you sure you want to approve ${selectedCount} selected verification request(s)?`;
        confirmModalButton.textContent = 'Approve All Selected';
        confirmModalButton.className = 'btn btn-success';
        
        confirmModalButton.onclick = function() {
          bulkProcessRequests('approve');
          confirmModal.hide();
        };
        
        confirmModal.show();
      });
    }
    
    // Initialize bulk reject functionality
    if (rejectSelectedBtn) {
      rejectSelectedBtn.addEventListener('click', function() {
        if (this.disabled) return;
        bulkProcessRequests('reject');
      });
    }
  }
  
  /**
   * Process multiple requests (approve/reject)
   * @param {string} action - The action to perform (approve/reject)
   */
  function bulkProcessRequests(action) {
    const selectedCheckboxes = document.querySelectorAll('.request-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    if (selectedIds.length === 0) return;
    
    if (action === 'reject') {
      // Open rejection modal with multiple selection info
      const rejectionModal = new bootstrap.Modal(document.getElementById('rejectionModal'));
      document.getElementById('rejectionUser').value = `Multiple Users (${selectedIds.length} selected)`;
      rejectionModal.show();
      
      // Setup confirmation button
      const confirmRejectionButton = document.getElementById('confirmRejection');
      confirmRejectionButton.onclick = function() {
        processRequests(selectedIds, 'reject');
        rejectionModal.hide();
        
        // Reset selection after processing
        document.getElementById('selectAll').checked = false;
        selectedCheckboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
        
        // Disable bulk action buttons
        document.getElementById('approveSelected').disabled = true;
        document.getElementById('approveSelected').textContent = 'Approve Selected';
        document.getElementById('rejectSelected').disabled = true;
        document.getElementById('rejectSelected').textContent = 'Reject Selected';
      };
    } else {
      // Process approval
      processRequests(selectedIds, 'approve');
      
      // Reset selection after processing
      document.getElementById('selectAll').checked = false;
      selectedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // Disable bulk action buttons
      document.getElementById('approveSelected').disabled = true;
      document.getElementById('approveSelected').textContent = 'Approve Selected';
      document.getElementById('rejectSelected').disabled = true;
      document.getElementById('rejectSelected').textContent = 'Reject Selected';
    }
  }
  
  /**
   * Process verification requests
   * @param {Array} ids - Array of request IDs
   * @param {string} action - The action to perform (approve/reject)
   */
  function processRequests(ids, action) {
    // In real implementation, this would make an API call
    console.log(`${action} requests:`, ids);
    
    const rejectionReason = action === 'reject' ? 
      document.getElementById('rejectionReason').value : '';
    
    ids.forEach(id => {
      const row = document.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        const statusCell = row.querySelector('td:nth-last-child(2)');
        const actionCell = row.querySelector('td:last-child');
        
        if (statusCell) {
          let statusBadge = statusCell.querySelector('.badge');
          if (!statusBadge) {
            statusBadge = document.createElement('span');
            statusBadge.className = 'badge';
            statusCell.innerHTML = '';
            statusCell.appendChild(statusBadge);
          }
          
          if (action === 'approve') {
            statusBadge.className = 'badge bg-success';
            statusBadge.textContent = 'Approved';
            
            // Update action buttons
            if (actionCell) {
              // Replace buttons with a "View Details" button
              actionCell.innerHTML = `
                <button class="btn btn-sm btn-outline-primary view-details" 
                  data-id="${id}" data-bs-toggle="tooltip" title="View verified profile details">
                  <i class="fas fa-eye"></i>
                </button>`;
                
              // Re-initialize tooltips for new buttons
              new bootstrap.Tooltip(actionCell.querySelector('[data-bs-toggle="tooltip"]'));
            }
            
          } else if (action === 'reject') {
            statusBadge.className = 'badge bg-danger';
            statusBadge.textContent = 'Rejected';
            
            // Store rejection reason as a data attribute
            row.setAttribute('data-rejection-reason', rejectionReason);
            
            // Update action buttons
            if (actionCell) {
              // Replace with view and reconsider buttons
              actionCell.innerHTML = `
                <button class="btn btn-sm btn-outline-primary me-1 view-rejection" 
                  data-id="${id}" data-bs-toggle="tooltip" title="View rejection details">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success reconsider-btn" 
                  data-id="${id}" data-bs-toggle="tooltip" title="Reconsider this application">
                  <i class="fas fa-redo"></i>
                </button>`;
                
              // Re-initialize tooltips for new buttons
              actionCell.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                new bootstrap.Tooltip(el);
              });
              
              // Add click handler for rejection details
              actionCell.querySelector('.view-rejection').addEventListener('click', function() {
                showRejectionDetails(id, rejectionReason);
              });
              
              // Add click handler for reconsider button
              actionCell.querySelector('.reconsider-btn').addEventListener('click', function() {
                reconsiderApplication(id);
              });
            }
          }
        }
      }
    });
    
    // Update stats cards
    updateStatCards(action, ids.length);
    
    // Show toast notification
    const actionText = action === 'approve' ? 'approved' : 'rejected';
    showToast(`${ids.length} verification request(s) ${actionText} successfully!`, action === 'approve' ? 'success' : 'danger');
    
    // Disable bulk action buttons if needed
    const remainingCheckboxes = document.querySelectorAll('.request-checkbox:checked').length;
    if (remainingCheckboxes === 0) {
      document.getElementById('approveSelected').disabled = true;
      document.getElementById('rejectSelected').disabled = true;
    }
    
    // If we're in development/testing mode, refresh the page after 2 seconds
    // Remove this in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // For testing/demo purposes only
      if (document.querySelectorAll('.request-checkbox').length === ids.length) {
        setTimeout(() => {
          //location.reload();
        }, 2000);
      }
    }
  }
  
  /**
   * Show rejection details in a modal
   * @param {string} id - User ID
   * @param {string} reason - Rejection reason
   */
  function showRejectionDetails(id, reason) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const userName = row.querySelector('h6').textContent;
    
    // Get the stored reason or use the provided one
    const rejectionReason = row.getAttribute('data-rejection-reason') || reason || 'No specific reason provided';
    
    // Create and show modal
    const modal = new bootstrap.Modal(document.getElementById('rejectionDetailsModal') || createRejectionDetailsModal());
    document.getElementById('rejectionDetailsUser').textContent = userName;
    document.getElementById('rejectionDetailsId').textContent = `ID: #${id}`;
    document.getElementById('rejectionDetailsReason').textContent = rejectionReason;
    
    modal.show();
  }
  
  /**
   * Create rejection details modal if it doesn't exist
   * @returns {HTMLElement} Modal element
   */
  function createRejectionDetailsModal() {
    const modalHtml = `
      <div class="modal fade" id="rejectionDetailsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title">Rejection Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h6 id="rejectionDetailsUser" class="mb-1"></h6>
              <p id="rejectionDetailsId" class="text-muted small mb-3"></p>
              <div class="mb-3">
                <label class="form-label">Rejection Reason:</label>
                <div id="rejectionDetailsReason" class="p-3 bg-light rounded"></div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    return document.getElementById('rejectionDetailsModal');
  }
  
  /**
   * Reconsider a rejected application
   * @param {string} id - User ID
   */
  function reconsiderApplication(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const userName = row.querySelector('h6').textContent;
    
    // Create confirmation modal if it doesn't exist
    if (!document.getElementById('reconsiderModal')) {
      const modalHtml = `
        <div class="modal fade" id="reconsiderModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Reconsider Application</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to mark this application as pending for reconsideration?</p>
                <p class="mb-0"><strong id="reconsiderUser"></strong></p>
                <p class="text-muted small" id="reconsiderId"></p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="confirmReconsider">Confirm Reconsideration</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('reconsiderModal'));
    document.getElementById('reconsiderUser').textContent = userName;
    document.getElementById('reconsiderId').textContent = `ID: #${id}`;
    
    // Set up confirmation button
    document.getElementById('confirmReconsider').onclick = function() {
      // Update status to pending
      const statusCell = row.querySelector('td:nth-last-child(2)');
      const actionCell = row.querySelector('td:last-child');
      
      if (statusCell) {
        let statusBadge = statusCell.querySelector('.badge');
        statusBadge.className = 'badge bg-warning';
        statusBadge.textContent = 'Pending';
      }
      
      // Update action cell with original buttons
      if (actionCell) {
        actionCell.innerHTML = `
          <div class="d-flex">
            <button class="btn btn-sm btn-primary me-1 view-documents" data-id="${id}" data-bs-toggle="tooltip" title="View documents">
              <i class="fas fa-file-alt"></i>
            </button>
            <button class="btn btn-sm btn-info me-1 view-portfolio" data-id="${id}" data-bs-toggle="tooltip" title="View portfolio">
              <i class="fas fa-briefcase"></i>
            </button>
            <button class="btn btn-sm btn-warning me-1 request-info" data-id="${id}" data-bs-toggle="tooltip" title="Request more info">
              <i class="fas fa-question-circle"></i>
            </button>
            <button class="btn btn-sm btn-success me-1 approve-btn" data-id="${id}" data-bs-toggle="tooltip" title="Approve">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn btn-sm btn-danger reject-btn" data-id="${id}" data-bs-toggle="tooltip" title="Reject">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
        
        // Re-initialize event listeners and tooltips
        initializeActionButtons(actionCell);
      }
      
      // Update stats
      const rejectedElement = document.querySelector('.stats-card:nth-child(4) .stats-number');
      const pendingElement = document.querySelector('.stats-card:nth-child(1) .stats-number');
      
      if (rejectedElement && pendingElement) {
        const currentRejected = parseInt(rejectedElement.textContent);
        const currentPending = parseInt(pendingElement.textContent);
        
        rejectedElement.textContent = Math.max(0, currentRejected - 1);
        pendingElement.textContent = currentPending + 1;
      }
      
      modal.hide();
      showToast('Application marked for reconsideration', 'info');
    };
    
    modal.show();
  }
  
  /**
   * Re-initialize action buttons' event listeners and tooltips
   * @param {HTMLElement} container - Container with buttons
   */
  function initializeActionButtons(container) {
    // Initialize tooltips
    container.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });
    
    // View documents button
    container.querySelector('.view-documents')?.addEventListener('click', function(e) {
      e.preventDefault();
      const userId = this.getAttribute('data-id');
      const documentViewerModal = new bootstrap.Modal(document.getElementById('documentViewerModal'));
      const row = document.querySelector(`tr[data-id="${userId}"]`);
      const userName = row.querySelector('h6').textContent;
      
      document.getElementById('documentViewerModalLabel').textContent = `Verification Documents - ${userName} (ID: #${userId})`;
      setupDocumentContent(userId);
      documentViewerModal.show();
    });
    
    // View portfolio button
    container.querySelector('.view-portfolio')?.addEventListener('click', function(e) {
      e.preventDefault();
      const userId = this.getAttribute('data-id');
      const portfolioViewerModal = new bootstrap.Modal(document.getElementById('portfolioViewerModal'));
      const row = document.querySelector(`tr[data-id="${userId}"]`);
      const userName = row.querySelector('h6').textContent;
      const userType = row.querySelector('td:nth-child(3)').textContent.split('\n')[0].trim();
      
      setupPortfolioContent(userId, userName, userType);
      document.getElementById('portfolioViewerModalLabel').textContent = `${userName}'s Portfolio (ID: #${userId})`;
      portfolioViewerModal.show();
    });
    
    // Request info button
    container.querySelector('.request-info')?.addEventListener('click', function(e) {
      e.preventDefault();
      const userId = this.getAttribute('data-id');
      const requestInfoModal = new bootstrap.Modal(document.getElementById('requestInfoModal'));
      const row = document.querySelector(`tr[data-id="${userId}"]`);
      const userName = row.querySelector('h6').textContent;
      const userEmail = row.querySelector('a[href^="mailto:"]').textContent;
      
      document.getElementById('requestRecipient').value = `${userName} <${userEmail}>`;
      requestInfoModal.show();
      
      // Setup send button
      document.getElementById('sendRequestInfo').onclick = function() {
        requestAdditionalInfo(userId);
        requestInfoModal.hide();
      };
    });
    
    // Approve button
    container.querySelector('.approve-btn')?.addEventListener('click', function(e) {
      e.preventDefault();
      const userId = this.getAttribute('data-id');
      processRequests([userId], 'approve');
    });
    
    // Reject button
    container.querySelector('.reject-btn')?.addEventListener('click', function(e) {
      e.preventDefault();
      const userId = this.getAttribute('data-id');
      const rejectionModal = new bootstrap.Modal(document.getElementById('rejectionModal'));
      const row = document.querySelector(`tr[data-id="${userId}"]`);
      const userName = row.querySelector('h6').textContent;
      
      document.getElementById('rejectionUser').value = `${userName} (ID: #${userId})`;
      rejectionModal.show();
      
      document.getElementById('confirmRejection').onclick = function() {
        processRequests([userId], 'reject');
        rejectionModal.hide();
      };
    });
  }
  
  /**
   * Request additional information from a user
   * @param {string} userId - User ID
   */
  function requestAdditionalInfo(userId) {
    const row = document.querySelector(`tr[data-id="${userId}"]`);
    
    // Get form values
    const requestSubject = document.getElementById('requestSubject').value;
    const requestMessage = document.getElementById('requestMessage').value;
    
    console.log(`Requesting additional info from user ${userId}:`, {
      subject: requestSubject,
      message: requestMessage
    });
    
    // Update status to "Additional Info Requested"
    const statusCell = row.querySelector('td:nth-last-child(2)');
    if (statusCell) {
      const statusBadge = statusCell.querySelector('.badge');
      statusBadge.className = 'badge bg-info';
      statusBadge.textContent = 'Additional Info Requested';
    }
    
    // Update stats
    const pendingElement = document.querySelector('.stats-card:nth-child(1) .stats-number');
    const infoRequestedElement = document.querySelector('.stats-card:nth-child(2) .stats-number');
    
    if (pendingElement && infoRequestedElement) {
      const currentPending = parseInt(pendingElement.textContent);
      const currentInfoRequested = parseInt(infoRequestedElement.textContent);
      
      pendingElement.textContent = Math.max(0, currentPending - 1);
      infoRequestedElement.textContent = currentInfoRequested + 1;
    }
    
    // Reset form fields
    document.getElementById('requestSubject').value = 'Additional information required for verification';
    document.getElementById('requestMessage').value = '';
    
    showToast('Additional information request sent successfully!', 'info');
  }
  
  /**
   * Update statistics cards based on actions
   * @param {string} action - The action performed
   * @param {number} count - Number of affected items
   */
  function updateStatCards(action, count) {
    // Get stat elements
    const pendingElement = document.querySelector('.stats-card:nth-child(1) .stats-number');
    const approvedElement = document.querySelector('.stats-card:nth-child(3) .stats-number');
    const rejectedElement = document.querySelector('.stats-card:nth-child(4) .stats-number');
    
    if (pendingElement) {
      const currentPending = parseInt(pendingElement.textContent);
      pendingElement.textContent = Math.max(0, currentPending - count);
    }
    
    if (action === 'approve' && approvedElement) {
      const currentApproved = parseInt(approvedElement.textContent);
      approvedElement.textContent = currentApproved + count;
    } else if (action === 'reject' && rejectedElement) {
      const currentRejected = parseInt(rejectedElement.textContent);
      rejectedElement.textContent = currentRejected + count;
    }
    
    // Update showing entries text
    updateEntriesInfo();
    
    // Update the percentage in the header card if it exists
    updateCompletionPercentage();
  }
  
  /**
   * Update completion percentage in header stats
   */
  function updateCompletionPercentage() {
    const percentageElement = document.querySelector('.completion-percentage');
    const progressBar = document.querySelector('.progress-bar');
    
    if (percentageElement && progressBar) {
      const pendingCount = parseInt(document.querySelector('.stats-card:nth-child(1) .stats-number').textContent);
      const infoRequestedCount = parseInt(document.querySelector('.stats-card:nth-child(2) .stats-number').textContent);
      const approvedCount = parseInt(document.querySelector('.stats-card:nth-child(3) .stats-number').textContent);
      const rejectedCount = parseInt(document.querySelector('.stats-card:nth-child(4) .stats-number').textContent);
      
      const totalCount = pendingCount + infoRequestedCount + approvedCount + rejectedCount;
      const processedCount = approvedCount + rejectedCount;
      
      const percentage = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;
      
      percentageElement.textContent = `${percentage}%`;
      progressBar.style.width = `${percentage}%`;
      progressBar.setAttribute('aria-valuenow', percentage);
    }
  }
  
  /**
   * Initialize filter system
   */
  function initializeFilterSystem() {
    const filterForm = document.getElementById('verification-filters');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const searchInput = document.getElementById('searchInput');
    const resetButton = filterForm.querySelector('button[type="reset"]');
    
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
    
    // Implement reset functionality
    resetButton.addEventListener('click', function() {
      setTimeout(() => {
        // Clear search input explicitly
        if (searchInput) {
          searchInput.value = '';
        }
        applyFilters();
      }, 0);
    });
    
    // Handle filter changes immediately (optional)
    [statusFilter, typeFilter, dateFilter].forEach(filter => {
      if (filter) {
        filter.addEventListener('change', function() {
          // Uncomment the line below if you want filters to apply immediately on change
          applyFilters();
        });
      }
    });
    
    // Add search functionality
    if (searchInput) {
      // Debounce search to improve performance
      let searchTimeout;
      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          applyFilters();
        }, 300);
      });
    }
    
    // Apply default filters on page load
    applyFilters();
  }
  
  /**
   * Apply table filters based on form values
   */
  function applyFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    const table = document.getElementById('verification-table');
    const rows = table?.querySelectorAll('tbody tr') || [];
    
    let visibleCount = 0;
    
    rows.forEach(row => {
      let showRow = true;
      
      // Search filtering (name, email, or ID)
      if (searchQuery) {
        const nameCell = row.querySelector('td:nth-child(2) h6');
        const emailCell = row.querySelector('td:nth-child(2) a[href^="mailto:"]');
        const idAttr = row.getAttribute('data-id');
        
        const nameText = nameCell?.textContent.toLowerCase() || '';
        const emailText = emailCell?.textContent.toLowerCase() || '';
        const idText = idAttr?.toLowerCase() || '';
        
        if (!nameText.includes(searchQuery) && 
            !emailText.includes(searchQuery) && 
            !idText.includes(searchQuery)) {
          showRow = false;
        }
      }
      
      // Status filtering
      if (showRow && statusFilter) {
        const statusCell = row.querySelector('td:nth-last-child(2)');
        const statusText = statusCell?.textContent.toLowerCase() || '';
        
        if (statusFilter === 'pending' && !statusText.includes('pending')) {
          showRow = false;
        } else if (statusFilter === 'info-requested' && !statusText.includes('additional info')) {
          showRow = false;
        } else if (statusFilter === 'approved' && !statusText.includes('approved')) {
          showRow = false;
        } else if (statusFilter === 'rejected' && !statusText.includes('rejected')) {
          showRow = false;
        }
      }
      
      // Type filtering
      if (showRow && typeFilter) {
        const typeCell = row.querySelector('td:nth-child(3)');
        const typeText = typeCell?.textContent.toLowerCase() || '';
        
        if (typeFilter === 'freelancer' && !typeText.includes('freelancer')) {
          showRow = false;
        } else if (typeFilter === 'agency' && !typeText.includes('agency')) {
          showRow = false;
        } else if (typeFilter === 'client' && !typeText.includes('client')) {
          showRow = false;
        }
      }
      
      // Date filtering
      if (showRow && dateFilter) {
        const dateCell = row.querySelector('td:nth-child(4)');
        const dateText = dateCell?.textContent.toLowerCase() || '';
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (dateFilter === 'today') {
          // Check if date is today
          if (!dateText.includes(today.toLocaleDateString())) {
            showRow = false;
          }
        } else if (dateFilter === 'yesterday') {
          // Check if date is yesterday
          if (!dateText.includes(yesterday.toLocaleDateString())) {
            showRow = false;
          }
        } else if (dateFilter === 'last-week') {
          // This is a simplified check - could be improved
          if (!dateText.includes('days ago') && !dateText.includes('week ago')) {
            showRow = false;
          }
        }
      }
      
      // Show or hide row based on filters
      row.style.display = showRow ? '' : 'none';
      
      if (showRow) {
        visibleCount++;
      }
    });
    
    // Update entries info
    updateEntriesInfo(visibleCount, rows.length);
  }
  
  /**
   * Update table entries info text
   * @param {number} visible - Number of visible entries
   * @param {number} total - Total number of entries
   */
  function updateEntriesInfo(visible, total) {
    const entriesInfo = document.getElementById('entries-info');
    if (entriesInfo) {
      entriesInfo.textContent = `Showing ${visible} of ${total} entries`;
    }
  }
  
  /**
   * Initialize document viewer
   */
  function initializeDocumentViewer() {
    // Setup document viewer when viewing documents
    document.querySelectorAll('.view-documents').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const userId = this.getAttribute('data-id');
        const documentViewerModal = new bootstrap.Modal(document.getElementById('documentViewerModal'));
        const row = document.querySelector(`tr[data-id="${userId}"]`);
        const userName = row.querySelector('h6').textContent;
        
        document.getElementById('documentViewerModalLabel').textContent = `Verification Documents - ${userName} (ID: #${userId})`;
        setupDocumentContent(userId);
        documentViewerModal.show();
      });
    });
  }
  
  /**
   * Setup document viewer content
   * @param {string} userId - User ID
   */
  function setupDocumentContent(userId) {
    const documentContent = document.getElementById('documentViewerContent');
    // In a real application, this would fetch documents from a server
    // For demo, generate some sample document previews
    
    // Sample document types for different user types
    const documentTypes = {
      // Freelancer documents
      '45892': ['ID Card', 'Proof of Address', 'Portfolio PDF'],
      // Agency documents
      '45973': ['Business Registration', 'Company Profile', 'Tax Certificate', 'Portfolio Samples', 'Client References'],
      // Client documents
      '45821': ['ID Verification'],
      // Freelancer documents
      '46012': ['ID Card', 'Professional Certification', 'Portfolio Examples', 'Reference Letter']
    };
    
    const documents = documentTypes[userId] || ['ID Verification', 'Professional Documents'];
    
    let documentHtml = '';
    
    documents.forEach((doc, index) => {
      const fileType = doc.includes('PDF') || doc.includes('Portfolio') ? 'pdf' : 
                       doc.includes('ID') ? 'jpg' : 'png';
      
      documentHtml += `
        <div class="col-md-6 mb-3">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0">${doc}</h6>
              <div>
                <button class="btn btn-sm btn-outline-primary download-doc" data-bs-toggle="tooltip" title="Download document">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            <div class="card-body text-center">
              ${fileType === 'pdf' ? 
                `<div class="document-preview pdf-preview">
                  <i class="fas fa-file-pdf fa-5x text-danger"></i>
                  <p class="mt-2">PDF Document</p>
                </div>` : 
                `<div class="document-preview image-preview">
                  <img src="/api/placeholder/400/300" alt="${doc}" class="img-fluid rounded">
                </div>`
              }
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">Uploaded: April ${10 + index}, 2025</small>
                <div class="document-actions">
                  <button class="btn btn-sm btn-success verify-document" data-document="${index}" data-user="${userId}">
                    <i class="fas fa-check me-1"></i> Verify
                  </button>
                  <button class="btn btn-sm btn-danger ms-1 flag-document" data-document="${index}" data-user="${userId}">
                    <i class="fas fa-flag me-1"></i> Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    // Set content
    documentContent.innerHTML = `
      <div class="row">
        ${documentHtml}
      </div>
    `;
    
    // Initialize tooltips for the new content
    documentContent.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });
    
    // Add event listeners for document verification buttons
    documentContent.querySelectorAll('.verify-document').forEach(button => {
      button.addEventListener('click', function() {
        const docId = this.getAttribute('data-document');
        const userId = this.getAttribute('data-user');
        
        // Visual feedback
        this.innerHTML = '<i class="fas fa-check-double me-1"></i> Verified';
        this.classList.remove('btn-success');
        this.classList.add('btn-outline-success');
        this.disabled = true;
        
        // Show toast
        showToast(`Document verified successfully!`, 'success');
        
        // In a real app, this would make an API call to update document status
        console.log(`Document ${docId} verified for user ${userId}`);
      });
    });
    
    // Add event listeners for document flagging buttons
    documentContent.querySelectorAll('.flag-document').forEach(button => {
      button.addEventListener('click', function() {
        const docId = this.getAttribute('data-document');
        const userId = this.getAttribute('data-user');
        
        // Visual feedback
        this.innerHTML = '<i class="fas fa-flag me-1"></i> Flagged';
        this.classList.remove('btn-danger');
        this.classList.add('btn-outline-danger');
        this.disabled = true;
        
        // Show modal to provide reason for flagging
        const flagModal = new bootstrap.Modal(document.getElementById('flagDocumentModal') || createFlagDocumentModal());
        document.getElementById('flaggedDocId').value = docId;
        document.getElementById('flaggedUserId').value = userId;
        flagModal.show();
        
        // In a real app, this would prepare to send data to the server
        console.log(`Document ${docId} flagged for user ${userId}`);
      });
    });
  }
  
  /**
   * Create flag document modal if it doesn't exist
   * @returns {HTMLElement} Modal element
   */
  function createFlagDocumentModal() {
    const modalHtml = `
      <div class="modal fade" id="flagDocumentModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-warning">
              <h5 class="modal-title">Flag Document</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" id="flaggedDocId">
              <input type="hidden" id="flaggedUserId">
              <div class="mb-3">
                <label for="flagReason" class="form-label">Reason for flagging:</label>
                <select class="form-select" id="flagReason">
                  <option value="suspicious">Suspicious document</option>
                  <option value="low-quality">Low quality/unreadable</option>
                  <option value="incomplete">Incomplete information</option>
                  <option value="expired">Expired document</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="flagComments" class="form-label">Additional comments:</label>
                <textarea class="form-control" id="flagComments" rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-warning" id="confirmFlag">Confirm Flag</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listener for confirm button
    document.getElementById('confirmFlag').addEventListener('click', function() {
      const docId = document.getElementById('flaggedDocId').value;
      const userId = document.getElementById('flaggedUserId').value;
      const reason = document.getElementById('flagReason').value;
      const comments = document.getElementById('flagComments').value;
      
      // In a real app, send this data to server
      console.log('Document flagged:', {
        documentId: docId,
        userId: userId,
        reason: reason,
        comments: comments
      });
      
      // Close modal
      bootstrap.Modal.getInstance(document.getElementById('flagDocumentModal')).hide();
      
      // Show toast
      showToast('Document flagged for review', 'warning');
    });
    
    return document.getElementById('flagDocumentModal');
  }
  
  /**
   * Initialize portfolio viewer
   */
  function initializePortfolioViewer() {
    // Setup portfolio viewer when clicking view portfolio
    document.querySelectorAll('.view-portfolio').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const userId = this.getAttribute('data-id');
        const portfolioViewerModal = new bootstrap.Modal(document.getElementById('portfolioViewerModal'));
        const row = document.querySelector(`tr[data-id="${userId}"]`);
        const userName = row.querySelector('h6').textContent;
        const userType = row.querySelector('td:nth-child(3)').textContent.split('\n')[0].trim();
        
        setupPortfolioContent(userId, userName, userType);
        document.getElementById('portfolioViewerModalLabel').textContent = `${userName}'s Portfolio (ID: #${userId})`;
        portfolioViewerModal.show();
      });
    });
  }
  
  /**
   * Setup portfolio viewer content
   * @param {string} userId - User ID
   * @param {string} userName - User name
   * @param {string} userType - User type
   */
  function setupPortfolioContent(userId, userName, userType) {
    const portfolioContent = document.getElementById('portfolioViewerContent');
    
    // Sample portfolio items based on user types
    const portfolios = {
      // Freelancer portfolio - Web Developer
      '45892': {
        overview: 'Full-stack web developer with 5+ years of experience in React, Node.js, and MongoDB. Specialized in responsive web applications and e-commerce solutions.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML/CSS', 'Responsive Design', 'API Development'],
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Built a full-featured e-commerce platform with secure payment processing and inventory management.',
            technologies: 'React, Node.js, MongoDB, Stripe API',
            image: '/api/placeholder/800/500'
          },
          {
            title: 'Real Estate Listing App',
            description: 'Developed a property listing application with advanced search filters and map integration.',
            technologies: 'React, Express, PostgreSQL, Google Maps API',
            image: '/api/placeholder/800/500'
          }
        ]
      },
      // Agency portfolio - Software Development Agency
      '45973': {
        overview: 'Software development agency specializing in custom business solutions, mobile applications, and enterprise software. Our team of 25+ developers delivers high-quality solutions for clients across industries.',
        skills: ['Custom Software Development', 'Mobile App Development', 'Enterprise Solutions', 'Cloud Infrastructure', 'UI/UX Design', 'QA & Testing'],
        projects: [
          {
            title: 'Healthcare Management System',
            description: 'Developed a comprehensive healthcare management system for a network of clinics, improving patient management by 40%.',
            technologies: 'Java, Spring Boot, Angular, PostgreSQL, Docker',
            image: '/api/placeholder/800/500'
          },
          {
            title: 'Logistics Tracking Platform',
            description: 'Built an end-to-end logistics tracking solution for a global shipping company, handling over 10,000 shipments daily.',
            technologies: 'React, Node.js, MongoDB, Redis, AWS',
            image: '/api/placeholder/800/500'
          },
          {
            title: 'Mobile Banking Application',
            description: 'Developed a secure mobile banking application with biometric authentication and real-time transaction monitoring.',
            technologies: 'React Native, GraphQL, Node.js, PostgreSQL',
            image: '/api/placeholder/800/500'
          }
        ]
      },
      // Client doesn't have a detailed portfolio
      '45821': {
        overview: 'E-commerce business seeking developer services for website maintenance and feature development.',
        requirements: ['Regular website updates', 'New feature implementation', 'Performance optimization', 'Security maintenance'],
        budget: 'Ongoing retainer with project-based additions'
      },
      // Freelancer portfolio - UX/UI Designer
      '46012': {
        overview: 'UX/UI Designer with 7+ years of experience creating user-centered digital experiences. Specialized in mobile applications, SaaS platforms, and e-commerce websites.',
        skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Figma', 'Adobe XD', 'Design Systems'],
        projects: [
          {
            title: 'Banking App Redesign',
            description: 'Redesigned a mobile banking application, improving user satisfaction metrics by 35% and reducing task completion time by 20%.',
            technologies: 'Figma, User Testing, Design System',
            image: '/api/placeholder/800/500'
          },
          {
            title: 'E-learning Platform',
            description: 'Created the UX/UI design for an e-learning platform focused on accessibility and engagement, supporting over 50,000 active users.',
            technologies: 'Adobe XD, Design System, Prototyping',
            image: '/api/placeholder/800/500'
          }
        ]
      }
    };
    
    const portfolio = portfolios[userId] || {
      overview: 'Portfolio information not available for this user.',
      skills: [],
      projects: []
    };
    
    // Build content based on user type
    let content = '';
    
    // Overview section
    content += `
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Overview</h5>
        </div>
        <div class="card-body">
          <p>${portfolio.overview}</p>
        </div>
      </div>
    `;
    
    // Skills section (for freelancers and agencies)
    if (portfolio.skills && portfolio.skills.length > 0) {
      content += `
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Skills & Expertise</h5>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              ${portfolio.skills.map(skill => `<span class="badge bg-primary">${skill}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }
    
    // For clients, show requirements instead of projects
    if (userType.toLowerCase().includes('client') && portfolio.requirements) {
      content += `
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Project Requirements</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              ${portfolio.requirements.map(req => `<li class="list-group-item">${req}</li>`).join('')}
            </ul>
            <div class="mt-3">
              <strong>Budget: </strong>${portfolio.budget || 'Not specified'}
            </div>
          </div>
        </div>
      `;
    }
    
    // Projects section (for freelancers and agencies)
    if (portfolio.projects && portfolio.projects.length > 0) {
      content += `
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Featured Projects</h5>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              ${portfolio.projects.map((project, index) => `
                <div class="list-group-item p-3">
                  <div class="row g-3">
                    <div class="col-md-4">
                      <img src="${project.image}" alt="${project.title}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                      <h5>${project.title}</h5>
                      <p>${project.description}</p>
                      <div class="d-flex flex-wrap gap-2 mb-2">
                        ${project.technologies.split(',').map(tech => `<span class="badge bg-secondary">${tech.trim()}</span>`).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
    
    // Set content
    portfolioContent.innerHTML = content;
  }
  
  /**
   * Initialize request more info functionality
   */
  function initializeInfoRequest() {
    // Setup request info modal when clicking request info button
    document.querySelectorAll('.request-info').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const userId = this.getAttribute('data-id');
        const requestInfoModal = new bootstrap.Modal(document.getElementById('requestInfoModal'));
        const row = document.querySelector(`tr[data-id="${userId}"]`);
        const userName = row.querySelector('h6').textContent;
        const userEmail = row.querySelector('a[href^="mailto:"]').textContent;
        
        document.getElementById('requestRecipient').value = `${userName} <${userEmail}>`;
        requestInfoModal.show();
        
        // Setup send button
        document.getElementById('sendRequestInfo').onclick = function() {
          requestAdditionalInfo(userId);
          requestInfoModal.hide();
        };
      });
    });
  }
  
  /**
   * Initialize approval system
   */
  function initializeApprovalSystem() {
    // Setup approval and rejection buttons
    document.querySelectorAll('.approve-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const userId = this.getAttribute('data-id');
        processRequests([userId], 'approve');
      });
    });
    
    document.querySelectorAll('.reject-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const userId = this.getAttribute('data-id');
        const rejectionModal = new bootstrap.Modal(document.getElementById('rejectionModal'));
        const row = document.querySelector(`tr[data-id="${userId}"]`);
        const userName = row.querySelector('h6').textContent;
        
        document.getElementById('rejectionUser').value = `${userName} (ID: #${userId})`;
        rejectionModal.show();
        
        document.getElementById('confirmRejection').onclick = function() {
          processRequests([userId], 'reject');
          rejectionModal.hide();
        };
      });
    });
    
    // Fix the approve all and reject all buttons
    const approveSelectedBtn = document.getElementById('approveSelected') || document.querySelector('.approve-selected');
    const rejectSelectedBtn = document.getElementById('rejectSelected') || document.querySelector('.reject-selected');
    
    if (approveSelectedBtn) {
      approveSelectedBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Confirmation modal for bulk approve
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmActionModal') || createConfirmActionModal());
        const confirmModalTitle = document.getElementById('confirmActionModalLabel');
        const confirmModalBody = document.getElementById('confirmActionModalBody');
        const confirmModalButton = document.getElementById('confirmActionButton');
        
        const selectedCount = document.querySelectorAll('.request-checkbox:checked').length;
        
        confirmModalTitle.textContent = 'Confirm Bulk Approval';
        confirmModalBody.textContent = `Are you sure you want to approve ${selectedCount} selected verification request(s)?`;
        confirmModalButton.textContent = 'Approve All Selected';
        confirmModalButton.className = 'btn btn-success';
        
        confirmModalButton.onclick = function() {
          bulkProcessRequests('approve');
          confirmModal.hide();
        };
        
        confirmModal.show();
      });
    }
    
    if (rejectSelectedBtn) {
      rejectSelectedBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        const selectedCount = document.querySelectorAll('.request-checkbox:checked').length;
        
        // Open rejection modal with multiple selection info
        const rejectionModal = new bootstrap.Modal(document.getElementById('rejectionModal'));
        document.getElementById('rejectionUser').value = `Multiple Users (${selectedCount} selected)`;
        rejectionModal.show();
        
        // Setup confirmation button
        document.getElementById('confirmRejection').onclick = function() {
          bulkProcessRequests('reject');
          rejectionModal.hide();
        };
      });
    }
  }
  
  /**
   * Create a confirmation action modal if it doesn't exist
   * @returns {HTMLElement} Modal element
   */
  function createConfirmActionModal() {
    const modalHtml = `
      <div class="modal fade" id="confirmActionModal" tabindex="-1" aria-labelledby="confirmActionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmActionModalLabel">Confirm Action</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="confirmActionModalBody">
              Are you sure you want to perform this action?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmActionButton">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    return document.getElementById('confirmActionModal');
  }
  
  /**
   * Initialize responsive layout adjustments
   */
  function initializeResponsiveLayout() {
    // Handle responsive table
    const table = document.getElementById('verification-table');
    
    if (table) {
      // Add horizontal scroll for small screens
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'table-responsive';
      table.parentNode.insertBefore(tableWrapper, table);
      tableWrapper.appendChild(table);
      
      // Adjust action columns on small screens
      const handleResize = () => {
        const windowWidth = window.innerWidth;
        const actionCells = document.querySelectorAll('td:last-child .d-flex');
        
        actionCells.forEach(cell => {
          if (windowWidth < 768) {
            cell.classList.remove('d-flex');
            cell.classList.add('d-grid', 'gap-2');
          } else {
            cell.classList.add('d-flex');
            cell.classList.remove('d-grid', 'gap-2');
          }
        });
      };
      
      // Initial check
      handleResize();
      
      // Listen for window resize
      window.addEventListener('resize', handleResize);
    }
  }
  
  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, danger, warning, info)
   */
  function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 3000
    });
    
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
      toastElement.remove();
    });
  }