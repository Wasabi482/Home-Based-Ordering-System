const users = JSON.parse(localStorage.getItem("users")) || [
  {
    image: "https://i.redd.it/yc40cow4tr691.png",
    name: "Paul Benedict Santos",
    email: "paulbenedicts482@gmail.com",
    password: "12345"

  },
  {
    image: "https://www.health.com/thmb/YXxmAuCsJHtTWvSWPorjVx1F7AQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Health-GettyImages-TypesOfCoffee-b8f6f7382a1443109f74edb1050f9808.jpg",
    name: "Therese Angelica Duritan",
    email: "angelicatherese96@gmail.com",
    password: "12345"
  }
]

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users));
}