// Authentication System with Form Validation
class AuthSystem {
    constructor() {
        this.users = [
            { email: 'customer@foodie.com', password: 'customer123', name: 'John Doe', role: 'customer' },
            { email: 'admin@foodie.com', password: 'admin123', name: 'Admin User', role: 'admin' }
        ];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    checkExistingSession() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            // If on login page and already logged in, redirect to dashboard
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // If on dashboard and not logged in, redirect to login
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
        }
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button is handled by dashboard.js on dashboard page
        // Only handle logout on login page if needed
        if (!window.location.pathname.includes('dashboard.html')) {
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }
        }

        // Real-time validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
            emailInput.addEventListener('input', () => this.clearFieldError('email'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePassword());
            passwordInput.addEventListener('input', () => this.clearFieldError('password'));
        }
    }

    setupFormValidation() {
        // Add visual feedback for form fields
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(input.id, this.getValidationMessage(input));
            });
        });
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showFieldError('email', 'Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            return false;
        }

        this.clearFieldError('email');
        return true;
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        if (!password) {
            this.showFieldError('password', 'Password is required');
            return false;
        }

        if (password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            return false;
        }

        this.clearFieldError('password');
        return true;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        field.classList.remove('border-gray-300', 'focus:ring-orange-500', 'focus:border-orange-500');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        field.classList.add('border-gray-300', 'focus:ring-orange-500', 'focus:border-orange-500');

        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    getValidationMessage(input) {
        if (input.validity.valueMissing) {
            return `${input.labels[0].textContent} is required`;
        }
        if (input.validity.typeMismatch) {
            return `Please enter a valid ${input.type}`;
        }
        return 'Please check this field';
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Clear previous messages
        this.hideMessage();

        // Validate form
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate API call with delay
            await this.simulateAPICall();

            // Check credentials
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Successful login
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Show success alert
                alert('Login successful! Welcome ' + user.name + '!');
                
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('Invalid email or password. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage('Login failed. Please try again later.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    simulateAPICall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000); // Simulate 1 second API call
        });
    }

    setLoadingState(isLoading) {
        const loginBtn = document.getElementById('loginBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const loginSpinner = document.getElementById('loginSpinner');

        if (isLoading) {
            loginBtn.disabled = true;
            loginBtn.classList.add('opacity-75', 'cursor-not-allowed');
            loginBtnText.textContent = 'Signing In...';
            loginSpinner.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            loginBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            loginBtnText.textContent = 'Sign In';
            loginSpinner.classList.add('hidden');
        }
    }

    showMessage(message, type) {
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const errorText = document.getElementById('errorText');
        const successText = document.getElementById('successText');

        if (type === 'error') {
            errorText.textContent = message;
            errorMessage.classList.remove('hidden');
            successMessage.classList.add('hidden');
        } else {
            successText.textContent = message;
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    hideMessage() {
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        if (errorMessage) errorMessage.classList.add('hidden');
        if (successMessage) successMessage.classList.add('hidden');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
}

// Utility function to protect pages that require authentication
function requireAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
