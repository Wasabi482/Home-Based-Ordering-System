const inventory = JSON.parse(localStorage.getItem("inventory")) || [
  { 
    name: "coffeeBeans", 
    stock: 10000,
    maxStock: 20000, // 20kg max
    unit: "g"
  },
  { 
    name: "milk", 
    stock: 50000,
    maxStock: 100000, // 100L max
    unit: "ml"
  },
  { 
    name: "sugar", 
    stock: 10000,
    maxStock: 30000, // 30kg max
    unit: "g"
  },
  {
    name: "chocolateSyrup",
    stock: 50000,
    maxStock: 75000, // 75L max
    unit: "ml"
  },
  {
    name: "iceCubes",
    stock: 10000,
    maxStock: 30000, // 30k pcs max
    unit: "pcs"
  },
  {
    name: "dough",
    stock: 10000,
    maxStock: 25000, // 25kg max
    unit: "g"
  },
  {
    name: "butter",
    stock: 10000,
    maxStock: 20000, // 20kg max
    unit: "g"
  },
  {
    name: "cheese",
    stock: 10000,
    maxStock: 15000, // 15kg max
    unit: "g"
  },
  {
    name: "chocolateChip",
    stock: 5000,
    maxStock: 5000, // 5kg max
    unit: "g"
  },
  {
    name: "blueberryFilling",
    stock: 10000,
    maxStock: 10000, // 10L max
    unit: "ml"
  }
];

if (!localStorage.getItem("inventory")) {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}
