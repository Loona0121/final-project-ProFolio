
// Portfolio Creation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const portfolioForm = document.getElementById('portfolio-form');
    const formContainer = document.getElementById('portfolio-form-container');
    const portfolioView = document.getElementById('portfolio-view');
    const detailView = document.getElementById('portfolio-detail-view');
    const progressBar = document.getElementById('form-progress-bar');
    const successNotification = document.getElementById('success-notification');
    
    // Buttons
    const createPortfolioBtn = document.getElementById('create-portfolio-btn');
    const backToPortfoliosBtn = document.getElementById('back-to-portfolios');
    const addSkillBtn = document.getElementById('add-skill-btn');
    const addWorkExpBtn = document.getElementById('add-work-exp');
    const addWorkSampleBtn = document.getElementById('add-work-sample');
    const portfolioSubmitBtn = document.getElementById('create-portfolio-submit');
    
    // Portfolio counter for new items
    let portfolioCounter = 2;
    let currentSection = 1;
    let isEditMode = false;
    let editingPortfolioId = null;
    
    // Initialize event listeners
    initEventListeners();
    
    function initEventListeners() {
      // Create portfolio button
      createPortfolioBtn.addEventListener('click', showPortfolioForm);
      
      // Back button
      backToPortfoliosBtn.addEventListener('click', hidePortfolioForm);
      
      // Next/Previous section buttons
      document.querySelectorAll('.next-section').forEach(btn => {
        btn.addEventListener('click', function() {
          const nextSection = parseInt(this.dataset.next);
          if (validateSection(currentSection)) {
            changeSection(currentSection, nextSection);
          }
        });
      });
      
      document.querySelectorAll('.prev-section').forEach(btn => {
        btn.addEventListener('click', function() {
          const prevSection = parseInt(this.dataset.prev);
          changeSection(currentSection, prevSection);
        });
      });
      
      // Add skill button
      addSkillBtn.addEventListener('click', addSkill);
      
      // Add work experience button
      addWorkExpBtn.addEventListener('click', addWorkExperience);
      
      // Add work sample button
      addWorkSampleBtn.addEventListener('click', addWorkSample);
      
      // Form submission
      portfolioForm.addEventListener('submit', submitPortfolioForm);
      
      // View portfolio buttons
      document.querySelectorAll('.view-portfolio-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const portfolioCard = this.closest('.portfolio-card');
          const portfolioId = portfolioCard.dataset.portfolioId;
          viewPortfolioDetails(portfolioId);
        });
      });
      
      // Back from view button
      document.getElementById('back-from-view').addEventListener('click', function() {
        detailView.style.display = 'none';
        portfolioView.style.display = 'block';
      });
      
      // Edit from view button
      document.getElementById('edit-from-view').addEventListener('click', function() {
        const portfolioId = detailView.dataset.portfolioId;
        editPortfolio(portfolioId);
      });
      
      // Skill input enter key
      document.getElementById('portfolio-skill-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addSkill();
        }
      });
      
      // Handle "I currently work here" checkbox
      document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('work-current')) {
          const endDateInput = e.target.closest('.col-md-6').querySelector('.work-end-date');
          endDateInput.disabled = e.target.checked;
          if (e.target.checked) {
            endDateInput.value = '';
            endDateInput.classList.remove('required');
          } else {
            endDateInput.classList.add('required');
          }
        }
      });
    }
    
    function showPortfolioForm() {
      portfolioView.style.display = 'none';
      detailView.style.display = 'none';
      
      // Reset form
      portfolioForm.reset();
      document.getElementById('skills-container').innerHTML = '';
      document.getElementById('portfolio-skills').value = '';
      resetWorkExperience();
      resetWorkSamples();
      
      // Show first section
      document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById('section-1').style.display = 'block';
      
      // Reset progress and active steps
      updateProgress(1);
      document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
      });
      document.querySelector('.step[data-step="1"]').classList.add('active');
      
      // Update form header
      document.getElementById('form-header-text').textContent = 'Create New Portfolio';
      document.getElementById('form-header-icon').className = 'fas fa-plus-circle';
      document.getElementById('submit-button-text').textContent = 'Create Portfolio';
      
      // Show form with animation
      formContainer.style.opacity = '0';
      formContainer.style.display = 'block';
      setTimeout(() => {
        formContainer.style.transition = 'opacity 0.3s ease';
        formContainer.style.opacity = '1';
      }, 10);
      
  // Reset edit mode
  isEditMode = false;
  editingPortfolioId = null;
  
      currentSection = 1;
    }
    
    function hidePortfolioForm() {
      // Hide form with animation
      formContainer.style.opacity = '0';
      setTimeout(() => {
        formContainer.style.display = 'none';
        portfolioView.style.display = 'block';
      }, 300);
    }
    
    function validateSection(sectionNumber) {
      const section = document.getElementById(`section-${sectionNumber}`);
      let isValid = true;
      
      // Validate required fields in the current section
      const requiredFields = section.querySelectorAll('.required');
      requiredFields.forEach(field => {
        if (field.value.trim() === '') {
          field.classList.add('is-invalid');
          isValid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });
      
      // Special validation for skills section
      if (sectionNumber === 2) {
        const skillsContainer = document.getElementById('skills-container');
        if (skillsContainer.children.length === 0) {
          document.getElementById('portfolio-skill-input').classList.add('is-invalid');
          isValid = false;
        }
      }
      
  // Set up delete button functionality
  document.querySelectorAll('.delete-portfolio-btn, #delete-from-view').forEach(button => {
    button.addEventListener('click', function() {
      // Get the portfolio ID from the closest portfolio-card
      const portfolioCard = this.closest('.portfolio-card');
      const portfolioId = portfolioCard ? portfolioCard.dataset.portfolioId : 
                          document.getElementById('portfolio-detail-view').dataset.portfolioId;
      
      // Store the ID on the modal for use when confirming delete
      document.getElementById('deleteConfirmModal').dataset.portfolioId = portfolioId;
    });
  });
  
  // Add event listener for confirmation button
  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    const portfolioId = document.getElementById('deleteConfirmModal').dataset.portfolioId;
    
    // Implement delete functionality here
    const portfolioElement = document.querySelector(`.portfolio-card[data-portfolio-id="${portfolioId}"]`);
    if (portfolioElement) {
      portfolioElement.style.display = 'none';
    }
    
    // Hide detail view if open
    document.getElementById('portfolio-detail-view').style.display = 'none';
    document.getElementById('portfolio-view').style.display = 'block';
    
    // Show success notification with correct message for deletion
    const successNotification = document.getElementById('success-notification');
    successNotification.innerHTML = '<i class="fas fa-check-circle me-2"></i> Portfolio successfully deleted! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    successNotification.style.display = 'block';
    successNotification.classList.add('show');
    
    // Hide the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    modal.hide();
    
    // Auto-hide notification after 2 seconds
    setTimeout(() => {
      successNotification.classList.remove('show');
      setTimeout(() => {
        successNotification.style.display = 'none';
      }, 300);
    }, 2000);
  });
  
      // Special validation for work experience section
      if (sectionNumber === 3) {
        const workExpContainer = document.getElementById('work-experience-container');
        const workExps = workExpContainer.querySelectorAll('.work-experience-item');
        
        let workExpsValid = true;
        workExps.forEach(exp => {
          const requiredExpFields = exp.querySelectorAll('.required');
          requiredExpFields.forEach(field => {
            if (field.value.trim() === '' && !field.disabled) {
              field.classList.add('is-invalid');
              workExpsValid = false;
            } else {
              field.classList.remove('is-invalid');
            }
          });
        });
        
        isValid = isValid && workExpsValid;
      }
      
      // Special validation for work samples section
      if (sectionNumber === 4) {
        const workSamplesContainer = document.getElementById('work-samples-container');
        const workSamples = workSamplesContainer.querySelectorAll('.work-sample-item');
        
        let workSamplesValid = true;
        workSamples.forEach(sample => {
          const requiredSampleFields = sample.querySelectorAll('.required');
          requiredSampleFields.forEach(field => {
            if (field.value.trim() === '') {
              field.classList.add('is-invalid');
              workSamplesValid = false;
            } else {
              field.classList.remove('is-invalid');
            }
          });
        });
        
        isValid = isValid && workSamplesValid;
      }
      
      return isValid;
    }
    
    function changeSection(currentSectionNum, nextSectionNum) {
      // Hide current section
      document.getElementById(`section-${currentSectionNum}`).style.display = 'none';
      
      // Show next section
      document.getElementById(`section-${nextSectionNum}`).style.display = 'block';
      
      // Update progress bar
      updateProgress(nextSectionNum);
      
      // Update active step
      document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
      });
      document.querySelector(`.step[data-step="${nextSectionNum}"]`).classList.add('active');
      
      // Update current section
      currentSection = nextSectionNum;
    }
    
    function updateProgress(sectionNumber) {
      const progress = (sectionNumber / 4) * 100;
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', progress);
    }
    
    function addSkill() {
      const skillInput = document.getElementById('portfolio-skill-input');
      const skillsContainer = document.getElementById('skills-container');
      const portfolioSkills = document.getElementById('portfolio-skills');
      
      const skill = skillInput.value.trim();
      if (skill !== '') {
        // Create skill tag
        const skillTag = document.createElement('span');
        skillTag.className = 'tag';
        skillTag.innerHTML = `${skill} <i class="fas fa-times remove-skill"></i>`;
        
        // Add remove event listener
        skillTag.querySelector('.remove-skill').addEventListener('click', function() {
          skillsContainer.removeChild(skillTag);
          updateSkillsValue();
        });
        
        // Add to container
        skillsContainer.appendChild(skillTag);
        
        // Update hidden input
        updateSkillsValue();
        
        // Clear input
        skillInput.value = '';
        skillInput.classList.remove('is-invalid');
      }
    }
    
    function updateSkillsValue() {
      const skillsContainer = document.getElementById('skills-container');
      const portfolioSkills = document.getElementById('portfolio-skills');
      
      const skills = Array.from(skillsContainer.querySelectorAll('.tag')).map(tag => 
        tag.textContent.trim().replace(' ×', '')
      );
      
      portfolioSkills.value = skills.join(',');
    }
    
    function addWorkExperience() {
      const workExpContainer = document.getElementById('work-experience-container');
      const expCount = workExpContainer.querySelectorAll('.work-experience-item').length + 1;
      
      // Create work experience template
      const workExpTemplate = `
        <div class="work-experience-item card mb-3 p-3">
          <div class="d-flex justify-content-between mb-2">
            <h5 class="card-title mb-0">Experience #${expCount}</h5>
            <button type="button" class="btn btn-sm btn-outline-danger remove-experience">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Work Title <span class="text-danger">*</span></label>
                <input type="text" class="form-control work-title required" placeholder="Position or project title">
                <div class="invalid-feedback">Work title is required</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Company/Client <span class="text-danger">*</span></label>
                <input type="text" class="form-control work-company required" placeholder="Company or client name">
                <div class="invalid-feedback">Company/client is required</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Start Date <span class="text-danger">*</span></label>
                <input type="month" class="form-control work-start-date required">
                <div class="invalid-feedback">Start date is required</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">End Date <span class="text-danger">*</span></label>
                <input type="month" class="form-control work-end-date required">
                <div class="invalid-feedback">End date is required</div>
                <div class="form-check mt-2">
                  <input class="form-check-input work-current" type="checkbox" id="currentWork${expCount}">
                  <label class="form-check-label" for="currentWork${expCount}">
                    I currently work here
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Description <span class="text-danger">*</span></label>
            <textarea class="form-control work-description required" rows="2" placeholder="Describe your responsibilities and achievements..."></textarea>
            <div class="invalid-feedback">Work description is required</div>
          </div>
        </div>
      `;
      
      // Add to container
      workExpContainer.insertAdjacentHTML('beforeend', workExpTemplate);
      
      // Show remove buttons if more than one experience
      if (expCount > 1) {
        document.querySelectorAll('.remove-experience').forEach(btn => {
          btn.style.display = 'block';
        });
      }
      
      // Add remove event listener
      const newExp = workExpContainer.lastElementChild;
      newExp.querySelector('.remove-experience').addEventListener('click', function() {
        workExpContainer.removeChild(newExp);
        updateExperienceCount();
      });
    }
    
    function resetWorkExperience() {
      const workExpContainer = document.getElementById('work-experience-container');
      
      // Remove all except the first one
      while (workExpContainer.children.length > 1) {
        workExpContainer.removeChild(workExpContainer.lastElementChild);
      }
      
      // Reset the first one
      const firstExp = workExpContainer.firstElementChild;
      firstExp.querySelector('.work-title').value = '';
      firstExp.querySelector('.work-company').value = '';
      firstExp.querySelector('.work-start-date').value = '';
      firstExp.querySelector('.work-end-date').value = '';
      firstExp.querySelector('.work-current').checked = false;
      firstExp.querySelector('.work-description').value = '';
      
      // Hide remove button
      firstExp.querySelector('.remove-experience').style.display = 'none';
    }
    
    function updateExperienceCount() {
      const workExpContainer = document.getElementById('work-experience-container');
      const exps = workExpContainer.querySelectorAll('.work-experience-item');
      
      // Update title numbers
      exps.forEach((exp, index) => {
        exp.querySelector('.card-title').textContent = `Experience #${index + 1}`;
      });
      
      // Hide remove button if only one experience
      if (exps.length === 1) {
        exps[0].querySelector('.remove-experience').style.display = 'none';
      } else {
        exps.forEach(exp => {
          exp.querySelector('.remove-experience').style.display = 'block';
        });
      }
    }
    
    function addWorkSample() {
      const workSamplesContainer = document.getElementById('work-samples-container');
      const sampleCount = workSamplesContainer.querySelectorAll('.work-sample-item').length + 1;
      
      // Create work sample template
      const workSampleTemplate = `
        <div class="work-sample-item card mb-3 p-3">
          <div class="d-flex justify-content-between mb-2">
            <h5 class="card-title mb-0">Sample #${sampleCount}</h5>
            <button type="button" class="btn btn-sm btn-outline-danger remove-sample">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="mb-3">
                <label class="form-label">Project Title <span class="text-danger">*</span></label>
                <input type="text" class="form-control sample-title required" placeholder="Project name">
                <div class="invalid-feedback">Project title is required</div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Project Description <span class="text-danger">*</span></label>
            <textarea class="form-control sample-description required" rows="2" placeholder="Describe your project..."></textarea>
            <div class="invalid-feedback">Project description is required</div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="mb-3">
                <label class="form-label">Project URL <span class="text-danger">*</span></label>
                <input type="url" class="form-control sample-url required" placeholder="https://...">
                <div class="invalid-feedback">Project URL is required</div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add to container
      workSamplesContainer.insertAdjacentHTML('beforeend', workSampleTemplate);
      
      // Show remove buttons if more than one sample
      if (sampleCount > 1) {
        document.querySelectorAll('.remove-sample').forEach(btn => {
          btn.style.display = 'block';
        });
      }
      
      // Add remove event listener
      const newSample = workSamplesContainer.lastElementChild;
      newSample.querySelector('.remove-sample').addEventListener('click', function() {
        workSamplesContainer.removeChild(newSample);
        updateSampleCount();
      });
    }
    
    function resetWorkSamples() {
      const workSamplesContainer = document.getElementById('work-samples-container');
      
      // Remove all except the first one
      while (workSamplesContainer.children.length > 1) {
        workSamplesContainer.removeChild(workSamplesContainer.lastElementChild);
      }
      
      // Reset the first one
      const firstSample = workSamplesContainer.firstElementChild;
      firstSample.querySelector('.sample-title').value = '';
      firstSample.querySelector('.sample-description').value = '';
      firstSample.querySelector('.sample-url').value = '';
      
      // Hide remove button
      firstSample.querySelector('.remove-sample').style.display = 'none';
    }
    
    function updateSampleCount() {
      const workSamplesContainer = document.getElementById('work-samples-container');
      const samples = workSamplesContainer.querySelectorAll('.work-sample-item');
      
      // Update title numbers
      samples.forEach((sample, index) => {
        sample.querySelector('.card-title').textContent = `Sample #${index + 1}`;
      });
      
      // Hide remove button if only one sample
      if (samples.length === 1) {
        samples[0].querySelector('.remove-sample').style.display = 'none';
      } else {
        samples.forEach(sample => {
          sample.querySelector('.remove-sample').style.display = 'block';
        });
      }
    }
    
    function collectWorkExperiences() {
      const workExpContainer = document.getElementById('work-experience-container');
      const experiences = [];
      
      workExpContainer.querySelectorAll('.work-experience-item').forEach(item => {
        experiences.push({
          title: item.querySelector('.work-title').value,
          company: item.querySelector('.work-company').value,
          startDate: item.querySelector('.work-start-date').value,
          endDate: item.querySelector('.work-end-date').value,
          isCurrent: item.querySelector('.work-current').checked,
          description: item.querySelector('.work-description').value
        });
      });
      
      return experiences;
    }
    
    function collectWorkSamples() {
      const workSamplesContainer = document.getElementById('work-samples-container');
      const samples = [];
      
      workSamplesContainer.querySelectorAll('.work-sample-item').forEach(item => {
        samples.push({
          title: item.querySelector('.sample-title').value,
          description: item.querySelector('.sample-description').value,
          url: item.querySelector('.sample-url').value
        });
      });
      
      return samples;
    }
  
    function submitPortfolioForm(e) {
      e.preventDefault();
      
      // Validate all sections
      let isValid = true;
      for (let i = 1; i <= 4; i++) {
        if (!validateSection(i)) {
          isValid = false;
          changeSection(currentSection, i);
          break;
        }
      }
      
      if (isValid) {
        // Get portfolio data
        const portfolioName = document.getElementById('portfolio-name').value;
        const portfolioType = document.getElementById('portfolio-type').value;
        const portfolioDescription = document.getElementById('portfolio-description').value;
        const portfolioSkills = document.getElementById('portfolio-skills').value.split(',');
        const workExperiences = collectWorkExperiences();
        const workSamples = collectWorkSamples();
        
        if (isEditMode && editingPortfolioId) {
          // Update existing portfolio
          const existingCard = document.querySelector(`.portfolio-card[data-portfolio-id="${editingPortfolioId}"]`);
          if (existingCard) {
            // Update card content
            existingCard.querySelector('.portfolio-card-title').textContent = portfolioName;
            existingCard.querySelector('.portfolio-card-desc').textContent = portfolioDescription;
            
            // Update skills tags
            const tagsContainer = existingCard.querySelector('.portfolio-card-tags');
            tagsContainer.innerHTML = portfolioSkills.map(skill => `<span class="tag">${skill}</span>`).join('');
            
            // Update stored data
            existingCard.dataset.workExperiences = JSON.stringify(workExperiences);
            existingCard.dataset.workSamples = JSON.stringify(workSamples);
            
            // Show success notification
            const successNotification = document.getElementById('success-notification');
            successNotification.innerHTML = '<i class="fas fa-check-circle me-2"></i> Portfolio successfully updated! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
          }
        } else {
          // Create new portfolio card
          const newPortfolioCard = document.createElement('div');
          newPortfolioCard.className = 'portfolio-card';
          newPortfolioCard.dataset.portfolioId = portfolioCounter++;
          
          // Create card content
          newPortfolioCard.innerHTML = `
            <div class="portfolio-card-content">
              <h3 class="portfolio-card-title">${portfolioName}</h3>
              <div class="portfolio-card-tags">
                ${portfolioSkills.map(skill => `<span class="tag">${skill}</span>`).join('')}
              </div>
              <p class="portfolio-card-desc">${portfolioDescription}</p>
              <div class="portfolio-card-footer">
                <div class="portfolio-actions mt-3">
                  <button class="btn btn-primary view-portfolio-btn me-2">
                    <i class="far fa-eye me-1"></i> View
                  </button>
                  <button class="btn btn-secondary edit-portfolio-btn me-2">
                    <i class="far fa-edit me-1"></i> Edit
                  </button>
                  <button class="btn btn-danger delete-portfolio-btn" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                    <i class="far fa-trash-alt me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          `;
          
          // Store work experience and samples data in dataset
          newPortfolioCard.dataset.workExperiences = JSON.stringify(workExperiences);
          newPortfolioCard.dataset.workSamples = JSON.stringify(workSamples);
          
          // Add event listeners
          newPortfolioCard.querySelector('.view-portfolio-btn').addEventListener('click', function() {
            viewPortfolioDetails(newPortfolioCard.dataset.portfolioId);
          });
          
          newPortfolioCard.querySelector('.edit-portfolio-btn').addEventListener('click', function() {
            editPortfolio(newPortfolioCard.dataset.portfolioId);
          });
          
          newPortfolioCard.querySelector('.delete-portfolio-btn').addEventListener('click', function() {
            document.getElementById('deleteConfirmModal').dataset.portfolioId = newPortfolioCard.dataset.portfolioId;
          });
          
          // Insert before "Create New Portfolio" card
          const createCard = document.getElementById('create-portfolio-btn');
          createCard.parentNode.insertBefore(newPortfolioCard, createCard);
          
          // Show success notification with correct message for creation
          const successNotification = document.getElementById('success-notification');
          successNotification.innerHTML = '<i class="fas fa-check-circle me-2"></i> Portfolio successfully created! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        }
        
        // Hide form with animation
        formContainer.style.opacity = '0';
        setTimeout(() => {
          formContainer.style.display = 'none';
          portfolioView.style.display = 'block';
          
          // Show notification
          const successNotification = document.getElementById('success-notification');
          successNotification.style.display = 'block';
          setTimeout(() => {
            successNotification.classList.add('show');
            
            // Auto-hide notification after 2 seconds
            setTimeout(() => {
              successNotification.classList.remove('show');
              setTimeout(() => {
                successNotification.style.display = 'none';
              }, 300);
            }, 2000);
          }, 10);
        }, 300);
      }
    }
    
    function viewPortfolioDetails(portfolioId) {
      // Get portfolio data
      const portfolioCard = document.querySelector(`.portfolio-card[data-portfolio-id="${portfolioId}"]`);
      const portfolioTitle = portfolioCard.querySelector('.portfolio-card-title').textContent;
      const portfolioDesc = portfolioCard.querySelector('.portfolio-card-desc').textContent;
      
      // Update detail view
      document.getElementById('view-portfolio-title').textContent = portfolioTitle;
      document.getElementById('view-portfolio-description').textContent = portfolioDesc;
      detailView.dataset.portfolioId = portfolioId;
      
      // Show skills
      const skillsContainer = document.getElementById('view-portfolio-skills');
      skillsContainer.innerHTML = '';
      
      portfolioCard.querySelectorAll('.portfolio-card-tags .tag').forEach(tag => {
        const skillTag = document.createElement('span');
        skillTag.className = 'tag';
        skillTag.textContent = tag.textContent;
        skillsContainer.appendChild(skillTag);
      });
      
      // Show work experiences
      const experiencesContainer = document.getElementById('view-portfolio-experiences');
      experiencesContainer.innerHTML = '';
      
      if (portfolioCard.dataset.workExperiences) {
        const experiences = JSON.parse(portfolioCard.dataset.workExperiences);
        
        if (experiences.length > 0) {
          experiences.forEach(exp => {
            const endDateText = exp.isCurrent ? 'Present' : formatDate(exp.endDate);
            const expItem = document.createElement('div');
            expItem.className = 'experience-item mb-4';
            expItem.innerHTML = `
              <h5>${exp.title}</h5>
              <p class="text-secondary mb-1">${exp.company} | ${formatDate(exp.startDate)} - ${endDateText}</p>
              <p>${exp.description}</p>
            `;
            experiencesContainer.appendChild(expItem);
          });
        } else {
          experiencesContainer.innerHTML = '<p class="text-muted">No work experience added.</p>';
        }
      } else {
        experiencesContainer.innerHTML = '<p class="text-muted">No work experience added.</p>';
      }
      
      // Show work samples
      const samplesContainer = document.getElementById('view-portfolio-samples');
      samplesContainer.innerHTML = '';
      
      if (portfolioCard.dataset.workSamples) {
        const samples = JSON.parse(portfolioCard.dataset.workSamples);
        
        if (samples.length > 0) {
          samples.forEach(sample => {
            const sampleItem = document.createElement('div');
            sampleItem.className = 'sample-item mb-4';
            sampleItem.innerHTML = `
              <h5>${sample.title}</h5>
              <p>${sample.description}</p>
              <a href="${sample.url}" target="_blank" class="btn btn-sm btn-outline-primary">View Project <i class="fas fa-external-link-alt ms-1"></i></a>
            `;
            samplesContainer.appendChild(sampleItem);
          });
        } else {
          samplesContainer.innerHTML = '<p class="text-muted">No work samples added.</p>';
        }
      } else {
        samplesContainer.innerHTML = '<p class="text-muted">No work samples added.</p>';
      }
      
      // Hide other views
      portfolioView.style.display = 'none';
      formContainer.style.display = 'none';
      
      // Show detail view
      detailView.style.display = 'block';
    }
    
    function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  
    function savePortfoliosToLocalStorage() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const portfolios = [];
    
    portfolioCards.forEach(card => {
      // Skip the "Create New Portfolio" card
      if (!card.classList.contains('create-card')) {
        portfolios.push({
          id: card.dataset.portfolioId,
          title: card.querySelector('.portfolio-card-title').textContent,
          description: card.querySelector('.portfolio-card-desc').textContent,
          skills: Array.from(card.querySelectorAll('.portfolio-card-tags .tag')).map(tag => tag.textContent.trim()),
          workExperiences: JSON.parse(card.dataset.workExperiences || '[]'),
          workSamples: JSON.parse(card.dataset.workSamples || '[]')
        });
      }
    });
    
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }
  
  function loadPortfoliosFromLocalStorage() {
    const savedPortfolios = localStorage.getItem('portfolios');
    
    if (savedPortfolios) {
      const portfolios = JSON.parse(savedPortfolios);
      
      // Update portfolio counter to be higher than any existing ID
      portfolios.forEach(portfolio => {
        const id = parseInt(portfolio.id);
        if (id >= portfolioCounter) {
          portfolioCounter = id + 1;
        }
      });
      
      // Create portfolio cards for each saved portfolio
      portfolios.forEach(portfolio => {
        const newPortfolioCard = document.createElement('div');
        newPortfolioCard.className = 'portfolio-card';
        newPortfolioCard.dataset.portfolioId = portfolio.id;
        
        // Create card content
        newPortfolioCard.innerHTML = `
          <div class="portfolio-card-content">
            <h3 class="portfolio-card-title">${portfolio.title}</h3>
            <div class="portfolio-card-tags">
              ${portfolio.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
            <p class="portfolio-card-desc">${portfolio.description}</p>
            <div class="portfolio-card-footer">
              <div class="portfolio-actions mt-3">
                <button class="btn btn-primary view-portfolio-btn me-2">
                  <i class="far fa-eye me-1"></i> View
                </button>
                <button class="btn btn-secondary edit-portfolio-btn me-2">
                  <i class="far fa-edit me-1"></i> Edit
                </button>
                <button class="btn btn-danger delete-portfolio-btn" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">
                  <i class="far fa-trash-alt me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        `;
        
        // Store work experience and samples data in dataset
        newPortfolioCard.dataset.workExperiences = JSON.stringify(portfolio.workExperiences);
        newPortfolioCard.dataset.workSamples = JSON.stringify(portfolio.workSamples);
        
        // Add event listeners
        newPortfolioCard.querySelector('.view-portfolio-btn').addEventListener('click', function() {
          viewPortfolioDetails(newPortfolioCard.dataset.portfolioId);
        });
        
        newPortfolioCard.querySelector('.edit-portfolio-btn').addEventListener('click', function() {
          editPortfolio(newPortfolioCard.dataset.portfolioId);
        });
        
        newPortfolioCard.querySelector('.delete-portfolio-btn').addEventListener('click', function() {
          document.getElementById('deleteConfirmModal').dataset.portfolioId = newPortfolioCard.dataset.portfolioId;
        });
        
        // Insert before "Create New Portfolio" card
        const createCard = document.getElementById('create-portfolio-btn');
        createCard.parentNode.insertBefore(newPortfolioCard, createCard);
      });
    }
  }
    
    function editPortfolio(portfolioId) {
      // Get portfolio data
      const portfolioCard = document.querySelector(`.portfolio-card[data-portfolio-id="${portfolioId}"]`);
      const portfolioTitle = portfolioCard.querySelector('.portfolio-card-title').textContent;
      const portfolioDesc = portfolioCard.querySelector('.portfolio-card-desc').textContent;
      
      // Update form fields
      document.getElementById('portfolio-name').value = portfolioTitle;
      document.getElementById('portfolio-description').value = portfolioDesc;
      
      // Update skills
      const skillsContainer = document.getElementById('skills-container');
      skillsContainer.innerHTML = '';
      
      const skills = [];
      portfolioCard.querySelectorAll('.portfolio-card-tags .tag').forEach(tag => {
        const skill = tag.textContent.trim();
        skills.push(skill);
        
        const skillTag = document.createElement('span');
        skillTag.className = 'tag';
        skillTag.innerHTML = `${skill} <i class="fas fa-times remove-skill"></i>`;
        
        skillTag.querySelector('.remove-skill').addEventListener('click', function() {
          skillsContainer.removeChild(skillTag);
          updateSkillsValue();
        });
        
        skillsContainer.appendChild(skillTag);
      });
      
      document.getElementById('portfolio-skills').value = skills.join(',');
      
      // Update form header
      document.getElementById('form-header-text').textContent = 'Edit Portfolio';
      document.getElementById('form-header-icon').className = 'fas fa-edit';
      document.getElementById('submit-button-text').textContent = 'Update Portfolio';
  
      // Set edit mode
  isEditMode = true;
  editingPortfolioId = portfolioId;
      
      // Hide other views
      portfolioView.style.display = 'none';
      detailView.style.display = 'none';
      
      // Show form starting with first section
      changeSection(currentSection, 1);
      document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById('section-1').style.display = 'block';
      
      formContainer.style.opacity = '0';
      formContainer.style.display = 'block';
      setTimeout(() => {
        formContainer.style.transition = 'opacity 0.3s ease';
        formContainer.style.opacity = '1';
      }, 10);
      
      currentSection = 1;
    }
  });
  