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
        productContainer.innerHTML = menu.map((product, index) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <div class="buttons">
            <button class="edit-btn" data-index="${index}" data-id="${product.id}">Edit</button>
            <button class="delete-btn" data-index="${index}" data-id="${product.id}">Delete</button>
            <button class="view-recipe-btn" data-id="${product.id}">View Recipe</button>
            </div>
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
    
        const recipe = getRecipeById(productId);
        
        if (!recipe) {
            recipeDetails.innerHTML = "<p>No recipe available for this product.</p>";
        } else {
            recipeDetails.innerHTML = `
                <table id="recipeTable">
                    <thead>
                        <tr>
                            <th>Ingredient</th>
                            <th>Amount (g/ml)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(recipe).map(([ingredient, amount]) => `
                            <tr>
                                <td><input type="text" class="ingredient-name" value="${ingredient}"></td>
                                <td><input type="number" class="ingredient-amount" value="${amount}" min="0"></td>
                                <td><button class="remove-ingredient">Remove</button></td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <button id="addIngredientBtn">Add Ingredient</button>
                <button id="saveRecipeChangesBtn">Save Changes</button>
            `;
        }
    
        recipeModal.style.display = "block";
    
        // Attach event listeners for adding and removing ingredients
        document.getElementById("addIngredientBtn").addEventListener("click", addIngredientRow);
        document.getElementById("saveRecipeChangesBtn").addEventListener("click", function () {
            saveRecipeChanges(productId);
        });
    
        document.querySelectorAll(".remove-ingredient").forEach(btn => {
            btn.addEventListener("click", function () {
                this.closest("tr").remove();
            });
        });
    }
    function addIngredientRow() {
        const recipeTable = document.querySelector("#recipeTable tbody");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" class="ingredient-name" placeholder="Ingredient Name"></td>
            <td><input type="number" class="ingredient-amount" placeholder="Amount" min="0"></td>
            <td><button class="remove-ingredient">Remove</button></td>
        `;
    
        recipeTable.appendChild(newRow);
    
        // Attach event listener to remove button
        newRow.querySelector(".remove-ingredient").addEventListener("click", function () {
            newRow.remove();
        });
    }
    function saveRecipeChanges(productId) {
        const product = menu.find(item => item.id === productId);
        if (!product) return;
    
        const productName = product.name.trim();
        let category = "drinks"; // Default to drinks
    
        // Find the product inside the recipes array (drinks or foods)
        let recipeObj = recipes.drinks.find(drink => drink.name === productName) || 
                        recipes.foods.find(food => food.name === productName);
        
        if (!recipeObj) {
            console.error("Recipe not found for:", productName);
            return;
        }
    
        if (recipes.foods.includes(recipeObj)) {
            category = "foods"; // If it's found in foods, update category
        }
    
        const recipeTableRows = document.querySelectorAll("#recipeTable tbody tr");
        const updatedIngredients = {};
    
        recipeTableRows.forEach(row => {
            let ingredientName = row.querySelector(".ingredient-name").value.trim();
            let ingredientAmount = parseFloat(row.querySelector(".ingredient-amount").value);
    
            // Enforce correct ingredient name format
            let formattedIngredient = toCamelCase(ingredientName);
            if (!formattedIngredient) return; // Skip if invalid
            
            if (!isNaN(ingredientAmount)) {
                updatedIngredients[formattedIngredient] = ingredientAmount;
            }
        });
    
        // Update the ingredients in the recipe object
        recipeObj.ingredients = updatedIngredients;
    
        // Save to localStorage
        localStorage.setItem("recipes", JSON.stringify(recipes));
    
        alert("Recipe updated successfully!");
        document.getElementById("recipeModal").style.display = "none";
    }
    
    function toCamelCase(str) {
        return str
            .toLowerCase() // Step 1: Convert everything to lowercase
            .replace(/\s(.)/g, (match, letter) => letter.toUpperCase()) // Step 2: Capitalize first letter after each space
            .replace(/\s/g, ""); // Step 3: Remove all spaces
    }
    
    // Enforce correct formatting when typing in the input field
    document.querySelectorAll(".ingredient-name").forEach(inputField => {
        inputField.addEventListener("input", function () {
            this.value = this.value.replace(/\s+/g, " ").trim(); // Auto-fix spaces
        });
    });


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