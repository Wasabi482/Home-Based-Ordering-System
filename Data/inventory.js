const inventory = JSON.parse(localStorage.getItem("inventory")) || [
  { 
    name: "Coffee Beans", 
    stock: 10000 ,
    unit: "g"
  },
  { 
    name: "Milk", 
    stock: 50000,
    unit: "ml"
  },
  { 
    name: "Sugar", 
    stock: 10000,
    unit: "g"
  },
  {
    name: "Chocolate Syrup",
    stock: 50000,
    unit: "ml"
  },
  {
    name: "Ice Cubes",
    stock: 10000,
    unit: "pcs"
  },
  {
    name: "Dough",
    stock: 10000,
    unit: "g",
  },
  {
    name: "butter",
    stock: 10000,
    unit: "g"
  },
  {
    name: "Cheese",
    stock: 10000,
    unit: "g"
  },
  {
    name: "Chocolate Chip",
    stock: 1000,
    unit: "g"

  },
  {
    name: "Blueberry Filling",
    stock: 5000,
    unit: "ml"
  }
];
if (!localStorage.getItem("inventory")) {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}