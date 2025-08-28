// Main page functionality with scroll navigation
class MainPageHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollNavigation();
    }

    setupEventListeners() {
        // Order Now buttons
        const orderNowButtons = document.querySelectorAll('.order-now-btn');
        const navOrderBtn = document.getElementById('navOrderBtn');

        orderNowButtons.forEach(button => {
            button.addEventListener('click', () => this.handleOrderNowClick());
        });

        if (navOrderBtn) {
            navOrderBtn.addEventListener('click', () => this.handleOrderNowClick());
        }
    }

    setupScrollNavigation() {
        const navbar = document.getElementById('navbar');
        const navTitle = document.getElementById('navTitle');
        const navLinks = [
            document.getElementById('navLink1'),
            document.getElementById('navLink2'),
            document.getElementById('navLink3')
        ];
        const navOrderBtn = document.getElementById('navOrderBtn');

        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            
            if (scrolled) {
                // Scrolled state - solid white background
                navbar.classList.remove('bg-transparent');
                navbar.classList.add('bg-white', 'shadow-lg');
                
                // Change text colors to dark
                if (navTitle) {
                    navTitle.classList.remove('text-white');
                    navTitle.classList.add('text-gray-800');
                }
                
                navLinks.forEach(link => {
                    if (link) {
                        link.classList.remove('text-white', 'hover:text-teal-300');
                        link.classList.add('text-gray-700', 'hover:text-teal-500');
                    }
                });
                
                // Update order button styles
                if (navOrderBtn) {
                    navOrderBtn.classList.remove('text-white', 'hover:text-teal-300', 'border-white', 'hover:bg-white', 'hover:text-teal-500');
                    navOrderBtn.classList.add('text-teal-500', 'hover:text-teal-600', 'border-teal-500', 'hover:bg-teal-50');
                }
                
            } else {
                // Top state - transparent background
                navbar.classList.remove('bg-white', 'shadow-lg');
                navbar.classList.add('bg-transparent');
                
                // Change text colors to white
                if (navTitle) {
                    navTitle.classList.remove('text-gray-800');
                    navTitle.classList.add('text-white');
                }
                
                navLinks.forEach(link => {
                    if (link) {
                        link.classList.remove('text-gray-700', 'hover:text-teal-500');
                        link.classList.add('text-white', 'hover:text-teal-300');
                    }
                });
                
                // Update order button styles
                if (navOrderBtn) {
                    navOrderBtn.classList.remove('text-teal-500', 'hover:text-teal-600', 'border-teal-500', 'hover:bg-teal-50');
                    navOrderBtn.classList.add('text-white', 'hover:text-teal-300', 'border-white', 'hover:bg-white', 'hover:text-teal-500');
                }
            }
        });
    }

    handleOrderNowClick() {
        const isAuthenticated = Boolean(localStorage.getItem('currentUser'));
        if (isAuthenticated) {
            location.href = 'dashboard.html';
        } else {
            location.href = 'login.html';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MainPageHandler();
});