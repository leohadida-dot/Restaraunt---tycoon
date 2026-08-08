let game = {
  cash: 10000,
  customers: 0,
  rating: 3.5,
  chefs: 1,
  waiters: 1,
  level: 1,
  xp: 0,
  xpNeeded: 100,

  tables: 3,
  kitchen: 1,
  decor: 1,

  day: 1,
  dayCustomers: 0,
  dayRevenue: 0,
  dailyGoal: 20,
  secondsLeft: 60,

  revenue: 0,
  ingredients: 0,
  wages: 0,
  electricity: 0,
  rent: 0,

  currentLocation: "city",
  open: false,

  locations: {
    city: true,
    beach: false,
    mall: false,
    airport: false,
    downtown: false
  },

  foods: {
    burger: true,
    fries: true,
    drink: true,
    pizza: false,
    tacos: false,
    chicken: false,
    pasta: false,
    cake: false
  },

  achievements: {
    firstCustomer: false,
    hundredCustomers: false,
    levelFive: false,
    rich: false,
    fiveLocations: false,
    foodMaster: false,
    ratingFive: false,
    millionaire: false
  }
};

const locations = {
  city: {
    name: "📍 City Centre",
    restaurant: "Leo's Burger House",
    price: 0,
    multiplier: 1,
    rent: 100
  },

  beach: {
    name: "🏖️ Beachfront",
    restaurant: "Leo's Beach Grill",
    price: 15000,
    multiplier: 1.4,
    rent: 150
  },

  mall: {
    name: "🏬 Shopping Centre",
    restaurant: "Leo's Food Court",
    price: 30000,
    multiplier: 1.8,
    rent: 250
  },

  airport: {
    name: "✈️ Airport",
    restaurant: "Leo's Airport Kitchen",
    price: 60000,
    multiplier: 2.3,
    rent: 400
  },

  downtown: {
    name: "🌆 Downtown",
    restaurant: "Leo's Downtown",
    price: 120000,
    multiplier: 3,
    rent: 600
  }
};

const foods = {
  burger: {
    name: "🍔 Classic Burger",
    price: 14,
    cost: 4,
    unlock: 0
  },

  fries: {
    name: "🍟 Fries",
    price: 6,
    cost: 1.5,
    unlock: 0
  },

  drink: {
    name: "🥤 Soft Drink",
    price: 5,
    cost: 1,
    unlock: 0
  },

  pizza: {
    name: "🍕 Pizza",
    price: 18,
    cost: 5,
    unlock: 2000
  },

  tacos: {
    name: "🌮 Tacos",
    price: 17,
    cost: 4,
    unlock: 3500
  },

  chicken: {
    name: "🍗 Chicken",
    price: 22,
    cost: 6,
    unlock: 5000
  },

  pasta: {
    name: "🍝 Pasta",
    price: 25,
    cost: 7,
    unlock: 7500
  },

  cake: {
    name: "🍰 Cake",
    price: 12,
    cost: 2.5,
    unlock: 10000
  }
};

const reviews = [
  "🍔 Amazing food!",
  "😍 I'll definitely come back!",
  "⭐ Fantastic restaurant!",
  "🍟 The fries were incredible!",
  "😊 Friendly staff!",
  "🤩 One of my favourite restaurants!",
  "😋 Really tasty!",
  "👍 Great value!",
  "🔥 Amazing kitchen!",
  "❤️ Loved the atmosphere!"
];

const achievements = [
  ["firstCustomer", "👤", "First Customer", "Serve 1 customer"],
  ["hundredCustomers", "💯", "Busy Restaurant", "Serve 100 customers"],
  ["levelFive", "🏆", "Rising Star", "Reach Level 5"],
  ["rich", "💰", "Getting Rich", "Have $50,000"],
  ["fiveLocations", "🗺️", "Empire Builder", "Own every location"],
  ["foodMaster", "🍽️", "Food Master", "Unlock every food"],
  ["ratingFive", "⭐", "Five Stars", "Reach a 5-star rating"],
  ["millionaire", "💎", "Millionaire", "Have $1,000,000"]
];

let restaurantTimer = null;
let dayTimer = null;


/* =========================
   MONEY
========================= */

function money(number) {
  return "$" + Math.max(0, Math.round(number)).toLocaleString();
}


/* =========================
   MAIN DISPLAY
========================= */

function updateDisplay() {

  document.getElementById("cash").textContent = money(game.cash);
  document.getElementById("customers").textContent = game.customers;
  document.getElementById("rating").textContent = game.rating.toFixed(1);
  document.getElementById("level").textContent = game.level;

  document.getElementById("xpLevel").textContent = game.level;
  document.getElementById("xp").textContent = game.xp;
  document.getElementById("xpNeeded").textContent = game.xpNeeded;

  document.getElementById("currentDay").textContent = game.day;
  document.getElementById("timeLeft").textContent = game.secondsLeft + "s";
  document.getElementById("dailyGoal").textContent = game.dailyGoal;

  document.getElementById("dashboardRevenue").textContent =
    money(game.revenue);

  document.getElementById("dashboardCustomers").textContent =
    game.customers;

  const average =
    game.customers > 0
      ? game.revenue / game.customers
      : 0;

  document.getElementById("averageSpend").textContent =
    money(average);

  document.getElementById("chefs").textContent = game.chefs;
  document.getElementById("waiters").textContent = game.waiters;

  document.getElementById("sceneChefs").textContent = game.chefs;
  document.getElementById("sceneWaiters").textContent = game.waiters;
  document.getElementById("sceneTables").textContent = game.tables;

  document.getElementById("tableLevel").textContent = game.tables;
  document.getElementById("kitchenLevel").textContent = game.kitchen;
  document.getElementById("decorLevel").textContent = game.decor;

  document.getElementById("revenue").textContent = money(game.revenue);
  document.getElementById("ingredients").textContent = money(game.ingredients);
  document.getElementById("wages").textContent = money(game.wages);
  document.getElementById("electricity").textContent = money(game.electricity);
  document.getElementById("rent").textContent = money(game.rent);

  const profit =
    game.revenue -
    game.ingredients -
    game.wages -
    game.electricity -
    game.rent;

  document.getElementById("profit").textContent = money(profit);

  const xpPercent =
    Math.min(100, (game.xp / game.xpNeeded) * 100);

  document.getElementById("xpFill").style.width =
    xpPercent + "%";

  updateRestaurant();
  updateMenu();
  updateFoodUnlocks();
  updateLocations();
  updateUpgrades();
  updateAchievements();
}


/* =========================
   RESTAURANT
========================= */

function updateRestaurant() {

  const location = locations[game.currentLocation];

  document.getElementById("restaurantName").textContent =
    location.restaurant;

  document.getElementById("locationName").textContent =
    location.name;

  const status = document.getElementById("status");
  const button = document.getElementById("openButton");

  if (game.open) {

    status.textContent = "🟢 OPEN";
    status.className = "open";

    button.textContent = "🔴 CLOSE RESTAURANT";

  } else {

    status.textContent = "🔴 CLOSED";
    status.className = "closed";

    button.textContent = "🍔 OPEN RESTAURANT";
  }
}


/* =========================
   OPEN / CLOSE
========================= */

function toggleRestaurant() {

  game.open = !game.open;

  if (game.open) {
    startRestaurant();
  } else {
    stopRestaurant();
  }

  updateDisplay();
}


function startRestaurant() {

  if (restaurantTimer) return;

  if (!dayTimer) {
    startDay();
  }

  restaurantTimer = setInterval(
    serveCustomers,
    2500
  );
}


function stopRestaurant() {

  clearInterval(restaurantTimer);

  restaurantTimer = null;
}


/* =========================
   CUSTOMERS
========================= */

function serveCustomers() {

  if (!game.open) return;

  const location =
    locations[game.currentLocation];

  const capacity =
    Math.max(
      1,
      game.tables +
      game.waiters +
      game.kitchen
    );

  const customers =
    Math.floor(
      Math.random() *
      Math.min(capacity, 6)
    ) + 1;

  const availableFoods =
    Object.keys(foods)
      .filter(key => game.foods[key]);

  let revenue = 0;
  let ingredients = 0;

  for (let i = 0; i < customers; i++) {

    const foodKey =
      availableFoods[
        Math.floor(
          Math.random() *
          availableFoods.length
        )
      ];

    const food = foods[foodKey];

    revenue += food.price;
    ingredients += food.cost;
  }

  /* STAFF COST */

  const wages =
    game.chefs * 1 +
    game.waiters * 0.5;

  const electricity = 1;


  /* IMPORTANT:
     CUSTOMERS ALWAYS MAKE
     MORE THAN THEY COST.
  */

  const profit =
    revenue -
    ingredients -
    wages -
    electricity;


  game.customers += customers;
  game.dayCustomers += customers;

  game.revenue += revenue;
  game.dayRevenue += revenue;

  game.ingredients += ingredients;
  game.wages += wages;
  game.electricity += electricity;

  /* NEVER LOSE MONEY */

  game.cash =
    Math.max(
      0,
      game.cash + profit
    );

  /* EXTRA PROFIT BONUS */

  game.cash +=
    Math.max(
      1,
      Math.floor(profit * 0.25)
    );


  /* XP */

  game.xp += customers * 5;

  levelUp();


  /* RATING */

  game.rating +=
    0.01 +
    game.decor * 0.005;

  game.rating =
    Math.min(
      5,
      game.rating
    );


  /* REVIEW */

  if (Math.random() < 0.2) {
    addReview();
  }


  checkAchievements();
  updateDisplay();
}


/* =========================
   DAYS
========================= */

function startDay() {

  game.secondsLeft = 60;

  dayTimer = setInterval(() => {

    game.secondsLeft--;

    if (game.secondsLeft <= 0) {
      finishDay();
    }

    updateDisplay();

  }, 1000);
}


function finishDay() {

  clearInterval(dayTimer);

  dayTimer = null;

  const location =
    locations[game.currentLocation];

  /* RENT IS NOW SMALL */

  const rent =
    Math.min(
      location.rent,
      Math.floor(game.dayRevenue * 0.08)
    );

  game.rent += rent;

  game.cash =
    Math.max(
      0,
      game.cash - rent
    );


  const completed =
    game.dayCustomers >=
    game.dailyGoal;


  let bonus = 0;


  if (completed) {

    bonus =
      500 +
      game.level * 100;

    game.cash += bonus;
  }


  document.getElementById(
    "daySummary"
  ).innerHTML =

    "👥 Customers: <strong>" +
    game.dayCustomers +
    "</strong><br><br>" +

    "💵 Revenue: <strong>" +
    money(game.dayRevenue) +
    "</strong><br><br>" +

    "🏠 Rent: <strong>" +
    money(rent) +
    "</strong><br><br>" +

    (
      completed
        ? "🎯 <strong>GOAL COMPLETE!</strong><br>" +
          "💰 Bonus: " +
          money(bonus)
        : "Keep going! You can beat the goal tomorrow."
    );


  document.getElementById(
    "dayModal"
  ).classList.remove("hidden");


  game.day++;

  game.dayCustomers = 0;
  game.dayRevenue = 0;

  game.dailyGoal =
    Math.floor(
      game.dailyGoal * 1.15
    );

  game.secondsLeft = 60;

  saveGame();
}


function closeDayModal() {

  document.getElementById(
    "dayModal"
  ).classList.add("hidden");

  if (game.open) {
    startDay();
  }

  updateDisplay();
}


/* =========================
   LEVELS
========================= */

function levelUp() {

  while (
    game.xp >= game.xpNeeded
  ) {

    game.xp -= game.xpNeeded;

    game.level++;

    game.xpNeeded =
      Math.floor(
        game.xpNeeded * 1.4
      );

    /* LEVEL BONUS */

    const bonus =
      game.level * 500;

    game.cash += bonus;
  }
}


/* =========================
   MENU
========================= */

function updateMenu() {

  const menu =
    document.getElementById("menu");

  menu.innerHTML = "";

  Object.keys(foods)
    .filter(key => game.foods[key])
    .forEach(key => {

      const food = foods[key];

      const item =
        document.createElement("p");

      item.innerHTML =
        "<span>" +
        food.name +
        "</span>" +

        "<span>" +
        money(food.price) +
        "</span>";

      menu.appendChild(item);
    });
}


/* =========================
   FOOD
========================= */

function updateFoodUnlocks() {

  const box =
    document.getElementById("foodUnlocks");

  box.innerHTML = "";

  Object.keys(foods)
    .filter(key => !game.foods[key])
    .forEach(key => {

      const food = foods[key];

      const div =
        document.createElement("div");

      div.className = "food-item";

      div.innerHTML =
        "<h3>" +
        food.name +
        "</h3>" +

        "<p>Sell for " +
        money(food.price) +
        "</p>" +

        "<button onclick=\"unlockFood('" +
        key +
        "')\">" +

        "Unlock " +
        money(food.unlock) +

        "</button>";

      box.appendChild(div);
    });


  if (!box.innerHTML) {

    box.innerHTML =
      "<div class='food-item'>" +
      "🏆 ALL FOOD UNLOCKED!" +
      "</div>";
  }
}


function unlockFood(key) {

  const food = foods[key];

  if (game.cash < food.unlock) {

    alert(
      "You need " +
      money(food.unlock) +
      " to unlock this."
    );

    return;
  }

  game.cash -= food.unlock;

  game.foods[key] = true;

  updateDisplay();
}


/* =========================
   STAFF
========================= */

function hireChef() {

  const price =
    500 +
    game.chefs * 250;

  if (game.cash < price) {

    alert("Not enough money!");

    return;
  }

  game.cash -= price;
  game.chefs++;

  updateDisplay();
}


function hireWaiter() {

  const price =
    300 +
    game.waiters * 150;

  if (game.cash < price) {

    alert("Not enough money!");

    return;
  }

  game.cash -= price;
  game.waiters++;

  updateDisplay();
}


/* =========================
   UPGRADES
========================= */

function upgradeTables() {

  const price =
    game.tables * 750;

  if (game.cash < price) {

    alert("Not enough money!");

    return;
  }

  game.cash -= price;
  game.tables++;

  updateDisplay();
}


function upgradeKitchen() {

  const price =
    game.kitchen * 1000;

  if (game.cash < price) {

    alert("Not enough money!");

    return;
  }

  game.cash -= price;
  game.kitchen++;

  updateDisplay();
}


function upgradeDecor() {

  const price =
    game.decor * 500;

  if (game.cash < price) {

    alert("Not enough money!");

    return;
  }

  game.cash -= price;
  game.decor++;

  updateDisplay();
}


function updateUpgrades() {

  document.getElementById("tablePrice").textContent =
    (game.tables * 750).toLocaleString();

  document.getElementById("kitchenPrice").textContent =
    (game.kitchen * 1000).toLocaleString();

  document.getElementById("decorPrice").textContent =
    (game.decor * 500).toLocaleString();
}


/* =========================
   LOCATIONS
========================= */

function updateLocations() {

  const box =
    document.getElementById("locations");

  box.innerHTML = "";

  Object.keys(locations).forEach(key => {

    const location =
      locations[key];

    const div =
      document.createElement("div");

    div.className = "location";


    if (
      key === game.currentLocation
    ) {

      div.innerHTML =
        "<h3>" +
        location.name +
        "</h3>" +

        "<p>" +
        location.restaurant +
        "</p>" +

        "<strong>🟢 CURRENT</strong>";

    }

    else if (
      game.locations[key]
    ) {

      div.innerHTML =
        "<h3>" +
        location.name +
        "</h3>" +

        "<p>Owned location</p>" +

        "<button onclick=\"switchLocation('" +
        key +
        "')\">" +

        "TRAVEL HERE" +

        "</button>";

    }

    else {

      div.innerHTML =
        "<h3>" +
        location.name +
        "</h3>" +

        "<p>💰 " +
        money(location.price) +
        "</p>" +

        "<button onclick=\"buyLocation('" +
        key +
        "')\">" +

        "BUY LOCATION" +

        "</button>";
    }

    box.appendChild(div);
  });
}


function buyLocation(key) {

  const location =
    locations[key];

  if (game.cash < location.price) {

    alert(
      "You need " +
      money(location.price) +
      "!"
    );

    return;
  }

  game.cash -= location.price;

  game.locations[key] = true;

  game.currentLocation = key;

  checkAchievements();
  updateDisplay();
}


function switchLocation(key) {

  if (!game.locations[key]) return;

  game.currentLocation = key;

  updateDisplay();
}


/* =========================
   REVIEWS
========================= */

function addReview() {

  const box =
    document.getElementById("reviews");

  const empty =
    box.querySelector(".empty");

  if (empty) {
    empty.remove();
  }

  const review =
    reviews[
      Math.floor(
        Math.random() *
        reviews.length
      )
    ];

  const div =
    document.createElement("div");

  div.className = "review";

  div.textContent = review;

  box.prepend(div);

  while (
    box.children.length > 5
  ) {
    box.lastElementChild.remove();
  }
}


/* =========================
   ACHIEVEMENTS
========================= */

function checkAchievements() {

  if (game.customers >= 1)
    game.achievements.firstCustomer = true;

  if (game.customers >= 100)
    game.achievements.hundredCustomers = true;

  if (game.level >= 5)
    game.achievements.levelFive = true;

  if (game.cash >= 50000)
    game.achievements.rich = true;

  const locationsOwned =
    Object.values(game.locations)
      .filter(Boolean).length;

  if (locationsOwned >= 5)
    game.achievements.fiveLocations = true;

  const foodsOwned =
    Object.values(game.foods)
      .filter(Boolean).length;

  if (
    foodsOwned ===
    Object.keys(game.foods).length
  ) {
    game.achievements.foodMaster = true;
  }

  if (game.rating >= 5)
    game.achievements.ratingFive = true;

  if (game.cash >= 1000000)
    game.achievements.millionaire = true;
}


function updateAchievements() {

  const box =
    document.getElementById("achievements");

  box.innerHTML = "";

  achievements.forEach(a => {

    const unlocked =
      game.achievements[a[0]];

    const div =
      document.createElement("div");

    div.className =
      unlocked
        ? "achievement"
        : "achievement locked";

    div.innerHTML =
      "<div class='achievement-icon'>" +
      a[1] +
      "</div>" +

      "<h3>" +
      a[2] +
      "</h3>" +

      "<p>" +
      a[3] +
      "</p>" +

      "<strong>" +
      (
        unlocked
          ? "✅ UNLOCKED"
          : "🔒 LOCKED"
      ) +
      "</strong>";

    box.appendChild(div);
  });
}


/* =========================
   SAVE
========================= */

function saveGame() {

  localStorage.setItem(
    "leoRestaurantTycoon",
    JSON.stringify(game)
  );
}


function loadGame() {

  const saved =
    localStorage.getItem(
      "leoRestaurantTycoon"
    );

  if (!saved) {

    updateDisplay();

    return;
  }

  try {

    const savedGame =
      JSON.parse(saved);

    game =
      Object.assign(
        game,
        savedGame
      );

  } catch {
    console.log("Save error");
  }

  updateDisplay();
}


/* =========================
   NEW GAME
========================= */

function newGame() {

  if (
    !confirm(
      "Start a completely new restaurant?"
    )
  ) {
    return;
  }

  localStorage.removeItem(
    "leoRestaurantTycoon"
  );

  location.reload();
}


/* =========================
   AUTO SAVE
========================= */

setInterval(() => {

  saveGame();

}, 10000);


/* =========================
   START
========================= */

loadGame();
updateDisplay();
