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
const hamburgerMenu = document.getElementById('hamburger-menu');
const navbar = document.getElementById('navbar');

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

    //product cards
    productsContainer.innerHTML += productsToRender.map(product => `
        <div class="product-card" id="product-${product.id}">
            <img src="${product.image}" class="product-image" alt="${product.title}">
            <div class="product-info">
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            </div>
            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
    `).join('');

    // Add to Cart buttons functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => addToCart(e.target.getAttribute('data-product-id')));
    });

    // Load More button
    loadMoreButton.style.display = endIndex >= filteredProducts.length ? 'none' : 'block';
}

// Load more products (pagination)
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

    currentPage = 1;
    productsContainer.innerHTML = '';
    renderProducts();
}

// Add product to cart
function addToCart(productId) {
    const product = allProducts.find(prod => prod.id == productId);

    if (product) {
        cart.push(product);
        cartCountDisplay.textContent = cart.length;
    }
}

//hanmburgur

hamburgerMenu.addEventListener('click', () => {
    navbar.querySelector('nav').classList.toggle('active');
});

console.log(hamburgerMenu);

// Event listeners
loadMoreButton.addEventListener('click', loadMoreProducts);
sortSelect.addEventListener('change', (e) => sortProducts(e.target.value));
categoryFilters.forEach(filter => filter.addEventListener('change', filterProducts));

fetchProducts();
