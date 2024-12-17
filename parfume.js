// Admin paneline yönlendirme (sadece /admin path'inde)
if (window.location.pathname === '/admin') {
    window.location.href = '/admin.html'; 
}

// Modal Pencereler
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseButton = document.getElementById('modal-close');

// Modal'ı gösterme fonksiyonu
function showModalWindow(message) {
    modalMessage.textContent = message;  
    modal.style.display = 'block';  
    setTimeout(function() {
        modal.style.display = 'none';
    }, 2000);
}

// Modal'ı kapama fonksiyonu
modalCloseButton.addEventListener('click', function() {
    modal.style.display = 'none';  // Modal'ı gizle
});

// Modal dışında bir yere tıklandığında modal'ı kapama
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';  // Modal'ı gizle
    }
});
// Toggle Menu
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const menuLinks = document.querySelectorAll('.nav-links a');


menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

window.addEventListener('scroll', function () {
    const header = document.getElementById('header');

    // Eğer ekran genişliği 768px'den küçükse, işlevi durdur
    if (window.innerWidth > 768) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Smooth Scroll
  // Custom smooth scrolling function
  function slowScrollTo(target, duration) {
    const targetPosition = target.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Animation function
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    // Easing function for smooth deceleration
    function ease(t, b, c, d) {
      const ts = (t/=d)*t;
      const tc = ts*t;
      return b+c*(tc + -3*ts + 3*t);
    }

    // Start the animation
    requestAnimationFrame(animation);
  }

  // Attach slow scroll to each link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      slowScrollTo(target, 1500); // 1500ms duration for smooth scroll
    });
  });


// Dinamik Ürünler


// Function to fetch products and display them
  // Firebase SDK modülünü import etme
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyCps_Vgv9la3masD0VTiE8G9EFikq2o49g",
    authDomain: "parfume-51146.firebaseapp.com",
    databaseURL: "https://parfume-51146-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parfume-51146",
    storageBucket: "parfume-51146.firebasestorage.app",
    messagingSenderId: "296367412154",
    appId: "1:296367412154:web:d1e2bfb275e6dfaeb50383"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Ürünleri Fetch Etme Fonksiyonu
async function fetchProducts() {
    try {
        const productRef = ref(database, 'products');
        const snapshot = await get(productRef);
        const productsData = snapshot.val(); // Veriyi al

        // Eğer ürün verisi mevcut değilse boş diziye ayarla
        const products = productsData ? Object.values(productsData) : [];

        // Seçilen Kategori
        const selectedCategory = document.getElementById('category-select').value;

        // Kategoriyi filtrele
        const filteredProducts = selectedCategory === 'all'
            ? products
            : products.filter(product => product.category === selectedCategory);

        // Ürünleri Göster
        displayProducts(filteredProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Ürünleri Gösterme Fonksiyonu
function displayProducts(products) {
    const productContainer = document.getElementById("product-cards");
    productContainer.innerHTML = ''; // Mevcut ürünleri temizle

    // Her ürün için kart oluştur
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // HTML içeriği oluşturuluyor
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <div class="card-info">
                <h3>${product.name}</h3>
                <p class="qiymet">${product.price}</p>
                <p>${product.discount || 'N/A'}</p>
                <button class="buy-now">Buy Now</button>
            </div>
        `;

        // "Buy Now" butonuna tıklanması için event listener ekle
        const buyNowButton = productCard.querySelector(".buy-now");
        buyNowButton.addEventListener("click", function() {
            addToCart(product); // Burada product doğru şekilde iletiliyor
        });

        productContainer.appendChild(productCard);
    });
}

// Sepete Ürün Ekleme ve Sepeti Güncelleme
let cart = [];  // Sepetteki ürünlerin listesini tutacak
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Miktarı bir arttır
    } else {
        cart.push({...product, quantity: 1}); // Yeni ürün ekle, miktar 1
    }
    updateCart(); // Sepeti güncelle
}

// Sepeti Güncelleme Fonksiyonu
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ''; // Sepeti temizle

    cart.forEach(product => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const price = parseFloat(product.price);
        const quantity = product.quantity;
        const totalPrice = isNaN(price) || isNaN(quantity) ? 0 : price * quantity;

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image" />
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>Quantity: ${quantity}</p>
                <p>Price: ${totalPrice.toFixed(2)}</p>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    const cartSection = document.getElementById("cart");
    cartSection.style.display = cart.length > 0 ? "block" : "none"; 

    const emptyMessage = document.getElementById("cart-empty-message");
    if (emptyMessage) {
        emptyMessage.classList.toggle("show", cart.length === 0); 
    }
}

// Siparişi Firebase'e kaydetme fonksiyonu
async function saveOrderToFirebase(cart) {
    try {
        const ordersRef = ref(database, 'orders');
        const newOrderRef = ordersRef.push(); // Yeni sipariş ID'si oluştur
        await set(newOrderRef, {
            items: cart,
            timestamp: Date.now(),
        });

        alert("Sipariş başarıyla kaydedildi!");
        cart = [];
        updateCart();
    } catch (error) {
        console.error("Sipariş kaydedilirken hata:", error);
        alert("Sipariş kaydedilirken bir hata oluştu.");
    }
}

// Checkout butonuna tıklama işlemi
document.getElementById("checkout-btn").addEventListener("click", function() {
    if (cart.length > 0) {
        saveOrderToFirebase(cart);
    } else {
        alert("Sepetinizde ürün yok!");
    }
});

// Sayfa yüklendiğinde ürünleri getirme
window.onload = fetchProducts;

// Kategori seçildiğinde ürünleri filtreleme
document.getElementById("category-select").addEventListener("change", fetchProducts);






// Slider
let currentIndex = 0;

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function moveSlide(step) {
    showSlide(currentIndex + step);
}

setInterval(() => {
    showSlide(currentIndex + 1);
}, 3000);  // Slide interval in milliseconds

showSlide(currentIndex);  // Initialize the first slide
// Bu basit JavaScript animasyonu, sayfa tamamen yüklendiğinde animasyonları tetiklemeyi sağlar
document.addEventListener("DOMContentLoaded", function () {
    const sectionTitle = document.querySelector(".section-title");
    const sectionDescription = document.querySelector(".section-description");
    const teamMembers = document.querySelectorAll(".team-member");

    sectionTitle.classList.add("fade-in");
    sectionDescription.classList.add("fade-in");
    teamMembers.forEach(member => member.classList.add("team-slide-in"));
});

// Formu gönderme ve basit doğrulama işlemi
document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Sayfa yenilenmesini engelle

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        console.log('Thank you for contacting us, ' + name + '! We will get back to you soon.');
    } else {
        console.log('Please fill out all fields before submitting.');
    }
});

