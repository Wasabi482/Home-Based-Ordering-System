document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("productsContainer");

  let menu = JSON.parse(localStorage.getItem("menu")) || { drinks: [], foods: [] };
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function displayProducts() {
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
                <button class="order-btn" data-id="${drink.id}" data-type="drink">Add to Cart</button>
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
                <button class="order-btn" data-id="${food.id}" data-type="food">Add to Cart</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Drink price update logic
    function updateDrinkTotalPrice(drinkId) {
      const basePrice = menu.drinks.find(d => d.id === drinkId).price;
      const sizeSelect = document.getElementById(`size-${drinkId}`);
      const quantityInput = document.getElementById(`drink-quantity-${drinkId}`);

      let newPrice = basePrice;
      if (sizeSelect.value === "small") newPrice -= 0.50;
      else if (sizeSelect.value === "large") newPrice += 1.00;

      const quantity = Math.max(1, parseInt(quantityInput.value, 10) || 1);
      const totalPrice = newPrice * quantity;

      document.getElementById(`drink-price-${drinkId}`).textContent = basePrice.toFixed(2); // Keep base price the same
      document.getElementById(`total-drink-price-${drinkId}`).textContent = totalPrice.toFixed(2);
    }

    // Update total price for drinks when size or quantity changes
    document.querySelectorAll(".size-select").forEach(select => {
      select.addEventListener("change", function () {
        updateDrinkTotalPrice(this.dataset.id);
      });
    });

    document.querySelectorAll(".drink-quantity-input").forEach(input => {
      input.addEventListener("input", function () {
        updateDrinkTotalPrice(this.dataset.id);
      });
    });

    // Update total price for food items when quantity changes
    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("input", function () {
        const foodId = this.dataset.id;
        const basePrice = menu.foods.find(f => f.id === foodId).price;
        const quantity = Math.max(1, parseInt(this.value, 10) || 1);
        document.getElementById(`total-price-${foodId}`).textContent = (basePrice * quantity).toFixed(2);
      });
    });

    // Add product to cart
    document.querySelectorAll(".order-btn").forEach(button => {
      button.addEventListener("click", function () {
        const productId = this.dataset.id;
        const productType = this.dataset.type;
    
        let selectedProduct, totalPrice, quantity, size = "Medium"; // Default size
    
        if (productType === "drink") {
          selectedProduct = menu.drinks.find(d => d.id === productId);
          const sizeSelect = document.getElementById(`size-${productId}`);
          size = sizeSelect.value.charAt(0).toUpperCase() + sizeSelect.value.slice(1); // Capitalize first letter
          quantity = parseInt(document.getElementById(`drink-quantity-${productId}`).value, 10);
    
          // Calculate price based on size
          let price = selectedProduct.price;
          if (size === "Small") price -= 0.50;
          else if (size === "Large") price += 1.00;
    
          totalPrice = price * quantity;
        } else {
          selectedProduct = menu.foods.find(f => f.id === productId);
          quantity = parseInt(document.getElementById(`quantity-${productId}`).value, 10);
          totalPrice = selectedProduct.price * quantity;
        }
    
        const existingItem = cart.find(item => 
          item.productId === selectedProduct.id && 
          (productType === "food" || item.size === size) // Check size only for drinks
        );
    
        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.totalPrice += totalPrice;
          existingItem.price = totalPrice / existingItem.quantity; // Ensure price updates correctly
        } else {
          cart.push({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: totalPrice / quantity, // Store the correct price per item
            image: selectedProduct.image,
            size: size,
            quantity: quantity,
            totalPrice: totalPrice
          });
        }
    
        localStorage.setItem("cart", JSON.stringify(cart)); // Ensure the correct cart is saved
        updateCartQuantity(); // Update the cart quantity badge
        alert(`${selectedProduct.name} added to cart!`);
      });
    });
  }

  displayProducts();

  function updateCartQuantity() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll(".cart").forEach(cartButton => {
      cartButton.innerHTML = `
        <button>
          <i class="fa-solid fa-cart-shopping"></i>
          ${totalQuantity > 0 ? `<span class="cart-count">${totalQuantity}</span>` : ""}
        </button>
      `;
    });
  }
  
  // Ensure cart quantity updates when items are added
  updateCartQuantity();
});
