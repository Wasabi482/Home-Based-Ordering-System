const menu = (() => {
    // Load from localStorage and parse it
    let storedMenu = JSON.parse(localStorage.getItem("menu"));
  
    // Check if stored menu is valid, if not, use the default structure
    if (!storedMenu || !Array.isArray(storedMenu.drinks) || !Array.isArray(storedMenu.foods)) {
      // Set the default menu if data is invalid or missing
      storedMenu = {
    drinks: [
      {
        id: "m1",
        name: "Espresso",
        price: 3.50,
        category: "Coffee",
        image: "https://www.sharmispassions.com/wp-content/uploads/2012/07/espresso-coffee-recipe04.jpg",
        description: "Strong and bold single shot of espresso."
      },
      {
        id: "m2",
        name: "Cappuccino",
        price: 4.50,
        category: "Coffee",
        image: "https://ourhome.ph/cdn/shop/files/104897_PR_Barista_Noblesse_Cappcucino_Flat_White_SchwarzerPeter_04.png?v=1727085131&width=1200",
        description: "Espresso with steamed milk and foam."
      },
      {
        id: "m3",
        name: "Latte",
        price: 5.00,
        category: "Coffee",
        image: "https://www.foodandwine.com/thmb/CCe2JUHfjCQ44L0YTbCu97ukUzA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Partners-Latte-FT-BLOG0523-09569880de524fe487831d95184495cc.jpg",
        description: "Smooth espresso with steamed milk."
      },
      {
        id: "m4",
        name: "Iced Coffee",
        price: 4.00,
        category: "Cold Drinks",
        image: "https://frostingandfettuccine.com/wp-content/uploads/2022/12/Caramel-Iced-Coffee-6.jpg",
        description: "Chilled coffee served over ice."
      },
      {
        id: "m5",
        name: "Mocha",
        price: 5.50,
        category: "Coffee",
        image: "https://gatherforbread.com/wp-content/uploads/2014/10/Dark-Chocolate-Mocha-Square.jpg",
        description: "Espresso with chocolate and steamed milk."
      },
      {
        id: "m6",
        name: "Matcha Latte",
        price: 5.00,
        category: "Tea",
        image: "https://www.romylondonuk.com/wp-content/uploads/2022/04/Matcha-Latte-Starbucks-Recipe_17.jpg",
        description: "Creamy green tea latte with a hint of sweetness."
      }
    ],
    foods: [
      {
        id: "m7",
        name: "Croissant",
        price: 2.50,
        category: "Pastries",
        image: "https://sarahsvegankitchen.com/wp-content/uploads/2024/05/Vegan-Croissants-1.jpg",
        description: "Flaky and buttery classic French pastry."
      },
      {
        id: "m8",
        name: "Blueberry Muffin",
        price: 3.00,
        category: "Pastries",
        image: "https://www.theflavorbender.com/wp-content/uploads/2019/11/Blueberry-Muffins-Social-Media-4517-2.jpg",
        description: "Soft and sweet muffin loaded with blueberries."
      },
      {
        id: "m9",
        name: "Cheesecake",
        price: 4.50,
        category: "Desserts",
        image: "https://butternutbakeryblog.com/wp-content/uploads/2020/04/cheesecake-slice.jpg",
        description: "Rich and creamy cheesecake with a graham cracker crust."
      },
      {
        id: "m10",
        name: "Chocolate Chip Cookie",
        price: 2.00,
        category: "Desserts",
        image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/7/17/1/FN_Simple-Chocolate-Chip-Cookies_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1438794106265.webp",
        description: "Classic chocolate chip cookie with a crispy edge."
      }
    ]
  };
  
   // Save the default menu to localStorage
   localStorage.setItem("menu", JSON.stringify(storedMenu));
}

return storedMenu;
})();