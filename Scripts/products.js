document.addEventListener("DOMContentLoaded", function () {
    const productContainer = document.getElementById("productsContainer");
    const addModal = document.getElementById("addModal");
    const editModal = document.getElementById("editModal");
    const openAddModalBtn = document.getElementById("openAddModalBtn"); // Target the add button
    const addProductBtn = document.getElementById("addProductBtn");
    const cancelAddBtn = document.getElementById("cancelAddBtn");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    let menu = JSON.parse(localStorage.getItem("menu")) || [];
    let currentEditIndex = null;

    function saveToLocalStorage() {
        localStorage.setItem("menu", JSON.stringify(menu));
    }

    function displayProducts() {
        productContainer.innerHTML = menu.map((item, index) => `
            <div class="product-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                    <p>${item.category}</p>
                    <p>₱${item.price.toFixed(2)}</p>
                    <p>${item.description}</p>
                    <div class="buttons">
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </div>
                </div>
            </div>`).join("");
    }

    function openEditModal(index) {
        currentEditIndex = index;
        const product = menu[index];
        document.getElementById("editName").value = product.name;
        document.getElementById("editPrice").value = product.price;
        document.getElementById("editCategory").value = product.category;
        document.getElementById("editDescription").value = product.description;
        editModal.style.display = "flex";
    }

    function openAddModal() {
        addModal.style.display = "flex";
    }

    function saveChanges() {
        if (currentEditIndex === null) return;
        const fileInput = document.getElementById("editImage");
        const file = fileInput.files[0];
        menu[currentEditIndex].name = document.getElementById("editName").value;
        menu[currentEditIndex].price = parseFloat(document.getElementById("editPrice").value);
        menu[currentEditIndex].category = document.getElementById("editCategory").value;
        menu[currentEditIndex].description = document.getElementById("editDescription").value;
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                menu[currentEditIndex].image = reader.result;
                saveToLocalStorage();
                displayProducts();
                closeModal();
            };
            reader.readAsDataURL(file);
        } else {
            saveToLocalStorage();
            displayProducts();
            closeModal();
        }
    }

    function addProduct() {
        const fileInput = document.getElementById("addImage");
        const file = fileInput.files[0];
        if (!file) return alert("Please select an image!");
        
        const reader = new FileReader();
        reader.onload = function () {
            const newProduct = {
                name: document.getElementById("addName").value,
                price: parseFloat(document.getElementById("addPrice").value),
                category: document.getElementById("addCategory").value,
                description: document.getElementById("addDescription").value,
                image: reader.result
            };
            menu.push(newProduct);
            saveToLocalStorage();
            displayProducts();
            closeModal();
        };
        reader.readAsDataURL(file);
    }

    function deleteProduct(index) {
        menu.splice(index, 1);
        saveToLocalStorage();
        displayProducts();
    }

    function closeModal() {
        document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
    }

    // Event Listeners
    openAddModalBtn.addEventListener("click", openAddModal); // Open Add Modal
    addProductBtn.addEventListener("click", addProduct);
    cancelAddBtn.addEventListener("click", closeModal);
    saveChangesBtn.addEventListener("click", saveChanges);
    cancelEditBtn.addEventListener("click", closeModal);

    // Product Edit/Delete Delegation
    productContainer.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-btn")) {
            openEditModal(index);
        } else if (e.target.classList.contains("delete-btn")) {
            deleteProduct(index);
        }
    });

    displayProducts();
});
