const promos = JSON.parse(localStorage.getItem("promos")) || [
  {
    title: "Buy 1 Get 1 Free",
    description: "Applies to all espresso drinks."

  },
  {
    title: "10% Off",
    description: "For customers who order online."
  },
  {
    title: "Happy Hour (2PM - 5PM)",
    description: "20% off on iced coffees."
  }
]

if (!localStorage.getItem("promos")) {
  localStorage.setItem("promos", JSON.stringify(promos));
}