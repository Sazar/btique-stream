// ===================================
// Theme Toggle Functionality
// ===================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const existingTheme = htmlElement.getAttribute('data-theme');
    const newTheme = existingTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===================================
// Mobile Menu Toggle
// ===================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');
const mobileMenuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        mobileMenuIcon.classList.remove('fa-bars');
        mobileMenuIcon.classList.add('fa-times');
    } else {
        mobileMenuIcon.classList.remove('fa-times');
        mobileMenuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuIcon.classList.remove('fa-times');
        mobileMenuIcon.classList.add('fa-bars');
    });
});

// ===================================
// Shopping Cart Functionality
// ===================================

let cart = [];
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const btnCart = document.querySelector('.btn-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');

// Open cart
btnCart.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

// Close cart
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Add to cart buttons
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));
        
        addToCart(product, price);
        
        // Visual feedback
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Ajouté!';
        button.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 1500);
    });
});

function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product: product,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    openCartAfterAdd();
}

function openCartAfterAdd() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
            </div>
        `;
        cartTotalElement.textContent = '€0.00';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.product}</h4>
                    <p class="cart-item-price">€${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `€${total.toFixed(2)}`;
    }
}

// Make removeFromCart available globally
window.removeFromCart = removeFromCart;

// Initialize cart display
updateCart();

// ===================================
// Product Filter Functionality
// ===================================

const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Contact Form Submission
// ===================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(contactForm);
    
    // Visual feedback
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-check"></i> Message envoyé!';
    submitButton.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
    
    // Reset form after delay
    setTimeout(() => {
        contactForm.reset();
        submitButton.innerHTML = originalText;
        submitButton.style.background = '';
    }, 2000);
    
    // In a real application, you would send the form data to a server here
    console.log('Form submitted:', Object.fromEntries(formData));
});

// ===================================
// Navbar Scroll Effect
// ===================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 5px 20px var(--shadow-color)';
        navbar.style.padding = '0.5rem 0';
    } else {
        navbar.style.boxShadow = '0 2px 10px var(--shadow-color)';
        navbar.style.padding = '';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Animation on Scroll
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .category-card, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Checkout Button
// ===================================

const checkoutButton = document.querySelector('.btn-checkout');

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }
    
    // In a real application, this would redirect to a checkout page
    alert('Redirection vers le paiement...\n\nTotal: ' + cartTotalElement.textContent);
});

// ===================================
// Dynamic Year in Footer
// ===================================

const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = `© ${currentYear} StreamStore. Tous droits réservés.`;
}

console.log('StreamStore - Site prêt à l\'emploi! 🎮');
