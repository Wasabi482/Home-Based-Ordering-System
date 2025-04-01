document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("productsContainer");

  let menu = JSON.parse(localStorage.getItem("menu")) || [];

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
      </div>
  </div>
  `).join("");
}


displayProducts();


});