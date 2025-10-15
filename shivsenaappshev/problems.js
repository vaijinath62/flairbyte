// Problems Page JavaScript

// Pagination variables
let currentPage = 1;
let totalPages = 1;
let totalProblems = 0;
const problemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    loadProblemsFromSession();
});

// Go back to main page
function goBack() {
    window.location.href = 'index.php';
}

// Load problems from session
function loadProblemsFromSession() {
    // First get session data
    fetch('api/get_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(sessionData => {
        if (sessionData.success && sessionData.data && sessionData.data.isLoggedIn && sessionData.data.mobile) {
            // Load problems for logged-in user
            loadProblems(sessionData.data.mobile);
        } else {
            // No session or not logged in
            showProblemsError('कृपया प्रथम लॉगिन करा');
        }
    })
    .catch(error => {
        showProblemsError('सत्र तपासताना त्रुटी आली');
    });
}

// Load problems from API
function loadProblems(phone = null, page = 1) {
    currentPage = page;
    const problemsList = document.getElementById('problems-list');
    
    // Show loading
    problemsList.innerHTML = `
        <div class="loading-problems">
            <i class="bi bi-hourglass-split"></i>
            <p>समस्या लोड करत आहे...</p>
        </div>
    `;
    
    // Build API URL with pagination
    let apiUrl = `api/get_problems.php?page=${page}&limit=${problemsPerPage}`;
    if (phone) {
        apiUrl += `&phone=${encodeURIComponent(phone)}`;
    }
    
    // Fetch problems
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
    
            if (data.success) {
                // Handle the new API response structure with pagination
                const problems = (data.data && data.data.data) ? data.data.data : [];

                
                displayProblems(problems);
                
                // Get pagination info from response
                if (data.data && data.data.pagination) {
                    totalProblems = data.data.pagination.total_count;
                    totalPages = data.data.pagination.total_pages;
                    currentPage = data.data.pagination.current_page;
                } else {
                    // Fallback for backward compatibility
                    totalProblems = problems.length;
                    totalPages = 1;
                    currentPage = 1;
                }
                
                // Load total statistics separately (all problems, not just current page)
                loadTotalStatistics(phone);
                
                // Update pagination controls
                updatePagination();
            } else {
                showProblemsError(data.message || 'समस्या लोड करताना त्रुटी आली');
            }
        })
        .catch(error => {
            showProblemsError('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
        });
}

// Load total statistics (all problems, not just current page)
function loadTotalStatistics(phone = null) {
    // Build API URL to get all problems for statistics
    let apiUrl = 'api/get_problems.php?limit=1000'; // Get all problems
    if (phone) {
        apiUrl += `&phone=${encodeURIComponent(phone)}`;
    }
    
    // Fetch all problems for statistics
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle the new API response structure with pagination
                const allProblems = (data.data && data.data.data) ? data.data.data : [];
                updateStatistics(allProblems);
            } else {
                console.error('Error loading statistics:', data.message);
            }
        })
        .catch(error => {
            console.error('Error loading statistics:', error);
        });
}

// Display problems in the list
function displayProblems(problems) {
    const problemsList = document.getElementById('problems-list');
    
    // Debug logging

    
    // Ensure problems is an array
    if (!Array.isArray(problems)) {
        console.error('Problems is not an array:', problems);
        problems = [];
    }
    
    if (!problems || problems.length === 0) {
        problemsList.innerHTML = `
            <div class="no-problems">
                <i class="bi bi-inbox"></i>
                <h5>कोणतीही समस्या सापडली नाही</h5>
                <p>आपण अद्याप कोणतीही समस्या नोंदवली नाही</p>
            </div>
        `;
        return;
    }
    
    // Sort problems by creation date (newest first)
    problems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const problemsHTML = problems.map(problem => {

        const problemTypeLabels = {
            'road': 'रस्ते समस्या',
            'water': 'पाणी समस्या',
            'electricity': 'वीज समस्या',
            'sanitation': 'स्वच्छता समस्या',
            'other': 'इतर'
        };
        
        const statusLabels = {
            'pending': 'प्रलंबित',
            'in_progress': 'प्रगतीत',
            'resolved': 'सोडवले',
            'rejected': 'नाकारले'
        };
        
        // Create address header
        const addressHeader = `
            <div class="chat-address-header">
                <i class="bi bi-geo-alt"></i> ${problem.village ? problem.village + ' - ' : ''}${problem.address}
            </div>
        `;
        
        // Create chat messages
        const userMessage = `
            <div class="chat-message user">
                <div class="message-bubble user">
                    <div class="message-sender">${problem.name}</div>
                    <div class="message-content">
                        <strong>${problemTypeLabels[problem.problem_type]}</strong><br>
                        ${problem.description}
                    </div>
                </div>
            </div>
        `;
        
        // Add photo if exists
        const photoMessage = problem.photo_url ? `
            <div class="chat-message user">
                <div class="message-bubble user">
                    <div class="message-sender">${problem.name}</div>
                    <div class="message-content">
                        <img src="${problem.photo_url}" alt="Problem Photo" class="problem-photo" style="max-height: 150px; border-radius: 8px;">
                    </div>
                </div>
            </div>
        ` : '';
        
        // Admin reply based on status
        let adminReply = '';
        if (problem.status === 'pending') {
            adminReply = `
                <div class="chat-message admin">
                    <div class="message-bubble admin">
                        <div class="message-sender">Admin</div>
                        <div class="message-content">
                            आपली समस्या प्राप्त झाली आहे. आम्ही तिची तपासणी करत आहोत.
                        </div>
                    </div>
                </div>
            `;
        } else if (problem.status === 'in_progress') {
            adminReply = `
                <div class="chat-message admin">
                    <div class="message-bubble admin">
                        <div class="message-sender">Admin</div>
                        <div class="message-content">
                            आपल्या समस्येवर काम सुरू आहे. लवकरच तिचे निराकरण होईल.
                        </div>
                    </div>
                </div>
            `;
        } else if (problem.status === 'resolved') {
            adminReply = `
                <div class="chat-message admin">
                    <div class="message-bubble admin">
                        <div class="message-sender">Admin</div>
                        <div class="message-content">
                            ✅ आपली समस्या सोडवली गेली आहे. कृपया तपासून पहा.
                        </div>
                    </div>
                </div>
            `;
        } else if (problem.status === 'rejected') {
            adminReply = `
                <div class="chat-message admin">
                    <div class="message-bubble admin">
                        <div class="message-sender">Admin</div>
                        <div class="message-content">
                            ❌ आपली समस्या नाकारली गेली आहे. कृपया पुन्हा तपासून पहा.
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Display saved messages
        let savedMessagesHTML = '';
        if (problem.messages && problem.messages.length > 0) {
            savedMessagesHTML = problem.messages.map(msg => {
                let mediaHTML = '';
                if (msg.media_path && msg.media_type) {
                    if (msg.media_type === 'image') {
                        mediaHTML = `<div class="message-media"><img src="${msg.media_path}" alt="Uploaded Image"></div>`;
                    } else if (msg.media_type === 'video') {
                        mediaHTML = `<div class="message-media"><video controls><source src="${msg.media_path}" type="video/mp4"></video></div>`;
                    }
                }
                
                return `
                    <div class="chat-message ${msg.sender_type}">
                        <div class="message-bubble ${msg.sender_type}">
                            <div class="message-sender">${msg.sender_type === 'user' ? msg.sender : 'Admin'}</div>
                            <div class="message-content">${msg.message}${mediaHTML}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        return `
            <div class="problem-card">
                <div class="problem-header" onclick="toggleProblemCard(this)">
                    <div class="problem-header-left">
                        <span class="problem-type ${problem.problem_type}">${problemTypeLabels[problem.problem_type]}</span>
                        <span class="problem-status ${problem.status}">${statusLabels[problem.status]}</span>
                    </div>
                    <div class="problem-header-right">
                        <i class="bi bi-chevron-down problem-toggle-icon"></i>
                    </div>
                </div>
                
                <div class="problem-content">
                    <div class="chat-container">
                        ${addressHeader}
                        ${userMessage}
                        ${photoMessage}
                        ${adminReply}
                        ${savedMessagesHTML}
                    </div>
                    
                    <div class="chat-input-container${problem.status === 'resolved' ? ' disabled' : ''}">
                        <input type="text" class="chat-input" placeholder="संदेश टाका..." id="chat-input-${problem.id}"${problem.status === 'resolved' ? ' disabled' : ''}>
                        <button class="send-btn" onclick="sendMessage(${problem.id})"${problem.status === 'resolved' ? ' disabled' : ''}>
                            <i class="bi bi-send"></i>
                        </button>
                    </div>
                    
                    ${problem.status === 'resolved' ? `
                        <div class="rating-container" id="rating-container-${problem.id}">
                            ${problem.feedback ? `
                                <div class="rating-title">
                                    <i class="bi bi-check-circle"></i> आपला अभिप्राय पाठवला गेला
                                </div>
                                <div class="stars-container">
                                    ${Array(5).fill().map((_, i) => 
                                        `<span class="star ${i < problem.feedback.rating ? 'rated' : ''}">★</span>`
                                    ).join('')}
                                </div>
                                <div class="rating-text">${getRatingLabel(problem.feedback.rating)}</div>
                                ${problem.feedback.feedback ? `
                                    <div class="feedback-text">
                                        <strong>आपला अभिप्राय:</strong><br>
                                        ${problem.feedback.feedback}
                                    </div>
                                ` : ''}
                            ` : `
                                <div class="rating-title">आमच्या सेवेबद्दल आपला अभिप्राय द्या</div>
                                <div class="stars-container">
                                    <span class="star" data-rating="1" onclick="rateProblem(${problem.id}, 1)">★</span>
                                    <span class="star" data-rating="2" onclick="rateProblem(${problem.id}, 2)">★</span>
                                    <span class="star" data-rating="3" onclick="rateProblem(${problem.id}, 3)">★</span>
                                    <span class="star" data-rating="4" onclick="rateProblem(${problem.id}, 4)">★</span>
                                    <span class="star" data-rating="5" onclick="rateProblem(${problem.id}, 5)">★</span>
                                </div>
                                <div class="rating-text" id="rating-text-${problem.id}">तारे निवडा</div>
                                <textarea class="feedback-input" placeholder="आपला अतिरिक्त अभिप्राय लिहा (पर्यायी)" id="feedback-input-${problem.id}"></textarea>
                                <button class="submit-feedback-btn" onclick="submitFeedback(${problem.id})" id="submit-feedback-${problem.id}">
                                    अभिप्राय पाठवा
                                </button>
                            `}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    problemsList.innerHTML = problemsHTML;
    
    // Initialize all cards as collapsed
    initializeProblemCards();
    
    // Add enter key listeners for chat inputs
    addChatInputListeners();
}

// Update statistics
function updateStatistics(problems) {
    const total = problems.length;
    const pending = problems.filter(p => p.status === 'pending').length;
    const resolved = problems.filter(p => p.status === 'resolved').length;
    const inProgress = problems.filter(p => p.status === 'in_progress').length;
    
    document.getElementById('total-problems').textContent = total;
    document.getElementById('pending-problems').textContent = pending;
    document.getElementById('resolved-problems').textContent = resolved;
    document.getElementById('in-progress-problems').textContent = inProgress;
}

// Show problems error
function showProblemsError(message) {
    const problemsList = document.getElementById('problems-list');
    problemsList.innerHTML = `
        <div class="no-problems">
            <i class="bi bi-exclamation-triangle"></i>
            <h5>त्रुटी आली</h5>
            <p>${message}</p>
        </div>
    `;
}

// Initialize search functionality




// Toggle problem card expand/collapse
function toggleProblemCard(headerElement) {
    const card = headerElement.closest('.problem-card');
    const content = card.querySelector('.problem-content');
    const icon = headerElement.querySelector('.problem-toggle-icon');
    
    if (content.style.display === 'none' || content.style.display === '') {
        // Expand
        content.style.display = 'block';
        icon.className = 'bi bi-chevron-up problem-toggle-icon';
        card.classList.add('expanded');
    } else {
        // Collapse
        content.style.display = 'none';
        icon.className = 'bi bi-chevron-down problem-toggle-icon';
        card.classList.remove('expanded');
    }
}

// Initialize all problem cards as collapsed
function initializeProblemCards() {
    const cards = document.querySelectorAll('.problem-card');
    cards.forEach(card => {
        const content = card.querySelector('.problem-content');
        const icon = card.querySelector('.problem-toggle-icon');
        if (content) {
            content.style.display = 'none';
            icon.className = 'bi bi-chevron-down problem-toggle-icon';
        }
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'आज';
    } else if (diffDays === 2) {
        return 'काल';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} दिवसांपूर्वी`;
    } else {
        return date.toLocaleDateString('hi-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Add chat input listeners
function addChatInputListeners() {
    const chatInputs = document.querySelectorAll('.chat-input');
    chatInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const problemId = this.id.replace('chat-input-', '');
                sendMessage(problemId);
            }
        });
    });
}

// Send message function
function sendMessage(problemId) {
    const input = document.getElementById(`chat-input-${problemId}`);
    const message = input.value.trim();
    
    if (!message) return;
    
    // Check if input is disabled (problem is resolved)
    if (input.disabled) {
        alert('ही समस्या सोडवली गेली आहे. आता संदेश पाठवू शकत नाही.');
        return;
    }
    
    // Get current user info from session
    fetch('api/get_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(sessionData => {
        if (sessionData.success && sessionData.data && sessionData.data.isLoggedIn) {
            // Send message to server
            fetch('api/send_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    problemId: problemId,
                    message: message,
                    sender: sessionData.data.mobile,
                    senderType: 'user'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add message to chat
                    addMessageToChat(problemId, message, sessionData.data.mobile, 'user');
                    
                    // Clear input
                    input.value = '';
                } else {
                    alert('संदेश पाठवताना त्रुटी आली: ' + data.message);
                }
            })
            .catch(error => {
                alert('संदेश पाठवताना त्रुटी आली');
            });
        } else {
            alert('कृपया प्रथम लॉगिन करा');
        }
    })
    .catch(error => {
        alert('संदेश पाठवताना त्रुटी आली');
    });
}

// Add message to chat
function addMessageToChat(problemId, message, sender, type, mediaPath = null, mediaType = null) {
    const chatContainer = document.querySelector(`#chat-input-${problemId}`).closest('.problem-content').querySelector('.chat-container');
    
    let mediaHTML = '';
    if (mediaPath && mediaType) {
        if (mediaType === 'image') {
            mediaHTML = `<div class="message-media"><img src="${mediaPath}" alt="Uploaded Image"></div>`;
        } else if (mediaType === 'video') {
            mediaHTML = `<div class="message-media"><video controls><source src="${mediaPath}" type="video/mp4"></video></div>`;
        }
    }
    
    const messageHTML = `
        <div class="chat-message ${type}">
            <div class="message-bubble ${type}">
                <div class="message-sender">${type === 'user' ? sender : 'Admin'}</div>
                <div class="message-content">${message}${mediaHTML}</div>
            </div>
        </div>
    `;
    
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add 3D effects to cards
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to problem cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.problem-card')) {
            const card = e.target.closest('.problem-card');
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.problem-card')) {
            const card = e.target.closest('.problem-card');
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .back-btn-header, .send-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
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
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Pagination functions
function updatePagination() {
    const paginationContainer = document.getElementById('pagination-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumbers = document.getElementById('page-numbers');
    const paginationInfo = document.getElementById('pagination-info');
    
    // Show/hide pagination container
    if (totalPages > 1) {
        paginationContainer.style.display = 'flex';
    } else {
        paginationContainer.style.display = 'none';
        return;
    }
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    // Update page numbers
    pageNumbers.innerHTML = '';
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        pageNumbers.appendChild(pageBtn);
    }
    
    // Update pagination info
    const startRecord = (currentPage - 1) * problemsPerPage + 1;
    const endRecord = Math.min(currentPage * problemsPerPage, totalProblems);
    paginationInfo.textContent = `${startRecord}-${endRecord} / ${totalProblems}`;
}

function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) {
        return;
    }
    
    // Get current user's phone from session
    fetch('api/get_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(sessionData => {
        if (sessionData.success && sessionData.data && sessionData.data.isLoggedIn && sessionData.data.mobile) {
            loadProblems(sessionData.data.mobile, page);
        } else {
            showProblemsError('कृपया प्रथम लॉगिन करा');
        }
    })
    .catch(error => {
        showProblemsError('पृष्ठ बदलताना त्रुटी आली');
    });
} 

// Rating and Feedback Functions
function getRatingLabel(rating) {
    const ratingLabels = {
        1: 'खूप खराब',
        2: 'खराब',
        3: 'सामान्य',
        4: 'चांगले',
        5: 'खूप चांगले'
    };
    return ratingLabels[rating] || 'अज्ञात';
}

function rateProblem(problemId, rating) {
    const stars = document.querySelectorAll(`#rating-container-${problemId} .star`);
    const ratingText = document.getElementById(`rating-text-${problemId}`);
    
    // Update star display
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active', 'rated');
        } else {
            star.classList.remove('active', 'rated');
        }
    });
    
    // Update rating text
    const ratingLabels = {
        1: 'खूप खराब',
        2: 'खराब',
        3: 'सामान्य',
        4: 'चांगले',
        5: 'खूप चांगले'
    };
    
    ratingText.textContent = ratingLabels[rating];
    
    // Store rating for submission
    window.currentRating = rating;
}

function submitFeedback(problemId) {
    const rating = window.currentRating;
    const feedback = document.getElementById(`feedback-input-${problemId}`).value.trim();
    
    if (!rating) {
        alert('कृपया तारे निवडा');
        return;
    }
    
    // Get current user info from session
    fetch('api/get_session.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(sessionData => {
        if (sessionData.success && sessionData.data && sessionData.data.isLoggedIn) {
            // Submit feedback to server
            fetch('api/submit_feedback.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    problemId: problemId,
                    rating: rating,
                    feedback: feedback,
                    userMobile: sessionData.data.mobile
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success state
                    const container = document.getElementById(`rating-container-${problemId}`);
                    container.classList.add('feedback-submitted');
                    container.innerHTML = `
                        <div class="rating-title">
                            <i class="bi bi-check-circle"></i> आपला अभिप्राय पाठवला गेला
                        </div>
                        <div class="rating-text">धन्यवाद!</div>
                    `;
                } else {
                    alert('अभिप्राय पाठवताना त्रुटी आली: ' + data.message);
                }
            })
            .catch(error => {
                alert('अभिप्राय पाठवताना त्रुटी आली');
            });
        } else {
            alert('कृपया प्रथम लॉगिन करा');
        }
    })
    .catch(error => {
        alert('अभिप्राय पाठवताना त्रुटी आली');
    });
} 