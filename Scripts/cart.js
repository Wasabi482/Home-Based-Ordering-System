// Retrieve cart items from localStorage (if any)
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// Set the delivery fee (constant for now)
const DELIVERY_FEE = 5.00;

// Select DOM elements
const cartItemsContainer = document.getElementById("cartItemsContainer");
const subtotalElement = document.getElementById("subtotal");
const totalAmountElement = document.getElementById("totalAmount");
const proceedOrderBtn = document.getElementById("proceedOrderBtn");
const amountInput = document.getElementById("amount-input");
const gcashError = document.getElementById("gcash-error");
const cashRadio = document.getElementById("payment-method-cash");
const gcashRadio = document.getElementById("payment-method-gcash");
const amountLabel = document.getElementById("amount-label");  // Select the label for amount input

// Function to render cart items
function renderCartItems() {
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    proceedOrderBtn.disabled = true; // Disable the proceed button if the cart is empty
    return;
  }

  // Clear the container before rendering
  cartItemsContainer.innerHTML = "";

  // Initialize the subtotal
  let subtotal = 0;

  // Loop through cart items and create HTML dynamically
  cartItems.forEach(item => {
    const itemContainer = document.createElement("div");

    // Price for the item taking size and quantity into account
    const itemPrice = item.price * item.quantity;

    // Add item details to the container
    itemContainer.innerHTML = `
      <div class="items-card">
        <div class="image">
          <img src="${item.image}">
        </div>
        <div class="info">
          <div class="details">
            <h5>${item.name}</h5>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <div class="price">
            <p>Base Price: $${item.price.toFixed(2)}</p>
            <p>Total: $${itemPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    `;

    // Append to the container
    cartItemsContainer.appendChild(itemContainer);

    // Add to the subtotal
    subtotal += itemPrice;
  });

  // Update subtotal
  subtotalElement.innerText = subtotal.toFixed(2);

  // Calculate and update total price (subtotal + delivery fee)
  const totalPrice = subtotal + DELIVERY_FEE;
  totalAmountElement.innerText = totalPrice.toFixed(2);

  // Enable the proceed button if there are items in the cart
  proceedOrderBtn.disabled = false;
}

// Function to proceed with the order
function proceedWithOrder() {
  // Get customer information from localStorage (if any) or prompt the user
  const customer = prompt("Enter your name for the order:");

  if (!customer) {
    alert("Order cannot proceed without a customer name.");
    return;
  }

  // Generate a unique order ID (simple implementation for now)
  const orderId = "#" + Math.floor(Math.random() * 100000).toString().padStart(5, "0");

  // Calculate total price (subtotal + delivery fee)
  const subtotal = parseFloat(subtotalElement.innerText);
  const total = subtotal + DELIVERY_FEE;

  // Create a new order object
  const newOrder = {
    orderId: orderId,
    customer: customer,
    total: total,
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  };

  // Get the current pending orders from localStorage
  const pendingOrders = JSON.parse(localStorage.getItem("pendingOrders")) || [];

  // Add the new order to the pending orders list
  pendingOrders.push(newOrder);

  // Store the updated pending orders in localStorage
  localStorage.setItem("pendingOrders", JSON.stringify(pendingOrders));

  // ✅ FIX: Clear cart data from localStorage correctly
  localStorage.removeItem("cart"); // Remove stored cart data

  // ✅ FIX: Clear cartItems array in memory
  cartItems = []; // Reset cartItems array

  // ✅ FIX: Re-render the cart to show it's empty
  renderCartItems();

  // Update cart icon after clearing the cart
  updateCartQuantity();

  // Redirect to a confirmation page (or show a success message)
  alert("Order placed successfully! You will be redirected.");
  window.location.href = "../Pages/order-confirmation.html"; // Redirect to a confirmation page
}

// Event listener for the "Proceed with Order" button
proceedOrderBtn.addEventListener("click", proceedWithOrder);

// Function to update cart icon quantity
function updateCartQuantity() {
  let totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  let cartButton = document.querySelector(".cart");

  if (cartButton) {
    cartButton.innerHTML = `
      <button>
        <i class="fa-solid fa-cart-shopping"></i>
        ${totalQuantity > 0 ? `<span class="cart-count">${totalQuantity}</span>` : ""}
      </button>
    `;
  }
}

// Function to handle payment method validation
function handlePaymentValidation() {
  const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

  if (selectedPaymentMethod === "gcash") {
    const amount = parseFloat(amountInput.value);
    const totalAmount = parseFloat(totalAmountElement.innerText);

    if (amount !== totalAmount) {
      gcashError.style.display = "block";
      proceedOrderBtn.disabled = true;
    } else {
      gcashError.style.display = "none";
      proceedOrderBtn.disabled = false;
    }

    // Show the amount input field for GCash only
    amountInput.style.display = "block";
    amountLabel.style.display = "block";  // Show the label when GCash is selected
  } else {
    gcashError.style.display = "none";
    proceedOrderBtn.disabled = false;

    // Hide the amount input field when cash is selected
    amountInput.style.display = "none";
    amountLabel.style.display = "none";  // Hide the label when Cash is selected
  }
}

// Event listener for payment method selection
document.querySelectorAll('input[name="payment-method"]').forEach(input => {
  input.addEventListener("change", handlePaymentValidation);
});

// Event listener for the amount input field
amountInput.addEventListener("input", handlePaymentValidation);

// Render the cart items when the page loads
renderCartItems();
updateCartQuantity();
