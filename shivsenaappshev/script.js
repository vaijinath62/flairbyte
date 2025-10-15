// 3D Mobile App Navigation and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D effects
    initialize3DEffects();
    
    // Initialize Image Slider
    initializeImageSlider();
    
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item-3d');
    const pages = document.querySelectorAll('.page-3d');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(event) {
            const targetPage = this.getAttribute('data-page');
            navigateToPage(targetPage);
            
            // Add 3D interaction effects
            createRippleEffect(this, event);
            simulateHapticFeedback();
        });
    });
    
    // 3D Card interactions
    const cards = document.querySelectorAll('.card-3d, .action-card-3d');
    cards.forEach(card => {
        // Touch feedback for mobile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95) rotateX(2deg) rotateY(2deg)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        // Hover effects for desktop
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotateX(3deg) rotateY(3deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    

    
    // Activity item interactions
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function(event) {
            createRippleEffect(this, event);
            simulateHapticFeedback();
            
            // 3D highlight effect
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 300);
        });
    });
    
    // Refresh button interaction
    const refreshButton = document.querySelector('.btn-refresh');
    if (refreshButton) {
        refreshButton.addEventListener('click', function(event) {
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
            
            createRippleEffect(this, event);
            simulateHapticFeedback();
        });
    }
    
    // Welcome animation for first card
    const firstCard = document.querySelector('.card-3d');
    if (firstCard) {
        setTimeout(() => {
            firstCard.style.animation = 'pageSlideIn 0.8s ease-out';
        }, 300);
    }
    
    // Problem Registration Form Functionality
    initializeProblemForm();
    
    // Initialize problem viewing functionality
    initializeProblemViewing();
    
    // Check session and auto-fill phone field
    checkSessionAndAutoFill();
    
    // Initialize logout functionality
    initializeLogout();

    // Load and display problem statistics
    loadProblemStats();
    
    // Initialize Abhipray Nondva section (always shown)
    initializeAbhipraySection();
    
    // Add click handler for "नोंदवलेल्या समस्या पहा" card
    const viewProblemsCard = document.querySelector('.card-success');
    if (viewProblemsCard) {
        viewProblemsCard.addEventListener('click', function() {
            showProblemsModal();
        });
    }
    
    // Add click handler for "नवीन समस्या नोंदवा" card
    const newProblemCard = document.getElementById('new-problem-card');
    if (newProblemCard) {
        newProblemCard.addEventListener('click', function() {
            const problemForm = document.getElementById('problem-form');
            if (problemForm) {
                problemForm.style.display = 'block';
                // Scroll to form
                problemForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add click handler for "दिलेले अभिप्राय पहा" card
    const viewAbhiprayCard = document.getElementById('view-abhipray-card');
    if (viewAbhiprayCard) {
        viewAbhiprayCard.addEventListener('click', function() {
            showViewAbhiprayModal();
        });
    }
    
    // Add click handler for "अभिप्राय नोंदवा" card
    const abhiprayCard = document.querySelector('.card-warning');
    if (abhiprayCard) {
        abhiprayCard.addEventListener('click', function() {
            showAbhiprayModal();
        });
    }
});

// Problem Registration Form Functionality
function initializeProblemForm() {
    const newProblemCard = document.getElementById('new-problem-card');
    const problemForm = document.getElementById('problem-form');
    const closeFormBtn = document.getElementById('close-form');
    const form = document.querySelector('.problem-form');
    
    // Show form when clicking on the card
    if (newProblemCard) {
        newProblemCard.addEventListener('click', function(event) {
            problemForm.style.display = 'block';
            problemForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add 3D interaction effects
            createRippleEffect(this, event);
            simulateHapticFeedback();
        });
    }
    
    // Close form when clicking close button
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', function(event) {
            problemForm.style.display = 'none';
            
            // Add 3D interaction effects
            createRippleEffect(this, event);
            simulateHapticFeedback();
        });
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> नोंदवत आहे...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(form);
            
            // Create JSON data for API
            const problemData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                village: formData.get('village'),
                address: formData.get('address'),
                family_members: formData.get('family-members'),
                problem_type: formData.get('problem-type'),
                description: formData.get('description')
            };
            
            // Handle file upload
            const photoFile = formData.get('photo');
            if (photoFile && photoFile.size > 0) {
                // For file upload, we'll use FormData directly
                const uploadFormData = new FormData();
                uploadFormData.append('name', problemData.name);
                uploadFormData.append('phone', problemData.phone);
                uploadFormData.append('village', problemData.village);
                uploadFormData.append('address', problemData.address);
                uploadFormData.append('family_members', problemData.family_members);
                uploadFormData.append('problem_type', problemData.problem_type);
                uploadFormData.append('description', problemData.description);
                uploadFormData.append('photo', photoFile);
                
                // Send with file upload
                fetch('api/register_problem.php', {
                    method: 'POST',
                    body: uploadFormData
                })
                .then(response => response.json())
                .then(data => {
                    handleFormResponse(data, submitBtn, originalText, form, problemForm);
                })
                .catch(error => {
                    showErrorMessage('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            } else {
                // Send without file
                fetch('api/register_problem.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(problemData)
                })
                .then(response => response.json())
                .then(data => {
                    handleFormResponse(data, submitBtn, originalText, form, problemForm);
                })
                .catch(error => {
                    showErrorMessage('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            }
        });
    }
    
    // Initialize floating labels
    initializeFloatingLabels();
}

// Handle form response
function handleFormResponse(data, submitBtn, originalText, form, problemForm) {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    if (data.success) {
        // Show success message with reference number
        const message = data.data && data.data.reference_number 
            ? `समस्या यशस्वीरित्या नोंदवली गेली आहे! संदर्भ क्रमांक: ${data.data.reference_number}`
            : data.message;
        showSuccessMessage(message);
        
        // Reset form
        form.reset();
        
        // Hide form
        problemForm.style.display = 'none';
        
        // Scroll to top of the page immediately
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Add 3D interaction effects
        createRippleEffect(form);
        simulateHapticFeedback();
        
        // Reload page after 2 seconds
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        

    } else {
        showErrorMessage(data.message || 'त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    }
}

// Initialize floating labels
function initializeFloatingLabels() {
    const inputs = document.querySelectorAll('.floating-input input, .floating-input select, .floating-input textarea');
    
    inputs.forEach(input => {
        // Handle focus events
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Handle input events for dynamic label positioning
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
        
        // Initialize state for pre-filled values
        if (input.value) {
            input.parentElement.classList.add('has-value');
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const successToast = document.createElement('div');
    successToast.className = 'success-toast';
    successToast.innerHTML = `
        <div class="toast-content">
            <i class="bi bi-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    successToast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff8c00, #ff6b35);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(255, 140, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(successToast);
    
    // Animate in
    setTimeout(() => {
        successToast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successToast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(successToast);
        }, 300);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const errorToast = document.createElement('div');
    errorToast.className = 'error-toast';
    errorToast.innerHTML = `
        <div class="toast-content">
            <i class="bi bi-x-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    errorToast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #dc3545, #c82333);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(errorToast);
    
    // Animate in
    setTimeout(() => {
        errorToast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorToast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(errorToast);
        }, 300);
    }, 3000);
}

// Image Slider Functionality
function initializeImageSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    let autoPlayInterval;
    
    // Function to show slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active', 'prev'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Add prev class to previous slide for animation
        const prevIndex = (index - 1 + slides.length) % slides.length;
        slides[prevIndex].classList.add('prev');
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Touch/swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            resetAutoPlay();
        }
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
}

// Navigation function with 3D transitions
function navigateToPage(pageId) {
    const pages = document.querySelectorAll('.page-3d');
    const navItems = document.querySelectorAll('.nav-item-3d');
    
    // Hide all pages with 3D effect
    pages.forEach(page => {
        page.style.transform = 'translateY(30px) rotateX(10deg)';
        page.style.opacity = '0';
        setTimeout(() => {
            page.classList.remove('active');
        }, 300);
    });
    
    // Show target page with 3D effect
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');
            targetPage.style.transform = 'translateY(0) rotateX(0deg)';
            targetPage.style.opacity = '1';
        }, 300);
    }
    
    // Update navigation active state
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });
}

// Create ripple effect
function createRippleEffect(element, event = null) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // If event is provided, use mouse position; otherwise center the ripple
    let x, y;
    if (event && event.clientX !== undefined && event.clientY !== undefined) {
        x = event.clientX - rect.left - size / 2;
        y = event.clientY - rect.top - size / 2;
    } else {
        // Center the ripple effect
        x = rect.width / 2 - size / 2;
        y = rect.height / 2 - size / 2;
    }
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Simulate haptic feedback
function simulateHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Initialize 3D effects
function initialize3DEffects() {
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth scroll with 3D highlight
function smoothScroll3D(targetElement) {
    targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    
    // 3D highlight effect
    targetElement.style.transform = 'scale(1.05)';
    targetElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    setTimeout(() => {
        targetElement.style.transform = '';
        targetElement.style.boxShadow = '';
    }, 1000);
}

// Initialize problem viewing functionality
function initializeProblemViewing() {
    const viewProblemsCard = document.querySelector('.card-success');
    
    if (viewProblemsCard) {
        viewProblemsCard.addEventListener('click', function(event) {
            // Add 3D interaction effects
            createRippleEffect(this, event);
            simulateHapticFeedback();
            
            // Navigate to problems page
            window.location.href = 'problems.php';
        });
    }
}

// Show problems modal
function showProblemsModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="problems-modal" id="problems-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h5><i class="bi bi-list-ul"></i> नोंदवलेल्या समस्या</h5>
                    <button class="close-modal-btn" id="close-problems-modal">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="search-section">
                        <div class="floating-input">
                            <input type="tel" id="search-phone" placeholder=" ">
                            <label for="search-phone">मोबाईल नंबर शोधा</label>
                        </div>
                        <button class="search-btn" id="search-problems">
                            <i class="bi bi-search"></i> शोधा
                        </button>
                    </div>
                    <div class="problems-list" id="problems-list">
                        <div class="loading-problems">
                            <i class="bi bi-hourglass-split"></i>
                            <p>समस्या लोड करत आहे...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize modal functionality
    initializeProblemsModal();
    
    // Load problems
    loadProblems();
}

// Initialize problems modal
function initializeProblemsModal() {
    const modal = document.getElementById('problems-modal');
    const closeBtn = document.getElementById('close-problems-modal');
    const searchBtn = document.getElementById('search-problems');
    const searchInput = document.getElementById('search-phone');
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }
    
    // Search functionality
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const phone = searchInput.value.trim();
            if (phone) {
                loadProblems(phone);
            } else {
                loadProblems();
            }
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// Load problems from API
function loadProblems(phone = null) {
    const problemsList = document.getElementById('problems-list');
    
    // Show loading
    problemsList.innerHTML = `
        <div class="loading-problems">
            <i class="bi bi-hourglass-split"></i>
            <p>समस्या लोड करत आहे...</p>
        </div>
    `;
    
    // Build API URL
    let apiUrl = 'api/get_problems.php';
    if (phone) {
        apiUrl += `?phone=${encodeURIComponent(phone)}`;
    }
    
    // Fetch problems
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayProblems(data.data.problems);
            } else {
                showProblemsError(data.message || 'समस्या लोड करताना त्रुटी आली');
            }
        })
        .catch(error => {
            showErrorMessage('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
        });
}

// Display problems in modal
function displayProblems(problems) {
    const problemsList = document.getElementById('problems-list');
    
    if (problems.length === 0) {
        problemsList.innerHTML = `
            <div class="no-problems">
                <i class="bi bi-inbox"></i>
                <p>कोणत्याही समस्या सापडल्या नाहीत</p>
            </div>
        `;
        return;
    }
    
    let problemsHTML = '';
    problems.forEach(problem => {

        problemsHTML += `
            <div class="problem-item">
                <div class="problem-header">
                    <div class="problem-ref">${problem.reference_number}</div>
                    <div class="problem-status ${problem.status}">${problem.status_marathi}</div>
                </div>
                <div class="problem-content">
                    <div class="problem-info">
                        <div class="problem-name">${problem.name}</div>
                        <div class="problem-phone">${problem.phone}</div>
                        <div class="problem-address">${problem.village ? problem.village + ' - ' : ''}${problem.address}</div>
                    </div>
                    <div class="problem-details">
                        <div class="problem-type">${problem.problem_type_marathi}</div>
                        <div class="problem-description">${problem.description}</div>
                        <div class="problem-date">${problem.days_ago}</div>
                    </div>
                    ${problem.photo_url ? `
                        <div class="problem-photo">
                            <img src="${problem.photo_url}" alt="Problem Photo" onclick="viewPhoto('${problem.photo_url}')">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    problemsList.innerHTML = problemsHTML;
}

// Show problems error
function showProblemsError(message) {
    const problemsList = document.getElementById('problems-list');
    problemsList.innerHTML = `
        <div class="problems-error">
            <i class="bi bi-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

// View photo in full screen
function viewPhoto(photoUrl) {
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.innerHTML = `
        <div class="photo-content">
            <button class="close-photo-btn">
                <i class="bi bi-x-lg"></i>
            </button>
            <img src="${photoUrl}" alt="Problem Photo">
        </div>
    `;
    
    document.body.appendChild(photoModal);
    
    // Close photo modal
    photoModal.addEventListener('click', function(e) {
        if (e.target === photoModal || e.target.closest('.close-photo-btn')) {
            document.body.removeChild(photoModal);
        }
    });
}

// Check session and auto-fill phone field
function checkSessionAndAutoFill() {
    fetch('api/get_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data && data.data.isLoggedIn && data.data.mobile) {
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                phoneInput.value = data.data.mobile;
                // Trigger input event to update floating label
                phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
        
            }
        }
    })
            .catch(error => {
        });
}

// Initialize logout functionality
function initializeLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
    
            
            // 3D press effect
            this.style.transform = 'scale(0.9) translateY(2px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            createRippleEffect(this, event);
            simulateHapticFeedback();
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to logout?')) {
        
                performLogout();
            } else {
        
            }
        });
            } else {
        }
}

// Perform logout
function performLogout() {
    
    
    fetch('api/logout.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Force redirect to login page
            window.location.replace('login.html');
        } else {
            alert('Logout failed. Please try again.');
        }
    })
    .catch(error => {
        alert('Logout failed. Please try again.');
    });
}

// Load and display problem statistics
function loadProblemStats() {
    
    
    // Get user's mobile from session
    fetch('api/get_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data && data.data.isLoggedIn && data.data.mobile) {
            // Load problems for this user
            loadProblemsForStats(data.data.mobile);
        } else {
        }
    })
            .catch(error => {
        });
}

// Load problems and calculate statistics
function loadProblemsForStats(phone) {
    // Get all problems for statistics (not paginated)
    const apiUrl = `api/get_problems.php?phone=${encodeURIComponent(phone)}&limit=1000`;
    

    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle the new API response structure with pagination
                const problems = (data.data && data.data.data) ? data.data.data : [];
                
                try {
                    // Validate problems before calling
                    if (!problems) {
                        problems = [];
                    }
                    // Call the function with safe fallback
                    calculateAndDisplayStats(problems || []);
                } catch (error) {
                    // Try with empty array as fallback
                    calculateAndDisplayStats([]);
                }
            } else {
            }
        })
        .catch(error => {
        });
}

// Calculate and display statistics
function calculateAndDisplayStats(problems) {
    // Ensure problems is an array - handle all edge cases
    if (!problems || !Array.isArray(problems)) {
        problems = [];
    }
    
    // Calculate stats safely
    const total = problems.length || 0;
    const pending = problems.filter(p => p && p.status === 'pending').length || 0;
    const resolved = problems.filter(p => p && p.status === 'resolved').length || 0;
    const in_progress = problems.filter(p => p && p.status === 'in_progress').length || 0;
    
    // Update the stats display
    const totalElement = document.getElementById('total-problems');
    const pendingElement = document.getElementById('pending-problems');
    const resolvedElement = document.getElementById('resolved-problems');
    const inProgressElement = document.getElementById('in-progress-problems');
    

    
    if (totalElement) totalElement.textContent = total;
    if (pendingElement) pendingElement.textContent = pending;
    if (resolvedElement) resolvedElement.textContent = resolved;
    if (inProgressElement) inProgressElement.textContent = in_progress;
}

// Initialize Abhipray Nondva section (always shown)
function initializeAbhipraySection() {
    // The abhipray card is now in the additional menu section
    // Click handler is already added in the main initialization
    console.log('Abhipray section initialized');
}

// Show Abhipray Nondva Modal
function showAbhiprayModal() {
    const modal = document.getElementById('abhipray-modal');
    if (modal) {
        modal.style.display = 'flex';
        loadUserSessionData();
        initializeAbhiprayModal();
    }
}

// Load user session data for abhipray form
function loadUserSessionData() {
    const mobileInput = document.getElementById('abhipray-mobile');
    const nameInput = document.getElementById('abhipray-name');
    
    fetch('api/get_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data && data.data.isLoggedIn && data.data.mobile) {
                // Auto-fill mobile number from session
                if (mobileInput) {
                    mobileInput.value = data.data.mobile;
                    mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                
                // Try to get user name from existing problems if available
                fetch(`api/get_problems.php?phone=${encodeURIComponent(data.data.mobile)}&limit=1`)
                    .then(response => response.json())
                    .then(problemData => {
                        if (problemData.success && problemData.data && problemData.data.data && problemData.data.data.length > 0) {
                            const problem = problemData.data.data[0];
                            if (nameInput && problem.name) {
                                nameInput.value = problem.name;
                                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        }
                    })
                    .catch(error => {
                        // Ignore errors, user can manually enter name
                    });
            }
        })
        .catch(error => {
            // Handle error silently, user can manually enter data
        });
}

// Initialize Abhipray Modal
function initializeAbhiprayModal() {
    // Close modal functionality
    const closeBtn = document.getElementById('close-abhipray-modal');
    const modal = document.getElementById('abhipray-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Submit abhipray
    const submitBtn = document.getElementById('submit-abhipray-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            submitAbhipray();
        });
    }
}

// Submit abhipray
function submitAbhipray() {
    const name = document.getElementById('abhipray-name').value;
    const mobile = document.getElementById('abhipray-mobile').value;
    const village = document.getElementById('abhipray-village').value;
    const abhipray = document.getElementById('abhipray-text').value;
    const submitBtn = document.getElementById('submit-abhipray-btn');
    
    // Validate required fields
    if (!name) {
        showErrorMessage('कृपया आपले नाव प्रविष्ट करा');
        return;
    }
    
    if (!mobile) {
        showErrorMessage('कृपया मोबाईल नंबर प्रविष्ट करा');
        return;
    }
    
    if (!village) {
        showErrorMessage('कृपया गाव निवडा');
        return;
    }
    
    if (!abhipray) {
        showErrorMessage('कृपया अभिप्राय लिहा');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> पाठवत आहे...';
    submitBtn.disabled = true;
    
    // Submit abhipray
    fetch('api/submit_abhipray.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            mobile: mobile,
            village: village,
            abhipray: abhipray
        })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        if (data.success) {
            showSuccessMessage(data.message || 'आपला अभिप्राय यशस्वीरित्या नोंदवला गेला आहे. धन्यवाद!');
            
            // Close modal first
            document.getElementById('abhipray-modal').style.display = 'none';
            
            // Reload page after a short delay to show updated state
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showErrorMessage('अभिप्राय पाठवताना त्रुटी आली: ' + data.message);
        }
    })
    .catch(error => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showErrorMessage('अभिप्राय पाठवताना त्रुटी आली');
    });
}

// Show View Abhipray Modal
function showViewAbhiprayModal() {
    const modal = document.getElementById('view-abhipray-modal');
    if (modal) {
        modal.style.display = 'flex';
        loadAbhiprayList();
        initializeViewAbhiprayModal();
    }
}

// Initialize View Abhipray Modal
function initializeViewAbhiprayModal() {
    // Close modal functionality
    const closeBtn = document.getElementById('close-view-abhipray-modal');
    const modal = document.getElementById('view-abhipray-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    

}

// Load abhipray list from API
function loadAbhiprayList() {
    const abhiprayList = document.getElementById('abhipray-list');
    
    // Show loading
    abhiprayList.innerHTML = `
        <div class="loading-abhipray">
            <i class="bi bi-hourglass-split"></i>
            <p>अभिप्राय लोड करत आहे...</p>
        </div>
    `;
    
    // Fetch all abhipray
    fetch('api/get_abhipray.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayAbhiprayList(data.data.abhipray);
            } else {
                showAbhiprayError(data.message || 'अभिप्राय लोड करताना त्रुटी आली');
            }
        })
        .catch(error => {
            showErrorMessage('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
        });
}

// Display abhipray list in modal
function displayAbhiprayList(abhiprayList) {
    const abhiprayListElement = document.getElementById('abhipray-list');
    
    if (abhiprayList.length === 0) {
        abhiprayListElement.innerHTML = `
            <div class="no-abhipray">
                <i class="bi bi-inbox"></i>
                <p>कोणत्याही अभिप्राय सापडले नाहीत</p>
            </div>
        `;
        return;
    }
    
    let abhiprayHTML = '';
    abhiprayList.forEach(abhipray => {
        const villageNames = {
            'shevgaon': 'शेवगाव',
            'adhodi': 'अधोडी',
            'akhatwade': 'अखटवाडे',
            'akhegaon_titarfa': 'अखेगाव तितरफा',
            'amrapur': 'अमरापूर',
            'antarwali_bk': 'अंतरवली बीके',
            'antarwali_khurd': 'अंतरवली खुर्द',
            'avhane_bk': 'अव्हाणे बीके',
            'avhane_kd': 'अव्हाणे केडी',
            'aapegaon': 'आपेगाव',
            'bhavinimgaon': 'भावी निंबगाव',
            'bodhegaon': 'बोधेगाव',
            'balamtakali': 'बलमटकली',
            'belgaon': 'बेळगाव',
            'baktarpur': 'बक्तरपूर',
            'bodkhe': 'बोडखे',
            'badgahavan': 'बडगहावन',
            'bhatkudgaon': 'भटकुडगाव',
            'bhagur': 'भगूर',
            'chapadgaon': 'चापडगाव',
            'chedechandga': 'चेडेचंदगा',
            'dadegaon': 'दडेगाव',
            'dahifal_new': 'दहिफळ नवे',
            'dahifal_old': 'दहिफळ जुने',
            'dahigaon_ne': 'दहिगाव ने',
            'dahigaon_she': 'दहिगाव शे',
            'deotakli': 'देवटकली',
            'dhorjagaon_she': 'धोरजगाव शे',
            'dhorjalgaon_ne': 'धोरजलगाव ने',
            'dhorsade': 'धोरसाडे',
            'divate': 'दिवटे',
            'dhumagad_tanda': 'धुमगड तांडा',
            'dhorhingani': 'धोरहिंगणी',
            'erandgaon': 'एरंडगाव',
            'gadewadi': 'गदेवाडी',
            'gaikwadjalgaon': 'गायकवाडजलगाव',
            'ghotan': 'घोटण',
            'golegaon': 'गोळेगाव',
            'garadwadi': 'गरडवाडी',
            'hasanapur': 'हसनापूर',
            'hatgaon': 'हटगाव',
            'hingangaon_ne': 'हिंगणगाव ने',
            'joharpur': 'जोहरपूर',
            'karhetakali': 'करहेटकली',
            'khadaka': 'खडका',
            'khamgaon': 'खामगाव',
            'khampimpri_new': 'खंपिंप्री नवे',
            'khampimpri_old': 'खंपिंप्री जुने',
            'khanapur': 'खानापूर',
            'kharadgaon': 'खरडगाव',
            'khuntephal': 'खुंटेफळ',
            'kol_gaon': 'कोळ गाव',
            'konoshi': 'कोनोशी',
            'kurudgaon': 'कुरुडगाव',
            'ladjalgaon': 'लडजलगाव',
            'lakhamapuri': 'लखमापुरी',
            'lolegaon': 'लोळेगाव',
            'lakhephal': 'लखेफळ',
            'maalegaon_ne': 'माळेगाव ने',
            'madake': 'माडके',
            'majaleshahar': 'मजळेशहर',
            'malegaon_she': 'माळेगाव शे',
            'mangrul_bk': 'मंगरुळ बीके',
            'mangrul_kd': 'मंगरुळ केडी',
            'mungi': 'मुंगी',
            'malkapur': 'मलकापूर',
            'nagalwadi_tanda': 'नगळवाडी तांडा',
            'nagalwadi': 'नगळवाडी',
            'najik_babhulgaon': 'नजीक बाभुळगाव',
            'nimbe': 'निंबे',
            'nandurvihire': 'नंदुरविहिरे',
            'pingewadi': 'पिंगेवाडी',
            'prabhuwadgaon': 'प्रभुवाडगाव',
            'ranegaon': 'रणेगाव',
            'ranjani': 'रणजणी',
            'rakshi': 'रक्षी',
            'salwadgaon': 'सळवाडगाव',
            'samangaon': 'समंगाव',
            'shahartkali': 'शहरटकली',
            'shekte_bk': 'शेकटे बीके',
            'shekte_kd': 'शेकटे केडी',
            'shingori': 'शिंगोरी',
            'sonesangavi': 'सोनेसंगवी',
            'sonvihir': 'सोनविहीर',
            'sukali': 'सुकळी',
            'sultanpur_bk': 'सुलतानपूर बीके',
            'sultanpur_kd': 'सुलतानपूर केडी',
            'shobhanagar': 'शोभनगर',
            'sevanagar': 'सेवानगर',
            'sule_pimpalgaon': 'सुळे पिंपळगाव',
            'sahapur': 'सहापूर',
            'sahajanpur': 'सहजनपूर',
            'tajnapur': 'ताजनापूर',
            'talni': 'तळणी',
            'thakurnimgaon': 'ठाकूर निंबगाव',
            'thakurpimpalgaon': 'ठाकूर पिंपळगाव',
            'thate': 'थाटे',
            'vijaipur': 'विजापूर',
            'wadgaon': 'वडगाव',
            'wadule_bk': 'वडुळे बीके',
            'wadule_kd': 'वडुळे केडी',
            'wagholi': 'वाघोळी',
            'warkhed': 'वरखेड',
            'warur_bk': 'वरूर बीके',
            'warur_kd': 'वरूर केडी',
            'other': 'इतर'
        };
        
        const villageName = villageNames[abhipray.village] || abhipray.village;
        const date = new Date(abhipray.created_at).toLocaleDateString('mr-IN');
        
        abhiprayHTML += `
            <div class="abhipray-item">
                <div class="abhipray-header">
                    <div class="abhipray-name">${abhipray.name}</div>
                    <div class="abhipray-date">${date}</div>
                </div>
                <div class="abhipray-content">
                    <div class="abhipray-info">
                        <div class="abhipray-mobile">${abhipray.mobile}</div>
                        <div class="abhipray-village">${villageName}</div>
                    </div>
                    <div class="abhipray-text">
                        ${abhipray.abhipray}
                    </div>
                </div>
            </div>
        `;
    });
    
    abhiprayListElement.innerHTML = abhiprayHTML;
}

// Show abhipray error
function showAbhiprayError(message) {
    const abhiprayList = document.getElementById('abhipray-list');
    abhiprayList.innerHTML = `
        <div class="abhipray-error">
            <i class="bi bi-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

