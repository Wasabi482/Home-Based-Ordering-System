// data/cart.js

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify(cart));
}