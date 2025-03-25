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

    let recipes = JSON.parse(localStorage.getItem("recipes")) || {};
    console.log(recipes);
    function saveToLocalStorage() {
        localStorage.setItem("menu", JSON.stringify(menu));
    }

    function displayProducts() {
        productsContainer.innerHTML = menu.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>$${product.price.toFixed(2)}</p>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
                <button class="view-recipe-btn" data-id="${product.id}">View Recipe</button>
            </div>
        `).join("");
    }

    function getRecipeById(productId) {
        const product = menu.find(item => item.id === productId);
        if (!product) return null;
    
        const productName = product.name.trim(); // Normalize name
    
        const recipe =
            recipes.drinks.find(drink => drink.name === productName)?.ingredients ||
            recipes.foods.find(food => food.name === productName)?.ingredients ||
            null;
    
        if (!recipe) {
            console.warn(`Recipe not found for: ${productName}`);
        }
    
        return recipe;
    }
    function showRecipeModal(productId) {
        const recipeModal = document.getElementById("recipeModal");
        const recipeDetails = document.getElementById("recipeDetails");
        console.log(menu);
        const recipe = getRecipeById(productId);
        
        if (!recipe) {
            recipeDetails.innerHTML = "<p>No recipe available for this product.</p>";
        } else {
            recipeDetails.innerHTML = Object.entries(recipe).map(([ingredient, amount]) => `
                <p>${ingredient}: ${amount}g</p>
            `).join(" ");
        }
        
        recipeModal.style.display = "block";
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
    cancelViewBtn.addEventListener("click", closeModal);

    // Product Edit/Delete Delegation
    productContainer.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-btn")) {
            openEditModal(index);
        } else if (e.target.classList.contains("delete-btn")) {
            deleteProduct(index);
        } else if (e.target.classList.contains("view-recipe-btn")){
            const productId = e.target.dataset.id;
            showRecipeModal(productId);
        }
    });

    document.getElementById("saveRecipeChangesBtn").addEventListener("click", function () {
        const productId = document.querySelector(".view-recipe-btn").dataset.id;
        saveRecipeChanges(productId);
    });

    document.getElementById("cancelRecipeEditBtn").addEventListener("click", function () {
        document.getElementById("recipeModal").style.display = "none";
    });

    displayProducts();
});
