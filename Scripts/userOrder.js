document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("productsContainer");

  // Initialize menu with a fallback structure
  let menu = JSON.parse(localStorage.getItem("menu"));

  // Ensure the menu object has the correct structure
  if (!menu || !Array.isArray(menu.drinks) || !Array.isArray(menu.foods)) {
    menu = { drinks: [], foods: [] }; // Default empty structure
    saveToLocalStorage(); // Save default structure back to localStorage
  }

  function saveToLocalStorage() {
    localStorage.setItem("menu", JSON.stringify(menu));
  }

  function displayProducts() {
    // Check if there are any drinks or foods to display
    if (menu.drinks.length === 0 && menu.foods.length === 0) {
      productContainer.innerHTML = "<p>No products available.</p>";
      return;
    }

    productContainer.innerHTML = `
      <h2>Drinks</h2>
      <div class="products-grid">
        ${menu.drinks.map(drink => `
          <div class="product-card">
            <img src="${drink.image}" alt="${drink.name}">
            <div class="content">
              <h3>${drink.name}</h3>
              <p>${drink.description}</p>
              <p>Base Price: $<span id="drink-price-${drink.id}">${drink.price.toFixed(2)}</span></p>
              
              <label for="size-${drink.id}">Choose Size:</label> 
              <select id="size-${drink.id}" class="size-select" data-id="${drink.id}">
                <option value="small">Small (-$0.50)</option>
                <option value="medium" selected>Medium (Base Price)</option>
                <option value="large">Large (+$1.00)</option>
              </select>

              <label for="drink-quantity-${drink.id}">Quantity:</label> 
              <input type="number" id="drink-quantity-${drink.id}" class="drink-quantity-input" data-id="${drink.id}" value="1" min="1">

              <p>Total: $<span id="total-drink-price-${drink.id}">${drink.price.toFixed(2)}</span></p>
              
              <div class="buttons">
                <button class="order-btn">Add to cart</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <h2>Foods</h2>
      <div class="products-grid">
        ${menu.foods.map(food => `
          <div class="product-card">
            <img src="${food.image}" alt="${food.name}">
            <div class="content">
              <h3>${food.name}</h3>
              <p>${food.description}</p>
              <p>Price per item: $<span id="food-price-${food.id}">${food.price.toFixed(2)}</span></p>
              
              <label for="quantity-${food.id}">Quantity:</label> 
              <input type="number" id="quantity-${food.id}" class="quantity-input" data-id="${food.id}" value="1" min="1">
              
              <p>Total: $<span id="total-price-${food.id}">${food.price.toFixed(2)}</span></p>
              
              <div class="buttons">
                <button class="order-btn">Add to cart</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Function to update the total price for drinks
    function updateDrinkTotalPrice(drinkId) {
      const basePrice = menu.drinks.find(d => d.id === drinkId).price;
      const sizeSelect = document.getElementById(`size-${drinkId}`);
      const quantityInput = document.getElementById(`drink-quantity-${drinkId}`);
      let newPrice = basePrice;

      if (sizeSelect.value === "small") newPrice -= 0.50;
      else if (sizeSelect.value === "large") newPrice += 1.00;

      const quantity = Math.max(1, parseInt(quantityInput.value, 10) || 1);
      const totalPrice = newPrice * quantity;

      document.getElementById(`drink-price-${drinkId}`).textContent = newPrice.toFixed(2);
      document.getElementById(`total-drink-price-${drinkId}`).textContent = totalPrice.toFixed(2);
    }

    // Add event listeners for size selection
    document.querySelectorAll(".size-select").forEach(select => {
      select.addEventListener("change", function () {
        updateDrinkTotalPrice(this.dataset.id);
      });
    });

    // Add event listeners for quantity input (drinks)
    document.querySelectorAll(".drink-quantity-input").forEach(input => {
      input.addEventListener("input", function () {
        updateDrinkTotalPrice(this.dataset.id);
      });
    });

    // Add event listeners for quantity input (foods)
    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("input", function () {
        const foodId = this.dataset.id;
        const basePrice = menu.foods.find(f => f.id === foodId).price;
        const quantity = Math.max(1, parseInt(this.value, 10) || 1);
        document.getElementById(`total-price-${foodId}`).textContent = (basePrice * quantity).toFixed(2);
      });
    });
  }

  displayProducts();
});
