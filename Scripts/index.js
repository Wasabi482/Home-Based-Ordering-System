// userOrder.js

document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("productsContainer");

  // Get the menu data from localStorage or fallback to default
  const menu = JSON.parse(localStorage.getItem("menu")) || {
    drinks: [],
    foods: []
  };

  // Function to display products (drinks and foods)
  function displayProducts() {
    // Combine both drinks and foods into a single array
    const combinedMenu = [...menu.drinks, ...menu.foods];

    // Map through the combined menu array to create product cards
    productContainer.innerHTML = combinedMenu.map((product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="content">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>$${product.price.toFixed(2)}</p>
        </div>
      </div>
    `).join("");
  }

  // Call the display function to show the products
  displayProducts();
});
