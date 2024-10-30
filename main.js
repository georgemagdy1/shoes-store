// Enhanced product data with more variety
const products = [
    {
        id: 1,
        name: "Sport Runner X1",
        category: "Running",
        price: 129.99,
        image: "download (1).jpg",
        description: "Lightweight running shoes with superior cushioning and support."
    },
    {
        id: 2,
        name: "Urban Street Pro",
        category: "Casual",
        price: 149.99,
        image: "download.jpg",
        description: "Stylish casual shoes perfect for everyday wear."
    },
    {
        id: 3,
        name: "Classic Comfort Elite",
        category: "Lifestyle",
        price: 99.99,
        image: "images (1).jpg",
        description: "Classic design meets modern comfort."
    },
    {
        id: 4,
        name: "Performance Boost Max",
        category: "Athletic",
        price: 179.99,
        image: "images (2).jpg",
        description: "Maximum performance for serious athletes."
    },
    {
        id: 5,
        name: "Performance Boost Max",
        category: "Athletic",
        price: 179.99,
        image: "images (3).jpg",
        description: "Maximum performance for serious athletes."
    },
    {
        id: 6,
        name: "Performance Boost Max",
        category: "Athletic",
        price: 179.99,
        image: "images (4).jpg",
        description: "Maximum performance for serious athletes."
    },
    {
        id: 6,
        name: "Performance Boost Max",
        category: "Athletic",
        price: 179.99,
        image: "pp (1).jpg",
        description: "Maximum performance for serious athletes."
    },
    {
        id: 7,
        name: "Performance Boost Max",
        category: "Athletic",
        price: 179.99,
        image: "pp (2).jpg",
        description: "Maximum performance for serious athletes."
    },
];

// Store products in localStorage for access from detail page
localStorage.setItem('products', JSON.stringify(products));

// Shopping cart
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

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

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cartItems.length;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});
