// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count in navigation
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = count;
        });
    }
    
    // Update cart display
    function updateCartDisplay() {
        const cartItemsEl = document.getElementById('cart-items');
        const totalAmountEl = document.getElementById('total-amount');
        
        if (cartItemsEl) {
            cartItemsEl.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsEl.innerHTML = '<p>Your cart is empty</p>';
            } else {
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <span>${item.name} (${item.quantity})</span>
                        <span>$${itemTotal.toFixed(2)}</span>
                        <span class="remove-item" data-id="${item.id}">×</span>
                    `;
                    cartItemsEl.appendChild(itemEl);
                });
                
                totalAmountEl.textContent = total.toFixed(2);
            }
        }
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartDisplay();
            
            // Show confirmation
            alert(`${name} added to cart!`);
        });
    });
    
    // Remove item from cart
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCartDisplay();
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                alert('Proceeding to checkout!');
                // In a real app, you would redirect to a checkout page
            }
        });
    }
    
    // Initialize cart display on page load
    updateCartCount();
    updateCartDisplay();
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }
});