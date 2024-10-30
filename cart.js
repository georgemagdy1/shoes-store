// Cart functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageElement = notification.querySelector('.notification-message');
    
    messageElement.textContent = message;
    notification.classList.add('show');
    notification.style.backgroundColor = type === 'error' ? '#ffe6e6' : '#e6ffe6';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Close notification
document.querySelector('.notification-close').addEventListener('click', () => {
    document.getElementById('notification').classList.remove('show');
});

// Update cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartContent = document.querySelector('.cart-content');

    if (cartItems.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyCartMessage.style.display = 'none';
    cartContent.style.display = 'grid';
    
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p>Price: $${item.price}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                    onchange="updateQuantityDirect(${index}, this.value)">
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">&times;</button>
        </div>
    `).join('');

    updateSummary();
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cartItems.length;
}

// Update quantity
function updateQuantity(index, change) {
    const newQuantity = cartItems[index].quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
        cartItems[index].quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }
}

// Update quantity directly
function updateQuantityDirect(index, value) {
    const quantity = parseInt(value);
    if (quantity >= 1 && quantity <= 10) {
        cartItems[index].quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }
}

// Remove item from cart
function removeItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
    showNotification('Item removed from cart');
}

// Update order summary
function updateSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Handle checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    // Redirect to checkout page or show checkout modal
    window.location.href = 'checkout.html';
});

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

// Update product-detail.js addToCart function
function addToCart() {
    const selectedSize = document.querySelector('.size-btn.selected');
    if (!selectedSize) {
        showNotification('Please select a size before adding to cart', 'error');
        // Highlight size selector
        document.querySelector('.size-selector').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.querySelector('.size-selector').style.animation = '';
        }, 500);
        return;
    }

    const product = getCurrentProduct();
    const quantity = parseInt(document.getElementById('quantity').value);
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize.textContent,
        quantity: quantity,
        image: product.image
    };

    cartItems.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();

    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);

    showNotification('Product added to cart successfully!');
}
// Add an event listener for the order-now button to open the modal and update summary
document.getElementById('order-now').addEventListener('click', () => {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    openOrderModal();
});

function openOrderModal() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'block';
    updateOrderSummary(); // Ensure order summary reflects cart items
}

function updateOrderSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    document.getElementById('summary-price').textContent = `$${total.toFixed(2)}`;
    document.getElementById('summary-product').textContent = cartItems.map(item => item.name).join(", ");
    document.getElementById('summary-quantity').textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

// Close modal function if clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('order-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// Handle checkout button click
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    // Redirect to the checkout page
    window.location.href = 'index.html';
});
