const recipes = JSON.parse(localStorage.getItem("recipes")) || {
  drinks: [
    {
      name: "Espresso",
      ingredients: {
        coffeeBeans: 10,
        milk: 0,
        sugar: 0,
        chocolateSyrup: 0,
        iceCubes: 0
      }
    },
    {
      name: "Cappuccino",
      ingredients: {
        coffeeBeans: 8,
        milk: 150,
        sugar: 5,
        chocolateSyrup: 0,
        iceCubes: 0
      }
    },
    {
      name: "Latte",
      ingredients: {
        coffeeBeans: 7,
        milk: 200,
        sugar: 5,
        chocolateSyrup: 0,
        iceCubes: 0
      }
    },
    {
      name: "Iced Coffee",
      ingredients: {
        coffeeBeans: 7,
        milk: 150,
        sugar: 10,
        chocolateSyrup: 0,
        iceCubes: 5
      }
    },
    {
      name: "Mocha",
      ingredients: {
        coffeeBeans: 7,
        milk: 200,
        sugar: 5,
        chocolateSyrup: 20,
        iceCubes: 0
      }
    }
  ],
  foods: [
    {
      name: "Croissant",
      ingredients: {
        dough: 50,
        butter: 10,
        sugar: 5,
        cheese: 0,
        chocolateChip: 0,
        blueberryFilling: 0
      }
    },
    {
      name: "Blueberry Muffin",
      ingredients: {
        dough: 50,
        butter: 10,
        sugar: 15,
        cheese: 0,
        chocolateChip: 0,
        blueberryFilling: 20
      }
    },
    {
      name: "Cheesecake",
      ingredients: {
        dough: 100,
        butter: 20,
        sugar: 15,
        cheese: 50,
        chocolateChip: 0,
        blueberryFilling: 0
      }
    },
    {
      name: "Chocolate Chip Cookie",
      ingredients: {
        dough: 40,
        butter: 10,
        sugar: 10,
        cheese: 0,
        chocolateChip: 15,
        blueberryFilling: 0
      }
    }
  ]
};

if (!localStorage.getItem("recipes")) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}


