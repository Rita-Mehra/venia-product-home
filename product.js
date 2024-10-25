const API_URL = 'https://fakestoreapi.com/products';
const PRODUCTS_PER_PAGE = 12;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let cart = [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const loadMoreButton = document.getElementById('load-more');
const sortSelect = document.getElementById('sort-select');
const categoryFilters = document.querySelectorAll('input[name="category"]');
const productCountDisplay = document.querySelector('.product-count'); 
const cartCountDisplay = document.querySelector('.cart-count'); 
const navCountDisplay = document.querySelector('.nav-count'); 
const hamburgerMenu = document.getElementById('hamburger-menu');
const navbar = document.getElementById('sidebar');
const close = document.getElementById('close');

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        allProducts = await response.json();
        filteredProducts = [...allProducts]; 
        productCountDisplay.textContent = `${allProducts.length} Results`; 
        navCountDisplay.textContent = `SEE ${allProducts.length} Results`; 
        renderProducts(); 
    } catch (error) {
        console.error('Error:', error);
        productsContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Render products with pagination
function renderProducts() {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToRender = filteredProducts.slice(startIndex, endIndex);

    // Product cards
    productsContainer.innerHTML += productsToRender.map(product => `
        <div class="product-card" id="product-${product.id}">
            <img src="${product.image}" class="product-image" alt="${product.title}">
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
            </div>
            <button class="favorite-icon" data-product-id="${product.id}">&#10084;</button>
        </div>
    `).join('');

    // Heart icon functionality
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', (e) => toggleFavorite(e.target));
    });

    loadMoreButton.style.display = endIndex >= filteredProducts.length ? 'none' : 'block';
}

// Toggle favorite heart color and add/remove from cart
function toggleFavorite(icon) {
    const productId = icon.getAttribute('data-product-id');
    const product = allProducts.find(prod => prod.id == productId);

    if (!product) return;

    if (icon.classList.toggle('active')) {
        cart.push(product);
    } else {
        cart = cart.filter(item => item.id !== product.id);
    }
    cartCountDisplay.textContent = cart.length;
}

function loadMoreProducts() {
    currentPage++;
    renderProducts();
}

// Sort products by price or name
function sortProducts(sortBy) {
    const [field, order] = sortBy.split('-');

    filteredProducts.sort((a, b) => {
        if (field === 'price') {
            return order === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (field === 'name') {
            return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        }
    });

    currentPage = 1;
    productsContainer.innerHTML = '';
    renderProducts();
}

// Filter products by category
function filterProducts() {
    const selectedCategories = Array.from(categoryFilters)
        .filter(input => input.checked)
        .map(input => input.value);

    filteredProducts = allProducts.filter(product => 
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
    );

    productCountDisplay.textContent = `${filteredProducts.length} Results`;
    navCountDisplay.textContent = `${filteredProducts.length}`; // Update nav count

    currentPage = 1;
    productsContainer.innerHTML = '';
    renderProducts();
}

// Hamburger menu functionality
hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navbar.classList.toggle('active');
});

close.addEventListener('click', () => {
    navbar.classList.remove('active');
});

loadMoreButton.addEventListener('click', loadMoreProducts);
sortSelect.addEventListener('change', (e) => sortProducts(e.target.value));
categoryFilters.forEach(filter => filter.addEventListener('change', filterProducts));

fetchProducts();
