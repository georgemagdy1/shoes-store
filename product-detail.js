// Initialize cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Get current product from localStorage
function getCurrentProduct() {
    return JSON.parse(localStorage.getItem('currentProduct'));
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cartItems.length;
}

// Modal handling
function openModal() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'block';
    updateOrderSummary();
}

function closeModal() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'none';
}

// Update order summary
function updateOrderSummary() {
    const product = getCurrentProduct();
    const selectedSize = document.querySelector('.size-btn.selected');
    const quantity = document.getElementById('quantity').value;
    const totalPrice = product.price * quantity;

    document.getElementById('summary-product').textContent = product.name;
    document.getElementById('summary-size').textContent = selectedSize ? selectedSize.textContent : 'Not selected';
    document.getElementById('summary-quantity').textContent = quantity;
    document.getElementById('summary-price').textContent = `$${totalPrice.toFixed(2)}`;
}

// Handle order submission
function handleOrderSubmit(event) {
    event.preventDefault();
    
    const selectedSize = document.querySelector('.size-btn.selected');
    if (!selectedSize) {
        alert('Please select a size before placing the order');
        return;
    }

    const orderDetails = {
        product: getCurrentProduct(),
        size: selectedSize.textContent,
        quantity: document.getElementById('quantity').value,
        customerInfo: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            paymentMethod: document.getElementById('payment').value
        }
    };

    // Store order details in localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Show success message
    showOrderSuccess();
}

// Show order success message
function showOrderSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your order. We'll send you an email with the order details.</p>
        <button onclick="window.location.href='index.html'">Continue Shopping</button>
    `;
    document.body.appendChild(successMessage);

    // Remove the modal
    closeModal();

    // Remove success message after 5 seconds and redirect
    setTimeout(() => {
        successMessage.remove();
        window.location.href = 'index.html';
    }, 5000);
}

// Initialize product detail page
function initProductDetail() {
    const product = getCurrentProduct();
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${product.name} - FootFlex`;

    // Update product information
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-price').textContent = `$${product.price}`;
    document.getElementById('product-main-image').src = product.image;
    document.getElementById('product-main-image').alt = product.name;

    // Set up quantity controls
    const quantityInput = document.getElementById('quantity');
    document.getElementById('decrease-quantity').addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value--;
            updateOrderSummary();
        }
    });
    document.getElementById('increase-quantity').addEventListener('click', () => {
        if (quantityInput.value < 10) {
            quantityInput.value++;
            updateOrderSummary();
        }
    });

    // Set up size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            updateOrderSummary();
        });
    });

    // Set up order button
    document.getElementById('order-now').addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-btn.selected');
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        openModal();
    });

    // Set up modal close button
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    // Set up order form submission
    document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('order-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initProductDetail();
    updateCartCount();
});
///////////
// Store products in localStorage for access from detail page
localStorage.setItem('products', JSON.stringify(products));

// Shopping cart
let cartItemss = JSON.parse(localStorage.getItem('cartItems')) || [];

// Render products with click handling
function renderProducts() {
    const productGrid = document.getElementById('products');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="navigateToProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id}); event.stopPropagation();">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Navigate to product detail page
function navigateToProduct(productId) {
    // Store current product in localStorage
    const product = products.find(p => p.id === productId);
    localStorage.setItem('currentProduct', JSON.stringify(product));
    window.location.href = `product-detail.html?id=${productId}`;
}

// Add to cart functionality
function addToCart(productId) {
    cartItems.push(productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    // Add animation to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}