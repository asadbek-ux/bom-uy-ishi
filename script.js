let products = [];
let visibleProducts = 0;
const productsPerLoad = 10;
let activeCategory = 'all';

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

async function fetchProducts() {
    showLoading(); 
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        products = data.products;
        renderProducts();  
        loadCategories(); 
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        hideLoading();  
    }
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        return product;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}

async function renderProductDetail(productId) {
    const product = await fetchProductDetails(productId);  
    if (!product) {
        alert("Mahsulot detallarini olishda xatolik yuz berdi.");
        return;
    }


    const productDetail = document.getElementById('productDetail');
    productDetail.innerHTML = `
        <h1>${product.title}</h1>
        <img src="${product.thumbnail}" alt="${product.title}">
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
    `;

    
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';  
    if (product.rating) {
        const reviewElem = document.createElement('div');
        reviewElem.classList.add('review');
        reviewElem.innerHTML = `
            <p><strong>Rating:</strong> ${'⭐'.repeat(Math.round(product.rating))} (${product.rating})</p>
        `;
        reviewList.appendChild(reviewElem);
    } else {
        reviewList.innerHTML = '<p>No reviews available for this product.</p>';
    }

   
    document.getElementById('productDetailModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('productDetailModal').style.display = 'none';
}

function renderProducts() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';  

    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(product => product.category === activeCategory);

    filteredProducts.slice(0, visibleProducts).forEach(product => {
        const productElem = document.createElement('div');
        productElem.classList.add('product');
        productElem.setAttribute('data-id', product.id);  
        productElem.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
        `;
        productElem.addEventListener('click', () => renderProductDetail(product.id)); 
        productsContainer.appendChild(productElem);
    });

    document.getElementById('seeMoreBtn').style.display = visibleProducts >= filteredProducts.length ? 'none' : 'block';
}

function loadMoreProducts() {
    visibleProducts += productsPerLoad;
    renderProducts();
}

function loadCategories() {
    const categoryNav = document.getElementById('categoryNav');
    const categories = ['all', ...new Set(products.map(product => product.category))];  

    categories.forEach(category => {
        const listItem = document.createElement('li');
        const name = document.createElement('a');
        name.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        name.href = "#";
        name.onclick = () => setCategory(category);
        if (category === activeCategory) name.classList.add('active');
        listItem.appendChild(name);
        categoryNav.appendChild(listItem);
    });
}

function setCategory(category) {
    activeCategory = category;
    visibleProducts = productsPerLoad; 

    document.querySelectorAll('.filter ul li a').forEach(name => {
        name.classList.toggle('active', name.textContent.toLowerCase() === category);
    });

    renderProducts();  
}

window.onload = function() {
    visibleProducts = productsPerLoad; 
    fetchProducts();  
}
