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


let index = 0;
const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".dot");

function showSlide(n) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
  });

  slides[n].classList.add("active");
  dots[n].classList.add("active");

  index = n;
}

function nextSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

function goToSlide(n) {
  showSlide(n);
}

// Auto-slide every 3 seconds
setInterval(nextSlide, 3000);

// Initialize first slide
showSlide(0);
});