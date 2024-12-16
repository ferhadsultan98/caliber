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
      document
        .getElementById("add-product-btn")
        .addEventListener("click", function () {
          showSection("add-product-section");
        });

      document
        .getElementById("orders-btn")
        .addEventListener("click", function () {
          showSection("orders-section");
        });

      // Show "Add Product" section by default when the page loads
      showSection("add-product-section");

      // Admin panelinde ürün ekleme işlemi
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

          // GitHub'a JSON verisini gönderme
          await updateProductListInGitHub(newProduct);

          showModalWindow("Məhsul əlavə olundu");

          // Formu sıfırla
          document.getElementById("add-product-form").reset();
        });

      // Cloudinary'ye görsel yüklemek için fonksiyon
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

      // GitHub'a ürün verisini JSON formatında gönderme
      async function updateProductListInGitHub(newProduct) {
        const token = "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"; // GitHub token
        const repoOwner = "ferhadsultan98";
        const repoName = "infos";
        const filePath = "projects.json"; // JSON file path in the repo

        // GitHub API URL for updating the file
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        try {
          // Get current content of the JSON file from GitHub
          const getContentResponse = await fetch(url, {
            headers: {
              Authorization: `token ${token}`,
            },
          });
          const getContentData = await getContentResponse.json();

          let currentContent = [];

          if (getContentData.content) {
            const decodedContent = atob(getContentData.content);
            if (decodedContent.trim() === "") {
              // If the content is empty, initialize an empty array
            } else {
              currentContent = JSON.parse(decodedContent);
            }
          }

          // Add new product to the list
          currentContent.push(newProduct);

          // Pretty-print the JSON with indentation of 2 spaces (2 boşluk girintisi ile)
          const prettyPrintedContent = JSON.stringify(currentContent, null, 2);

          // Encode the updated JSON back to base64
          const updatedContent = btoa(prettyPrintedContent);

          // Create a commit with updated content
          const commitData = {
            message: "Add new product",
            content: updatedContent,
            sha: getContentData.sha, // Existing file SHA for updating
          };

          // Send the updated content back to GitHub
          await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commitData),
          });
        } catch (error) {
          console.error("Error fetching content from GitHub:", error);
        }
      }

      // New Order List
      document.addEventListener("DOMContentLoaded", function () {
    // Fetch and display orders when the page loads
    fetchOrders();

    // Function to fetch orders from GitHub and display them
    async function fetchOrders() {
        const token = "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"; // GitHub token
        const repoOwner = "ferhadsultan98";
        const repoName = "infos";
        const filePath = "order.json"; // JSON file path for orders

        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        try {
            const getContentResponse = await fetch(url, {
                headers: {
                    Authorization: `token ${token}`,
                },
            });

            const getContentData = await getContentResponse.json();

            if (getContentResponse.ok) {
                // Decode base64 content
                const content = atob(getContentData.content);
                const orderContent = JSON.parse(content); // Parse the JSON content
                
                // Display the orders in the UI
                displayOrders(orderContent);
            } else {
                throw new Error(`Error fetching data: ${getContentData.message}`);
            }
        } catch (error) {
            console.error("Error fetching orders from GitHub:", error);
        }
    }

    // Function to display orders on the page
    function displayOrders(orders) {
        const ordersList = document.getElementById("orders-list");
        ordersList.innerHTML = ""; // Clear any existing content

        if (orders.length === 0) {
            ordersList.innerHTML = "<p>No orders found.</p>";
            return;
        }

        orders.forEach((order) => {
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
        });
    }
});
