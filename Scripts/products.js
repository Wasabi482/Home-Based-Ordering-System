
displayProducts();
console.log(menu);

// Load products from local storage when the page loads
menu = JSON.parse(localStorage.getItem("menu")) || [];

// Function to save the menu to local storage
function saveToLocalStorage() {
localStorage.setItem("menu", JSON.stringify(menu));
}
function displayProducts() {
  const productContainer = document.getElementById("productsContainer");
  productContainer.innerHTML = "";
  menu.forEach((item, index) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="content">
              <h3>${item.name}</h3>
              <p>${item.category}</p>
              <p>₱${item.price.toFixed(2)}</p>
              <p>${item.description}</p>
              <div class="buttons">
                  <button class="edit-btn" onclick="editProduct(${index})">Edit</button>
                  <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
              </div>
          </div>
      `;
      productContainer.appendChild(productCard);
  });
}

function editProduct(index) {
  const product = menu[index];
  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editCategory").value = product.category;
  document.getElementById("editDescription").value = product.description;
  document.getElementById("editModal").style.display = "flex";
  document.getElementById("editModal").setAttribute("data-index", index);
}

function saveChanges() {
  const index = document.getElementById("editModal").getAttribute("data-index");
  const fileInput = document.getElementById("editImage");
  const file = fileInput.files[0];

  // Update product fields
  menu[index].name = document.getElementById("editName").value;
  menu[index].price = parseFloat(document.getElementById("editPrice").value);
  menu[index].category = document.getElementById("editCategory").value;
  menu[index].description = document.getElementById("editDescription").value;

  if (file) {
      // Convert the selected image to Base64 and update the product image
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
          menu[index].image = reader.result; // Update with new image
          saveToLocalStorage()
          displayProducts();
      };
  } else {
      // No new image selected, just update other details
      saveToLocalStorage()
      displayProducts();
  }

  closeModal();
}

function openAddModal() {
  document.getElementById("addModal").style.display = "flex";
}

function addProduct() {
  const fileInput = document.getElementById("addImage");
  const file = fileInput.files[0];

  if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
          const newProduct = {
              name: document.getElementById("addName").value,
              price: parseFloat(document.getElementById("addPrice").value),
              category: document.getElementById("addCategory").value,
              description: document.getElementById("addDescription").value,
              image: reader.result  // Base64 encoded image
          };
          menu.push(newProduct);
          saveToLocalStorage()
          closeModal();
          displayProducts();
      };
  } else {
      saveToLocalStorage()
      alert("Please select an image!");
  }
}

function deleteProduct(index) {
  menu.splice(index, 1);
  saveToLocalStorage()
  displayProducts();
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
}

displayProducts();