// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const mobileInput = document.getElementById('mobileNumber');
    const passwordField = document.getElementById('passwordField');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    let isAdminUser = false;
    let currentMobile = '';

    // Initialize form
    initializeForm();

    // Form submission
    loginForm.addEventListener('submit', handleLogin);

    // Initialize PWA functionality


    // Mobile number input validation
    mobileInput.addEventListener('input', function() {
        // Only allow numbers
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Hide messages when user types
        hideMessages();
        
        // Reset form state when mobile changes
        if (this.value !== currentMobile) {
            resetFormState();
        }
        
        // Auto-check when 10 digits are entered
        if (this.value.length === 10) {
            checkMobileExists(this.value);
        }
    });

    // Password input
    passwordInput.addEventListener('input', function() {
        hideMessages();
    });

    function initializeForm() {
        // Add ripple effect to button
        loginBtn.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });

        // Add input focus effects
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    function handleLogin(e) {
        e.preventDefault();
        
        const mobile = mobileInput.value.trim();
        
        if (!mobile) {
            showError('कृपया मोबाईल नंबर टाका');
            return;
        }

        if (mobile.length !== 10) {
            showError('कृपया योग्य मोबाईल नंबर टाका');
            return;
        }

        // If password field is visible, handle admin login
        if (passwordField.style.display === 'block') {
            handleAdminLogin(mobile);
        } else {
            // If mobile is already checked and password field is not visible, proceed as citizen
            if (currentMobile === mobile && !isAdminUser) {
                proceedAsCitizen(mobile);
            } else {
                // Check if mobile exists in admin_users
                checkMobileExists(mobile);
            }
        }
    }

    function checkMobileExists(mobile) {

        showLoading(true);
        hideMessages();

        fetch('api/check_mobile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile: mobile })
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
    
            
            if (data.success) {
                if (data.data && data.data.isAdmin) {
                    // Show password field for admin
                    showPasswordField();
                    isAdminUser = true;
                    currentMobile = mobile;
                    showSuccess('कृपया पासवर्ड टाका');
                } else {
                    // Store citizen info but don't proceed automatically
                    currentMobile = mobile;
                    isAdminUser = false;
                    showSuccess('मोबाईल नंबर तपासला गेला. पुढे जाण्यासाठी बटण दाबा.');
                }
            } else {
                showError(data.message || 'काहीतरी चूक झाले');
            }
        })
        .catch(error => {
            showLoading(false);
            showError('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
        });
    }

    function handleAdminLogin(mobile) {
        const password = passwordInput.value.trim();
        
        if (!password) {
            showError('कृपया पासवर्ड टाका');
            return;
        }

        showLoading(true);
        hideMessages();

        fetch('api/admin_login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                mobile: mobile,
                password: password 
            })
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            
            if (data.success) {
                showSuccess('लॉगिन यशस्वी! पुढे जात आहे...');
                setTimeout(() => {
                    window.location.href = 'admin/dashboard.php';
                }, 1500);
            } else {
                showError(data.message || 'चुकीचा पासवर्ड');
            }
        })
        .catch(error => {
            showLoading(false);
            showError('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
        });
    }

    function proceedAsCitizen(mobile) {
        showLoading(true);
        hideMessages();

        fetch('api/citizen_login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mobile: mobile })
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            
            if (data.success) {
                showSuccess('लॉगिन यशस्वी! पुढे जात आहे...');
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 1500);
            } else {
                showError(data.message || 'काहीतरी चूक झाले');
            }
        })
        .catch(error => {
            showLoading(false);
            showError('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
        });
    }

    function showPasswordField() {
        passwordField.style.display = 'block';
        passwordInput.setAttribute('required', 'required');
        passwordInput.focus();
        btnText.textContent = 'लॉगिन करा';
    }

    function resetFormState() {
        passwordField.style.display = 'none';
        passwordInput.value = '';
        passwordInput.removeAttribute('required');
        btnText.textContent = 'पुढे जा';
        isAdminUser = false;
        currentMobile = '';
        hideMessages();
    }

    function showLoading(show) {
        if (show) {
            loadingSpinner.style.display = 'block';
            loginBtn.disabled = true;
        } else {
            loadingSpinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    // Create ripple effect
    function createRippleEffect(element, event) {
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
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }




}); 