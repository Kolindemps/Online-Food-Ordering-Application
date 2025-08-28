// Food Ordering Dashboard with AJAX and Interactive Features
class FoodOrderingDashboard {
    constructor() {
        this.cart = [];
        this.menuItems = [];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.isLoading = false;
        this.init();
    }

    init() {
        // Protect this page - require authentication
        if (!this.requireAuth()) {
            return;
        }

        this.displayUserInfo();
        this.setupEventListeners();
        this.loadMenuItems();
    }

    requireAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (!savedUser) {
            window.location.href = 'login.html';
            return false;
        }
        // Show the page only if authenticated
        document.body.style.display = 'block';
        return true;
    }

    displayUserInfo() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const welcomeUser = document.getElementById('welcomeUser');
            welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
        }
    }

    setupEventListeners() {
        // Category tabs
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchCategory(e.currentTarget.dataset.category);
            });
        });

        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');

        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.remove('translate-x-full');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.add('translate-x-full');
        });

        // Logout functionality - use direct event binding
        document.addEventListener('click', (e) => {
            if (e.target && (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn'))) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Logout button clicked via delegation');
                this.handleLogout();
            }
        });

        // Checkout
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.addEventListener('click', () => {
            this.openCheckoutModal();
        });

        // Search functionality
        const menuSearch = document.getElementById('menuSearch');
        const clearSearch = document.getElementById('clearSearch');
        
        menuSearch.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
            // Show/hide clear button
            if (e.target.value.trim()) {
                clearSearch.classList.remove('hidden');
            } else {
                clearSearch.classList.add('hidden');
            }
        });
        
        clearSearch.addEventListener('click', () => {
            menuSearch.value = '';
            clearSearch.classList.add('hidden');
            this.handleSearch('');
        });

        // Checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        checkoutForm.addEventListener('submit', (e) => {
            this.handleCheckout(e);
        });

        // Modal close buttons
        const closeCheckout = document.getElementById('closeCheckout');
        closeCheckout.addEventListener('click', () => {
            this.closeCheckoutModal();
        });

        // Click outside modal to close
        const checkoutModal = document.getElementById('checkoutModal');
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                this.closeCheckoutModal();
            }
        });
    }

    // AJAX call to load menu items
    async loadMenuItems() {
        this.setLoadingState(true);
        
        try {
            // Simulate API call - in real app, this would be an actual AJAX request
            const response = await this.simulateMenuAPI();
            this.menuItems = response.data;
            this.renderMenuItems();
            this.showToast('Menu loaded successfully!', 'success');
        } catch (error) {
            this.showToast('Failed to load menu items', 'error');
            console.error('Error loading menu:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    // Simulate AJAX API call
    simulateMenuAPI() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        // Appetizers
                        {
                            id: 1,
                            name: 'Crispy Calamari',
                            category: 'appetizers',
                            price: 12.99,
                            image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=300&h=200&fit=crop',
                            description: 'Lightly breaded and fried calamari rings with marinara sauce',
                            rating: 4.7,
                            prepTime: '10-15 min'
                        },
                        {
                            id: 2,
                            name: 'Fresh Oysters',
                            category: 'appetizers',
                            price: 18.99,
                            image: 'https://images.unsplash.com/photo-1559742811-822873691375?w=300&h=200&fit=crop',
                            description: 'Half dozen fresh oysters on the half shell with mignonette',
                            rating: 4.9,
                            prepTime: '5-10 min'
                        },
                        {
                            id: 3,
                            name: 'Shrimp Cocktail',
                            category: 'appetizers',
                            price: 14.99,
                            image: 'https://images.unsplash.com/photo-1599847142252-882a42b0a2a2?w=300&h=200&fit=crop',
                            description: 'Chilled jumbo shrimp with zesty cocktail sauce',
                            rating: 4.6,
                            prepTime: '5 min'
                        },
                        {
                            id: 4,
                            name: 'Crab Cakes',
                            category: 'appetizers',
                            price: 16.99,
                            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
                            description: 'Pan-seared crab cakes with remoulade sauce',
                            rating: 4.8,
                            prepTime: '12-15 min'
                        },
                        
                        // Main Courses
                        {
                            id: 5,
                            name: 'Grilled Atlantic Salmon',
                            category: 'main',
                            price: 24.99,
                            image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
                            description: 'Fresh Atlantic salmon with lemon herb butter and asparagus',
                            rating: 4.8,
                            prepTime: '15-20 min'
                        },
                        {
                            id: 6,
                            name: 'Lobster Tail',
                            category: 'main',
                            price: 35.99,
                            image: 'https://images.unsplash.com/photo-1625944228741-cf3b9b2a42d7?w=300&h=200&fit=crop',
                            description: 'Broiled lobster tail with drawn butter and lemon',
                            rating: 4.9,
                            prepTime: '20-25 min'
                        },
                        {
                            id: 7,
                            name: 'Fish and Chips',
                            category: 'main',
                            price: 17.99,
                            image: 'https://images.unsplash.com/photo-1598679253544-2c97a0f31dfc?w=300&h=200&fit=crop',
                            description: 'Beer-battered cod with thick-cut fries and tartar sauce',
                            rating: 4.5,
                            prepTime: '15-20 min'
                        },
                        {
                            id: 8,
                            name: 'Seafood Paella',
                            category: 'main',
                            price: 28.99,
                            image: 'https://images.unsplash.com/photo-1598515214211-89d3c7373051?w=300&h=200&fit=crop',
                            description: 'Saffron rice with shrimp, mussels, clams, and chorizo',
                            rating: 4.7,
                            prepTime: '25-30 min'
                        },
                        {
                            id: 9,
                            name: 'Pan-Seared Halibut',
                            category: 'main',
                            price: 26.99,
                            image: 'https://images.unsplash.com/photo-1504544759239-971add69a5a4?w=300&h=200&fit=crop',
                            description: 'Fresh halibut with roasted vegetables and herb butter',
                            rating: 4.6,
                            prepTime: '18-22 min'
                        },
                        
                        // From the Grill
                        {
                            id: 10,
                            name: 'Grilled Swordfish',
                            category: 'grill',
                            price: 26.99,
                            image: 'https://images.unsplash.com/photo-1504544759239-971add69a5a4?w=300&h=200&fit=crop',
                            description: 'Thick-cut swordfish steak with Mediterranean marinade',
                            rating: 4.6,
                            prepTime: '15-20 min'
                        },
                        {
                            id: 11,
                            name: 'Seared Tuna Steak',
                            category: 'grill',
                            price: 29.99,
                            image: 'https://images.unsplash.com/photo-1626202157923-23e5a5f1b8f8?w=300&h=200&fit=crop',
                            description: 'Sesame-crusted ahi tuna, seared rare with wasabi',
                            rating: 4.8,
                            prepTime: '10-15 min'
                        },
                        {
                            id: 12,
                            name: 'Grilled Octopus',
                            category: 'grill',
                            price: 22.99,
                            image: 'https://images.unsplash.com/photo-1598509731333-272a6b23c586?w=300&h=200&fit=crop',
                            description: 'Tender grilled octopus with olive oil, lemon, and herbs',
                            rating: 4.7,
                            prepTime: '20-25 min'
                        },
                        {
                            id: 13,
                            name: 'Grilled Shrimp Skewers',
                            category: 'grill',
                            price: 19.99,
                            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
                            description: 'Marinated shrimp skewers with bell peppers and onions',
                            rating: 4.5,
                            prepTime: '12-15 min'
                        },
                        
                        // Sides
                        {
                            id: 14,
                            name: 'Garlic Parmesan Fries',
                            category: 'sides',
                            price: 6.99,
                            image: 'https://images.unsplash.com/photo-1598679253544-2c97a0f31dfc?w=300&h=200&fit=crop',
                            description: 'Crispy fries tossed with garlic, parmesan, and parsley',
                            rating: 4.5,
                            prepTime: '10 min'
                        },
                        {
                            id: 15,
                            name: 'House Salad',
                            category: 'sides',
                            price: 5.99,
                            image: 'https://images.unsplash.com/photo-1505253716362-afb74b626351?w=300&h=200&fit=crop',
                            description: 'Mixed greens, cherry tomatoes, cucumber with light vinaigrette',
                            rating: 4.3,
                            prepTime: '5 min'
                        },
                        {
                            id: 16,
                            name: 'Rice Pilaf',
                            category: 'sides',
                            price: 4.99,
                            image: 'https://images.unsplash.com/photo-1599233261138-23a5b3152641?w=300&h=200&fit=crop',
                            description: 'Fluffy rice pilaf with herbs and vegetables',
                            rating: 4.4,
                            prepTime: '15 min'
                        },
                        {
                            id: 17,
                            name: 'Grilled Asparagus',
                            category: 'sides',
                            price: 7.99,
                            image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&h=200&fit=crop',
                            description: 'Fresh asparagus spears grilled with olive oil and sea salt',
                            rating: 4.6,
                            prepTime: '8-10 min'
                        },
                        
                        // Drinks
                        {
                            id: 18,
                            name: 'Fresh Lemonade',
                            category: 'drinks',
                            price: 3.49,
                            image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=200&fit=crop',
                            description: 'Freshly squeezed lemons with mint',
                            rating: 4.2,
                            prepTime: '3 min'
                        },
                        {
                            id: 19,
                            name: 'Iced Tea',
                            category: 'drinks',
                            price: 2.99,
                            image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=300&h=200&fit=crop',
                            description: 'Freshly brewed black tea, served chilled',
                            rating: 4.1,
                            prepTime: '2 min'
                        },
                        {
                            id: 20,
                            name: 'Sparkling Water',
                            category: 'drinks',
                            price: 3.99,
                            image: 'https://images.unsplash.com/photo-1605920280993-99619c6ae7a6?w=300&h=200&fit=crop',
                            description: 'Chilled sparkling mineral water with lime',
                            rating: 4.0,
                            prepTime: '1 min'
                        },
                        {
                            id: 21,
                            name: 'White Wine',
                            category: 'drinks',
                            price: 8.99,
                            image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=200&fit=crop',
                            description: 'Crisp Sauvignon Blanc, perfect with seafood',
                            rating: 4.5,
                            prepTime: '2 min'
                        },
                        {
                            id: 22,
                            name: 'Craft Beer',
                            category: 'drinks',
                            price: 5.99,
                            image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop',
                            description: 'Local craft beer selection',
                            rating: 4.3,
                            prepTime: '1 min'
                        }
                    ]
                });
            }, 1500); // Simulate network delay
        });
    }

    setLoadingState(isLoading) {
        const menuLoader = document.getElementById('menuLoader');
        const menuGrid = document.getElementById('menuGrid');

        if (isLoading) {
            menuLoader.classList.remove('hidden');
            menuGrid.classList.add('hidden');
        } else {
            menuLoader.classList.add('hidden');
            menuGrid.classList.remove('hidden');
        }
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.remove('bg-gray-200', 'text-gray-700');
                tab.classList.add('bg-teal-500', 'text-white');
            } else {
                tab.classList.remove('bg-teal-500', 'text-white');
                tab.classList.add('bg-gray-200', 'text-gray-700');
            }
        });

        this.renderMenuItems();
    }

    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase().trim();
        this.renderMenuItems();
    }

    renderMenuItems() {
        const menuGrid = document.getElementById('menuGrid');
        let filteredItems = this.currentCategory === 'all' 
            ? this.menuItems 
            : this.menuItems.filter(item => item.category === this.currentCategory);

        // Apply search filter
        if (this.searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(this.searchTerm) ||
                item.description.toLowerCase().includes(this.searchTerm) ||
                item.category.toLowerCase().includes(this.searchTerm)
            );
        }

        menuGrid.innerHTML = filteredItems.map(item => `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div class="relative">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-sm font-semibold text-teal-500">
                        <i class="fas fa-star text-yellow-400"></i> ${item.rating}
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${item.description}</p>
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-teal-500">$${item.price}</span>
                        <span class="text-sm text-gray-500">
                            <i class="fas fa-clock mr-1"></i>${item.prepTime}
                        </span>
                    </div>
                    <button onclick="dashboard.addToCart(${item.id})" 
                        class="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition duration-200 transform hover:scale-105">
                        <i class="fas fa-plus mr-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(itemId) {
        const item = this.menuItems.find(item => item.id === itemId);
        if (!item) return;

        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }

        this.updateCartUI();
        this.showToast(`${item.name} added to cart!`, 'success');
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCartUI();
        this.showToast('Item removed from cart', 'info');
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(itemId);
        } else {
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const checkoutBtn = document.getElementById('checkoutBtn');

        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items
        if (this.cart.length === 0) {
            cartItems.classList.add('hidden');
            emptyCart.classList.remove('hidden');
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            checkoutBtn.classList.remove('bg-gradient-to-r', 'from-teal-500', 'to-blue-500', 'text-white');
        } else {
            cartItems.classList.remove('hidden');
            emptyCart.classList.add('hidden');
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            checkoutBtn.classList.add('bg-gradient-to-r', 'from-teal-500', 'to-blue-500', 'text-white');

            cartItems.innerHTML = this.cart.map(item => `
                <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <p class="text-teal-500 font-bold">$${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="dashboard.updateQuantity(${item.id}, -1)" 
                            class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="w-8 text-center font-semibold">${item.quantity}</span>
                        <button onclick="dashboard.updateQuantity(${item.id}, 1)" 
                            class="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <button onclick="dashboard.removeFromCart(${item.id})" 
                        class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        this.updateCartSummary();
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 2.99 : 0;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + deliveryFee + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    openCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        const checkoutSummary = document.getElementById('checkoutSummary');

        // Populate checkout summary
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 2.99;
        const tax = subtotal * 0.08;
        const total = subtotal + deliveryFee + tax;

        checkoutSummary.innerHTML = `
            <div class="space-y-2">
                ${this.cart.map(item => `
                    <div class="flex justify-between text-sm">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                <hr class="my-2">
                <div class="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>Delivery Fee:</span>
                    <span>$${deliveryFee.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
        `;

        checkoutModal.classList.remove('hidden');
    }

    closeCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        checkoutModal.classList.add('hidden');
    }

    async handleCheckout(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const orderData = {
            customer: {
                name: formData.get('customerName') || document.getElementById('customerName').value,
                phone: formData.get('customerPhone') || document.getElementById('customerPhone').value,
                email: formData.get('customerEmail') || document.getElementById('customerEmail').value,
                address: formData.get('deliveryAddress') || document.getElementById('deliveryAddress').value
            },
            payment: formData.get('payment'),
            items: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2.99 + (this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08)
        };

        try {
            // Simulate AJAX order submission
            await this.submitOrder(orderData);
            this.showOrderConfirmation();
        } catch (error) {
            this.showToast('Failed to place order. Please try again.', 'error');
        }
    }

    // Simulate AJAX order submission
    submitOrder(orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Order submitted:', orderData);
                resolve({ orderId: Math.floor(Math.random() * 10000) });
            }, 2000);
        });
    }

    showOrderConfirmation() {
        const confirmationModal = document.getElementById('confirmationModal');
        const orderNumber = document.getElementById('orderNumber');
        
        orderNumber.textContent = `#${Math.floor(Math.random() * 10000)}`;
        
        this.closeCheckoutModal();
        confirmationModal.classList.remove('hidden');
        
        // Save order to localStorage
        this.saveOrder();
        
        // Clear cart
        this.cart = [];
        this.updateCartUI();
    }

    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear user session
            localStorage.removeItem('currentUser');
            
            // Show logout toast
            this.showToast('Logged out successfully!', 'info');
            
            // Redirect to login page after short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const bgColor = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        }[type] || 'bg-gray-500';

        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new FoodOrderingDashboard();
});
