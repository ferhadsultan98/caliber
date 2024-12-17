document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === '20242025') {
    localStorage.setItem('loggedIn', 'true');
    toggleLoginState(true);
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
});

window.addEventListener('load', function() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  toggleLoginState(loggedIn);
});

document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem('loggedIn');
  toggleLoginState(false);
});

function toggleLoginState(isLoggedIn) {
  document.getElementById('login-body').style.display = isLoggedIn ? 'none' : 'block';
  document.getElementById('admin-panel').style.display = isLoggedIn ? 'block' : 'none';
  document.getElementById('login-section').style.display = isLoggedIn ? 'none' : 'block';
}





// Modal Pencereler
      const modal = document.getElementById("modal");
      const modalMessage = document.getElementById("modal-message");
      const modalCloseButton = document.getElementById("modal-close");

      // Modal'ı gösterme fonksiyonu
      function showModalWindow(message) {
        modalMessage.textContent = message;
        modal.style.display = "block";
        setTimeout(function () {
          modal.style.display = "none";
        }, 2000);
      }

      // Modal'ı kapama fonksiyonu
      modalCloseButton.addEventListener("click", function () {
        modal.style.display = "none"; // Modal'ı gizle
      });

      // Modal dışında bir yere tıklandığında modal'ı kapama
      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.style.display = "none"; // Modal'ı gizle
        }
      });
      // Function to hide all sections
      function hideAllSections() {
        const sections = document.querySelectorAll(".section");
        sections.forEach((section) => {
          section.style.display = "none";
        });
      }

      // Function to show a specific section
      function showSection(sectionId) {
        hideAllSections();
        document.getElementById(sectionId).style.display = "block";
      }

      // Event listeners for navbar
document.getElementById("add-product-btn").addEventListener("click", function () {
    showSection("add-product-section");
});

document.getElementById("orders-btn").addEventListener("click", function () {
    showSection("orders-section");
});

// Function to show the selected section and hide the other
function showSection(sectionId) {
    // Hide both sections
    document.getElementById("add-product-section").style.display = "none";
    document.getElementById("orders-section").style.display = "none";

    // Show the selected section
    document.getElementById(sectionId).style.display = "block";
}

// Show "Add Product" section by default when the page loads
showSection("add-product-section");

   
    // Firebase SDK'yı import etme
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
    import { getDatabase, ref, set, push, get } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';
// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyCps_Vgv9la3masD0VTiE8G9EFikq2o49g",
  authDomain: "parfume-51146.firebaseapp.com",
  databaseURL: "https://parfume-51146-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parfume-51146",
  storageBucket: "parfume-51146.firebasestorage.app",
  messagingSenderId: "296367412154",
  appId: "1:296367412154:web:d1e2bfb275e6dfaeb50383"
};

// Firebase'i başlatma
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Realtime Database bağlantısı

// Cloudinary'e görsel yükleme fonksiyonu
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "farhadsultan"); // Cloudinary upload preset
  formData.append("cloud_name", "dbbtdnneh"); // Cloudinary Cloud name

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dbbtdnneh/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  return data.secure_url; // Return the uploaded image URL
}

// Firebase'e yeni ürün ekleme fonksiyonu
async function updateProductListInFirebase(newProduct) {
  const productsRef = ref(database, 'products'); // 'products' noduna referans

  try {
    // Yeni ürün eklemek için push kullanıyoruz (benzersiz bir ID oluşturulacak)
    const newProductRef = push(productsRef);
    await set(newProductRef, newProduct); // Yeni ürünü Firebase'e kaydetme
    console.log("Product added successfully to Firebase!");
  } catch (error) {
    console.error("Error adding product to Firebase:", error);
  }
}

// Firebase'ten siparişleri çekme ve listeleme
async function fetchOrdersFromFirebase() {
  const ordersRef = ref(database, 'orders'); // 'orders' noduna referans

  try {
    const snapshot = await get(ordersRef); // Firebase'ten veriyi çekme
    if (snapshot.exists()) {
      const orders = snapshot.val(); // Sipariş verileri
      displayOrders(orders); // Siparişleri görüntüleme
    } else {
      console.log("No orders found.");
    }
  } catch (error) {
    console.error("Error fetching orders from Firebase:", error);
  }
}

// Siparişleri ekrana yazdırma fonksiyonu
function displayOrders(orders) {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = ""; // Mevcut içeriği temizle

  if (!orders || Object.keys(orders).length === 0) {
    ordersList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  for (const orderId in orders) {
    const order = orders[orderId];
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-item");

    orderDiv.innerHTML = `
      <img src="${order.image}" alt="${order.name}" class="order-image" />
      <div class="order-details">
        <h3>${order.name}</h3>
        <p><strong>Qiymət:</strong> ${order.price}</p>
        <p><strong>Endirim:</strong> ${order.discount}</p>
        <p><strong>Cins:</strong> ${order.category}</p>
        <p><strong>Say:</strong> ${order.quantity}</p>
      </div>
    `;
    ordersList.appendChild(orderDiv);
  }
}

// Ürün ekleme formunun submit event'i
document
  .getElementById("add-product-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Admin panelinden alınan veriler
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const currency = document.getElementById("currency").value;
    const imageInput = document.getElementById("product-image");
    const discount =
      document.getElementById("product-discount").value || "0%";
    const category = document.getElementById("product-category").value;

    // Cloudinary'e ürün görselini yükleme
    const imageUrl = await uploadImageToCloudinary(imageInput.files[0]);

    // Yeni ürün objesi
    const newProduct = {
      name: name,
      price: `${price} ${currency}`, // Fiyat ve döviz birimi
      image: imageUrl,
      discount: `${discount} ${currency}`, // İndirim ve döviz birimi
      category: category, // Kadın veya Erkek kategorisi
    };

    // Firebase'e yeni ürünü gönderme
    await updateProductListInFirebase(newProduct);

    showModalWindow("Məhsul əlavə olundu");

    // Formu sıfırla
    document.getElementById("add-product-form").reset();
  });

// Sayfa yüklendiğinde siparişleri Firebase'ten çekme
document.addEventListener("DOMContentLoaded", function () {
  fetchOrdersFromFirebase(); // Firebase'ten siparişleri al
});
