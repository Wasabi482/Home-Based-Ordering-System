const recipes = JSON.parse(localStorage.getItem("recipes")) || {

  //coffeebeans, sugar, chocolateSyrupsyrup
  drinks: 
  {
    Espresso: 
    { 
      coffeeBeans: 10, 
      milk: 0, 
      sugar: 0, 
      chocolateSyrup: 0, 
      iceCubes: 0 
    },
    Cappuccino: 
    { 
      coffeeBeans: 8, 
      milk: 150, 
      sugar: 5, 
      chocolateSyrup: 0, 
      iceCubes: 0 
    },
    Latte: 
    { 
      coffeeBeans: 7, 
      milk: 200, 
      sugar: 5, 
      chocolateSyrup: 0, 
      iceCubes: 0 
    },
    IcedCoffee: 
    { 
      coffeeBeans: 7, 
      milk: 150, 
      sugar: 10, 
      chocolateSyrup: 0, 
      iceCubes: 5 
    },
    Mocha: 
    { 
      coffeeBeans: 7, 
      milk: 200, 
      sugar: 5, 
      chocolateSyrup: 20, 
      iceCubes: 0 
    }
  },
  foods: 
  {
    Croissant: 
    { 
      dough: 50,
      butter: 10,
      sugar: 5,
      cheese: 0,
      chocolateChip: 0,
      blueberryFilling: 0
    },
    BlueberryMuffin: 
    { 
      dough: 50, 
      butter: 10,
      sugar: 15,
      cheese: 0,
      chocolateChip: 0,
      blueberryFilling: 20
    },
    Cheesecake: 
    { 
      dough: 100,
      butter: 20,
      sugar: 15,
      cheese: 50,
      chocolateChip: 0,
      blueberryFilling: 0
    },
    chocolateChipCookie: 
    { 
      dough: 40,
      butter: 10,
      sugar: 10,
      cheese: 0,
      chocolateChip: 15,
      blueberryFilling: 0
    }
  }
};

localStorage.setItem("recipes", JSON.stringify(recipes));