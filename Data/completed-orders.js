const completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [
  { 
    orderId: "#00101", 
    customer: "Alice Green", 
    total: 12.00, 
    date: "2025-03-01",
    items: [
      { id: "m5", name: "Mocha", price: 5.50, quantity: 2 }
    ]
  },
  { 
    orderId: "#00102", 
    customer: "Bob White", 
    total: 8.50, 
    date: "2025-03-01",
    items: [
      { id: "m4", name: "Iced Coffee", price: 4.00, quantity: 1 },
      { id: "m10", name: "Chocolate Chip Cookie", price: 2.00, quantity: 2 }
    ]
  },
  { 
    orderId: "#00103", 
    customer: "Charlie Black", 
    total: 15.75, 
    date: "2025-03-02",
    items: [
      { id: "m2", name: "Cappuccino", price: 4.50, quantity: 1 },
      { id: "m9", name: "Cheesecake", price: 4.50, quantity: 2 }
    ]
  },
  { 
    orderId: "#00104", 
    customer: "Daniel Red", 
    total: 9.00, 
    date: "2025-03-02",
    items: [
      { id: "m6", name: "Matcha Latte", price: 5.00, quantity: 1 },
      { id: "m7", name: "Croissant", price: 2.50, quantity: 1 }
    ]
  },
  { 
    orderId: "#00105", 
    customer: "Eva Blue", 
    total: 11.25, 
    date: "2025-03-03",
    items: [
      { id: "m3", name: "Latte", price: 5.00, quantity: 2 }
    ]
  },
  { 
    orderId: "#00106", 
    customer: "Frank Gray",
    total: 7.80, 
    date: "2025-03-03",
    items: [
      { id: "m1", name: "Espresso", price: 3.50, quantity: 1 },
      { id: "m10", name: "Chocolate Chip Cookie", price: 2.00, quantity: 2 }
    ]
  },
  { 
    orderId: "#00107", 
    customer: "Grace Yellow", 
    total: 20.00, 
    date: "2025-03-04",
    items: [
      { id: "m9", name: "Cheesecake", price: 4.50, quantity: 4 }
    ]
  },
  { 
    orderId: "#00108", 
    customer: "Henry Violet", 
    total: 5.50, 
    date: "2025-03-04",
    items: [
      { id: "m2", name: "Cappuccino", price: 4.50, quantity: 1 }
    ]
  },
  { 
    orderId: "#00109", 
    customer: "Ivy Orange", 
    total: 14.25, 
    date: "2025-03-05",
    items: [
      { id: "m5", name: "Mocha", price: 5.50, quantity: 2 }
    ]
  },
  { 
    orderId: "#00110", 
    customer: "Jack Cyan", 
    total: 10.75, 
    date: "2025-03-05",
    items: [
      { id: "m4", name: "Iced Coffee", price: 4.00, quantity: 1 },
      { id: "m8", name: "Blueberry Muffin", price: 3.00, quantity: 2 }
    ]
  }
];

if (!localStorage.getItem("completedOrders")) {
  localStorage.setItem("completedOrders", JSON.stringify(completedOrders));
}