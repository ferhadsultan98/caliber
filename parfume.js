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
async function fetchProducts() {
    const token = "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"; 
    const repoOwner = "ferhadsultan98";
    const repoName = "infos";
    const filePath = "projects.json"; 
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`,
            },
        });

        const data = await response.json();
        if (data.content) {
            const decodedContent = atob(data.content);
            const products = JSON.parse(decodedContent) || [];

            // Get selected category
            const selectedCategory = document.getElementById('category-select').value;

            // Filter products by selected category
            const filteredProducts = selectedCategory === 'all'
                ? products
                : products.filter(product => product.category === selectedCategory);

            // Display the products in the product-cards container
            displayProducts(filteredProducts);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to display products
let cart = [];  // Sepetteki ürünlerin listesini tutacak

// Sepeti kapatma fonksiyonu
document.getElementById("close-cart-btn").addEventListener("click", function() {
    const cartSection = document.getElementById("cart");
    cartSection.style.display = "none"; // Sepeti gizle
});

// Sepeti açma fonksiyonu
function openCart() {
    const cartSection = document.getElementById("cart");
    cartSection.style.display = "block"; // Sepeti göster
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ''; // Sepeti temizle

    cart.forEach(product => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        // Fiyat ve miktar kontrolü
        const price = parseFloat(product.price);
        const quantity = product.quantity;
        
        if (isNaN(price) || isNaN(quantity)) {
            console.error("Invalid price or quantity", product);
        }

        // Toplam fiyatı hesapla (fiyat ve miktar geçerliyse)
        const totalPrice = (isNaN(price) || isNaN(quantity)) ? 0 : price * quantity;

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

    // Sepet görünürlüğünü kontrol et
    const cartSection = document.getElementById("cart");
    cartSection.style.display = cart.length > 0 ? "block" : "none"; 

    // Sepet boşsa mesajı göster
    const emptyMessage = document.getElementById("cart-empty-message");
    if (emptyMessage) {
        emptyMessage.classList.toggle("show", cart.length === 0); 
    }
}

// Ürünleri sepete ekleme ve sepeti açma
function addToCart(product) {
    // Sepette bu ürün zaten varsa, miktarını arttır
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Miktarı bir arttır
    } else {
        cart.push({...product, quantity: 1}); // Yeni ürün ekle, miktar 1
    }

    updateCart(); // Sepeti güncelle
}

// "Buy Now" butonuna tıklama işlemi
function handleBuyNow(product) {
    // "Buy Now" butonunda ürün miktarını 1 arttır
    addToCart(product);
}

// "Checkout" butonuna tıklama işlemi
document.getElementById("checkout-btn").addEventListener("click", function() {
   showModalWindow("Proceeding to checkout...");
});

// Ürünleri görüntüleme
function displayProducts(products) {
    const productContainer = document.getElementById("product-cards");
    productContainer.innerHTML = ''; // Mevcut ürünleri temizle

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
            handleBuyNow(product); // Burada product doğru şekilde iletiliyor
        });

        productContainer.appendChild(productCard);
    });
}

// Order Please
document.getElementById("checkout-btn").addEventListener("click", async function() {
    const orderData = JSON.stringify(cart, null, 2); // Sepetteki veriyi JSON formatında al
    const token = "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"; // GitHub token
    const repoOwner = "ferhadsultan98";  // GitHub repository sahibi
    const repoName = "infos";  // Repository adı
    const filePath = "order.json";  // Güncellenecek dosya yolu
    const branch = "main";  // Hedef şube

    try {
        // 1. GitHub API'sinden mevcut dosyanın SHA bilgisini al
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            method: "GET",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error fetching file data");
        }

        const data = await response.json();

        // Eğer dosya boşsa (content olmayabilir), o zaman empty array kullan
        let currentData = data.content ? JSON.parse(atob(data.content)) : [];
        

        // 2. Sipariş verisini mevcut verilere ekle
        const updatedData = [...currentData, ...JSON.parse(orderData)];

        // 3. Dosyayı güncellemek için PUT isteği gönder
        const updateResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Add new order data to order.json",  // Commit mesajı
                content: btoa(JSON.stringify(updatedData, null, 2)),  // Yeni veri base64 ile şifrele
                sha: data.sha,  // Eski dosyanın sha değeri
                branch: branch  // Hedef şube
            })
        });

        if (!updateResponse.ok) {
            throw new Error("Error updating file data");
        }

        const updateData = await updateResponse.json();
        if (updateData.commit) {
            console.log("Sipariş GitHub'a başarıyla gönderildi!");
        } else {
            console.log("Sipariş gönderilirken hata oluştu.");
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
        alert("Sipariş kaydedilirken bir hata oluştu.");
    }
});

// Ürünleri sayfa yüklendiğinde getir
window.onload = fetchProducts;

// Kategori seçildiğinde ürünleri filtrele
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
// Admin paneline yönlendirme (sadece /admin path'inde)
if (window.location.pathname === '/admin') {
    window.location.href = '/adminpanel.html'; 
}
