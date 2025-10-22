/*
 * MODIFICATIONS TEMPORAIRES POUR TESTS SANS AUTHENTIFICATION
 * 
 * Ce fichier a été modifié pour permettre les tests d'application sans authentification.
 * 
 * APRÈS LES TESTS, il faut :
 * 1. Décommenter la vérification d'authentification dans showApplicationModal()
 * 2. Remplacer "currentUser ? currentUser.id : null" par "currentUser.id" dans submitApplication()
 * 3. Décommenter checkAuthStatus() dans l'initialisation
 * 4. Supprimer le bouton "Apply Now (Test Mode)" et garder seulement le bouton normal
 * 5. Supprimer tous les console.log de débogage
 * 
 * Rechercher "TODO: APRÈS LES TESTS" pour trouver tous les endroits à modifier.
 */

const user = localStorage.getItem("user");
const first_name = localStorage.getItem('first_name');
const last_name = localStorage.getItem('last_name');
const email = localStorage.getItem('email');
const phone = localStorage.getItem('phone');

if(user){
    const buttonsAuth = document.getElementById('auth-buttons');
    buttonsAuth.classList.add('hidden');
    const buttonLogout = document.getElementById('logout-button');
    buttonLogout.classList.remove('hidden');
}

// Sample job data
async function getAllAds() {
    try {
        const res = await fetch(`http://localhost:3000/ads`, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        });
        const data = await res.json();
        return data.ads;
    } catch (error) {
        console.error('Error:', error);
    }
}

(async () => {
    let jobsData;
    jobsData = await getAllAds();

    let filteredJobs = [...jobsData];
    let selectedJobId = null;
    let currentUser = user;
    let currentApplicationJobId = null;

// DOM elements
    const jobsList = document.getElementById('jobs-list');
    const jobDetailsPanel = document.getElementById('job-details-panel');
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const adminLink = document.getElementById('admin-link');
    renderJobs(filteredJobs);
// Data storage (in a real app, this would be a database)
    let users = [
        {
            id: 1,
            name: "Admin User",
            email: "admin@jobboard.com",
            password: "admin123",
            role: "admin"
        }
    ];

    let applications = [];

// Global functions (accessible from HTML) - Define early
    window.showJobDetails = function(jobId) {
        const job = jobsData.find(j => j.id === jobId);
        if (!job) return;

        selectedJobId = jobId;

        // Update job details panel
        jobDetailsPanel.innerHTML = `
        <div class="job-details-header">
            <h2 class="job-details-title">${job.title}</h2>
            <p class="job-details-company">${job.company}</p>
        </div>
        <div class="job-details-body">
            <div class="job-details">
                <div class="detail-item">
                    <div class="detail-label">Salary</div>
                    <div class="detail-value">${job.salary}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Schedule</div>
                    <div class="detail-value">${job.schedule}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${job.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Job Type</div>
                    <div class="detail-value">${job.position_type}</div>
                </div>
            </div>
            <div class="full-description">
                <h3>Full Description</h3>
                <p>${job.full_description}</p>
            </div>
             ${`<button class="apply-btn" onclick="showApplicationModal(${job.id})">Apply Now</button>` }
        </div>
    `;

        // Re-render jobs to update selected state
        renderJobs(filteredJobs);
    };

    window.showLoginModal = function() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'block';
            // Force a reflow to ensure the change takes effect
            modal.offsetHeight;
        } else {

        }
    };

    window.showRegisterModal = function() {
        const modal = document.getElementById('register-modal');
        if (modal) {
            modal.style.display = 'block';
            // Force a reflow to ensure the change takes effect
            modal.offsetHeight;
        } else {

        }
    };

    window.showApplicationModal = function(jobId) {

        
        currentApplicationJobId = jobId;
        const modal = document.getElementById('application-modal');
        if (modal) {
            modal.style.display = 'block';
            if(user !== undefined){
                document.getElementById('application-first-name').value = first_name
                document.getElementById('application-last-name').value = last_name
                document.getElementById('application-email').value = email
                document.getElementById('application-phone').value = phone
            }

            
            // Test: Vérifier que le formulaire existe dans le modal
            const form = document.getElementById('application-form');
            if (form) {

                // Attacher l'event listener directement quand le modal s'ouvre
                // (au cas où il n'était pas attaché avant)
                const existingListener = form.getAttribute('data-listener-attached');
                if (!existingListener) {

                    // Event listener sur le formulaire
                    form.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const formData = {
                            firstname: document.getElementById('application-first-name').value,
                            lastname: document.getElementById('application-last-name').value,
                            email: document.getElementById('application-email').value,
                            phone: document.getElementById('application-phone').value,
                            message:document.getElementById('application-message').value
                        };

                        if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone || !formData.message) {
                            alert("Please fill in all required fields");
                            return;
                        }
                        
                        return await submitApplication(formData);
                    });
                    form.setAttribute('data-listener-attached', 'true');
                }
            } else {
                console.error("Form not found in modal!");
            }
        } else {
            console.error("Application modal not found");
        }
    };
    window.toLogin = function() {
        window.location.replace("../login.html");
    }
    window.toRegister = function() {
        window.location.replace("../signup.html");
    }
    window.showCreateJobModal = function() {
        if (!currentUser || currentUser.role !== 'admin') {
            showNotification('Admin access required', 'error');
            return;
        }
        document.getElementById('create-job-modal').style.display = 'block';
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };

    window.showHomePage = function() {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('home-page').style.display = 'block';
        renderJobs(filteredJobs);
    };

    window.showUserDashboard = function() {
        if (!currentUser) {
            showNotification('Please login first', 'error');
            return;
        }
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('user-dashboard').style.display = 'block';
        loadUserApplications();
    };

    window.showAdminDashboard = function() {
        if (!currentUser || currentUser.role !== 'admin') {
            showNotification('Admin access required', 'error');
            return;
        }
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminData();
    };

    window.logout = function() {
        localStorage.removeItem("user");
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        window.location.reload();

    };

    window.toggleUserDropdown = function() {
        const dropdown = document.getElementById('dropdown-menu');
        dropdown.classList.toggle('show');
    };

    // Fonction de test pour déboguer
    window.testApplicationForm = function() {
        const form = document.getElementById('application-form');
        const modal = document.getElementById('application-modal');
        const submitButton = form ? form.querySelector('button[type="submit"]') : null;
        


        
        return {
            form: !!form,
            modal: !!modal,
            submitButton: !!submitButton
        };
    };

    // Fonction de test manuel pour soumettre le formulaire
    window.testSubmitApplication = function() {
        const formData = {
            name: document.getElementById('application-name').value,
            email: document.getElementById('application-email').value,
            phone: document.getElementById('application-phone').value,
            resume: document.getElementById('application-resume').value,
            coverLetter: document.getElementById('application-cover-letter').value
        };

        if (!formData.name || !formData.email) {
            console.error("Form data incomplete");
            return;
        }
        
        submitApplication(formData);
    };

// Initialization
    document.addEventListener('DOMContentLoaded', function() {
        renderJobs(filteredJobs);
        setupEventListeners();
        // TODO: APRÈS LES TESTS - Décommenter la ligne suivante pour activer la vérification d'authentification
        // checkAuthStatus();
    });

// Render job listings
    function renderJobs(jobs) {
        jobsList.innerHTML = '';

        if (jobs.length === 0) {
            jobsList.innerHTML = '<div class="loading"><p>No jobs found</p></div>';
            return;
        }

        jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsList.appendChild(jobCard);
        });
    }

// Create job card
    function createJobCard(job) {
        const card = document.createElement('div');
        card.className = `job-card ${selectedJobId === job.id ? 'selected' : ''}`;
        // card.onclick = () => showJobDetails(job.id);
        card.innerHTML = `
        <h3 class="job-title">${job.title}</h3>
        <p class="company-name">${job.company}</p>
        <p class="job-description">${job.short_description}</p>
        <div class="job-meta">
            <div class="job-location">
                <span>Place:</span>
                <span>${job.location}</span>
            </div>
            <span class="job-type">${job.position_type}</span>
        </div>
        <button class="learn-more-btn" onclick="event.stopPropagation(); showJobDetails(${job.id})">
            Learn More
        </button>
        ${currentUser ? `<button class="btn btn-primary" style="margin-top: 10px; width: 100%;" onclick="event.stopPropagation(); showApplicationModal(${job.id})">
            Apply Now
        </button>` : `<button class="btn btn-primary" style="margin-top: 10px; width: 100%;" onclick="event.stopPropagation(); showApplicationModal(${job.id})">
            Apply Now
        </button>`}
    `;
        return card;
    }


// Setup event listeners
    function setupEventListeners() {
        // Filters
        const locationFilter = document.getElementById('location-filter');
        const typeFilter = document.getElementById('type-filter');
        const experienceFilter = document.getElementById('experience-filter');

        [locationFilter, typeFilter, experienceFilter].forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });

        // Search
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        // Form submissions - Application form (the only one that exists in candidate.html)
        const applicationForm = document.getElementById('application-form');
        if (applicationForm) {

            // Test: Ajouter un event listener simple pour vérifier
            applicationForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                e.stopPropagation();

                
                const formData = {
                    name: document.getElementById('application-name').value,
                    email: document.getElementById('application-email').value,
                    phone: document.getElementById('application-phone').value,
                    resume: document.getElementById('application-resume').value,
                    coverLetter: document.getElementById('application-cover-letter').value
                };

                // Vérifier que les données ne sont pas vides
                if (!formData.name || !formData.email) {
                    console.error("Form data is incomplete:", formData);
                    alert("Please fill in all required fields");
                    return;
                }
                
                await submitApplication(formData);
                return false; // Empêcher la soumission par défaut
            });

            
            // Test: Ajouter aussi un event listener sur le bouton submit
            const submitButton = applicationForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Déclencher manuellement la soumission du formulaire
                    applicationForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                });
            } else {
                console.error("Submit button not found in form");
            }
        } else {
            console.error("Application form not found in DOM");
        }

        // Create job form (if it exists)
        const createJobForm = document.getElementById('create-job-form');
        if (createJobForm) {
            createJobForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = {
                    title: document.getElementById('job-title').value,
                    company: document.getElementById('job-company').value,
                    location: document.getElementById('job-location').value,
                    salary: document.getElementById('job-salary').value,
                    type: document.getElementById('job-type').value,
                    experience: document.getElementById('job-experience').value,
                    shortDescription: document.getElementById('job-short-description').value,
                    fullDescription: document.getElementById('job-full-description').value
                };
                createJob(formData);
            });
        }

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                // Don't close if clicking on modal content
                const modalContent = event.target.querySelector('.modal-content');
                if (!modalContent || !modalContent.contains(event.target)) {
                    event.target.style.display = 'none';
                }
            }
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', function(event) {
            if (!event.target.closest('.user-dropdown')) {
                document.getElementById('dropdown-menu').classList.remove('show');
            }
        });

        // Add direct event listeners to auth buttons as backup
        const loginBtn = document.querySelector('.btn-outline');
        const registerBtn = document.querySelector('.btn-primary');

        if (loginBtn && loginBtn.textContent.trim() === 'Login') {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();

                window.showLoginModal();
            });
        }

        if (registerBtn && registerBtn.textContent.trim() === 'Register') {
            registerBtn.addEventListener('click', function(e) {
                e.preventDefault();

                window.showRegisterModal();
            });
        }
    }

// Apply filters
    function applyFilters() {
        const locationFilter = document.getElementById('location-filter').value.toLowerCase();
        const typeFilter = document.getElementById('type-filter').value.toLowerCase();
        const experienceFilter = document.getElementById('experience-filter').value.toLowerCase();

        filteredJobs = jobsData.filter(job => {
            const locationMatch = !locationFilter ||
                job.location.toLowerCase().includes(locationFilter) ||
                (locationFilter === 'remote' && job.location.toLowerCase() === 'remote');

            const typeMatch = !typeFilter || job.type.toLowerCase().includes(typeFilter);
            const experienceMatch = !experienceFilter || job.experience === experienceFilter;

            return locationMatch && typeMatch && experienceMatch;
        });

        // Clear selection when filtering
        selectedJobId = null;
        jobDetailsPanel.innerHTML = `
        <div class="no-selection">
            <h3>Select a job to view details</h3>
            <p>Click on "Learn More" to see the full job description and requirements.</p>
        </div>
    `;

        renderJobs(filteredJobs);
    }

// Perform search
    function performSearch() {
        const searchTerm = document.querySelector('.search-input').value.toLowerCase();

        if (!searchTerm.trim()) {
            applyFilters();
            return;
        }

        const searchResults = filteredJobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.shortDescription.toLowerCase().includes(searchTerm) ||
            job.fullDescription.toLowerCase().includes(searchTerm)
        );

        // Clear selection when searching
        selectedJobId = null;
        jobDetailsPanel.innerHTML = `
        <div class="no-selection">
            <h3>Select a job to view details</h3>
            <p>Click on "Learn More" to see the full job description and requirements.</p>
        </div>
    `;

        renderJobs(searchResults);
    }

// Authentication Functions
    function checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateAuthUI();
        }
    }

    function updateAuthUI() {
        if (currentUser) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            userName.textContent = currentUser.name;

            if (currentUser.role === 'admin') {
                adminLink.style.display = 'block';
            }
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    function login(email, password) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateAuthUI();
            closeModal('login-modal');
            showNotification('Login successful!', 'success');
            return true;
        }
        showNotification('Invalid email or password', 'error');
        return false;
    }

    function register(name, email, password, role) {
        if (users.find(u => u.email === email)) {
            showNotification('Email already exists', 'error');
            return false;
        }

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            role
        };

        users.push(newUser);
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        updateAuthUI();
        closeModal('register-modal');
        showNotification('Registration successful!', 'success');
        return true;
    }



// Application Functions
    async function submitApplication(formData) {

        const application = {
            ad_id: currentApplicationJobId,
            last_name: formData.lastname,
            first_name: formData.firstname,
            email: formData.email,
            phone: formData.phone,
            message: formData.message
        };
        

        try {
            const res = await fetch("http://localhost:3000/job_applications/", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(application)
            });


            if (res.status === 201){
                closeModal('application-modal');
                showNotification('Application submitted successfully!', 'success');
                // Reset form
                document.getElementById('application-form').reset();
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
                console.error("Error response:", errorData);
                showNotification(`Error: ${errorData.message || 'Failed to submit application'}`, 'error');
            }
        } catch (error) {
            console.error("Network error:", error);
            showNotification('Network error. Please try again.', 'error');
        }
    }

    function loadUserApplications() {
        const userApplications = applications.filter(app => app.userId === currentUser.id);
        const applicationsList = document.getElementById('applications-list');

        if (userApplications.length === 0) {
            applicationsList.innerHTML = '<p>No applications found.</p>';
            return;
        }

        applicationsList.innerHTML = userApplications.map(app => {
            const job = jobsData.find(j => j.id === app.jobId);
            return `
            <div class="application-card">
                <div class="application-header">
                    <div>
                        <div class="application-title">${job ? job.title : 'Job Not Found'}</div>
                        <div class="application-company">${job ? job.company : 'Unknown Company'}</div>
                    </div>
                    <span class="application-status status-${app.status}">${app.status}</span>
                </div>
                <div class="application-date">Applied on: ${new Date(app.appliedDate).toLocaleDateString()}</div>
            </div>
        `;
        }).join('');
    }

    function loadAdminData() {
        loadJobsManagement();
        loadApplicationsManagement();
    }

    function loadJobsManagement() {
        const jobsManagement = document.getElementById('jobs-management');
        jobsManagement.innerHTML = `
        <div class="management-section">
            <h3>Job Management</h3>
            ${jobsData.map(job => `
                <div class="job-management-item">
                    <div class="job-management-info">
                        <h4>${job.title}</h4>
                        <p>${job.company} - ${job.location}</p>
                    </div>
                    <div class="job-management-actions">
                        <button class="btn btn-danger btn-small" onclick="deleteJob(${job.id})">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    }

    function loadApplicationsManagement() {
        const applicationsManagement = document.getElementById('applications-management');
        applicationsManagement.innerHTML = `
        <div class="management-section">
            <h3>Applications Management</h3>
            ${applications.map(app => {
            const job = jobsData.find(j => j.id === app.jobId);
            return `
                    <div class="application-management-item">
                        <div class="application-management-header">
                            <div>
                                <h4>${app.userName}</h4>
                                <p>${job ? job.title : 'Job Not Found'} - ${job ? job.company : 'Unknown'}</p>
                            </div>
                            <span class="application-status status-${app.status}">${app.status}</span>
                        </div>
                        <div class="application-management-actions">
                            <button class="btn btn-success btn-small" onclick="updateApplicationStatus(${app.id}, 'accepted')">Accept</button>
                            <button class="btn btn-danger btn-small" onclick="updateApplicationStatus(${app.id}, 'rejected')">Reject</button>
                        </div>
                    </div>
                `;
        }).join('')}
        </div>
    `;
    }

    function createJob(formData) {
        const newJob = {
            id: jobsData.length + 1,
            title: formData.title,
            company: formData.company,
            shortDescription: formData.shortDescription,
            fullDescription: formData.fullDescription,
            salary: formData.salary,
            schedule: formData.schedule || 'Full-time',
            location: formData.location,
            type: formData.type,
            experience: formData.experience
        };

        jobsData.push(newJob);
        filteredJobs = [...jobsData];
        closeModal('create-job-modal');
        showNotification('Job created successfully!', 'success');
        renderJobs(filteredJobs);
    }

    function deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job?')) {
            jobsData = jobsData.filter(job => job.id !== jobId);
            filteredJobs = [...jobsData];
            renderJobs(filteredJobs);
            showNotification('Job deleted successfully!', 'success');
        }
    }

    function updateApplicationStatus(applicationId, status) {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
            application.status = status;
            loadApplicationsManagement();
            showNotification(`Application ${status} successfully!`, 'success');
        }
    }

// Utility Functions
    function showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

        if (type === 'success') notification.style.background = '#28a745';
        else if (type === 'error') notification.style.background = '#dc3545';
        else notification.style.background = '#667eea';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

})();
// Global variables
