const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");
require("dotenv").config();

const menuItems = [
  // ─── BURGERS ───────────────────────────────────────────────
  {
    name: "Classic Smash Burger",
    description: "Juicy smashed beef patty with cheddar, lettuce, tomato & special sauce",
    price: 249, discount: 0, category: "Burgers", isVeg: false, spicyLevel: 1,
    preparationTime: 12, stock: 80, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 210,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Double Cheese Burger",
    description: "Two beef patties loaded with double cheddar, pickles & mustard",
    price: 319, discount: 10, category: "Burgers", isVeg: false, spicyLevel: 1,
    preparationTime: 14, stock: 60, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 185,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Crispy Chicken Burger",
    description: "Golden fried chicken fillet with coleslaw & honey mustard",
    price: 279, discount: 5, category: "Burgers", isVeg: false, spicyLevel: 2,
    preparationTime: 15, stock: 70, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 160,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop&auto=format",
    tag: "Spicy"
  },
  {
    name: "Veggie Delight Burger",
    description: "Crispy aloo tikki patty with mint chutney, onion & tomato",
    price: 199, discount: 0, category: "Burgers", isVeg: true, spicyLevel: 1,
    preparationTime: 10, stock: 90, inStock: true, isAvailable: true, rating: 4.4, ratingCount: 130,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop&auto=format",
    tag: "Veg"
  },
  {
    name: "BBQ Bacon Burger",
    description: "Smoky BBQ sauce, crispy bacon, caramelized onions & Swiss cheese",
    price: 349, discount: 0, category: "Burgers", isVeg: false, spicyLevel: 1,
    preparationTime: 16, stock: 50, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 220,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop&auto=format",
    tag: "Chef's Special"
  },
  {
    name: "Mushroom Swiss Burger",
    description: "Sautéed mushrooms, Swiss cheese & garlic aioli on a brioche bun",
    price: 299, discount: 0, category: "Burgers", isVeg: false, spicyLevel: 0,
    preparationTime: 14, stock: 55, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 98,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Spicy Jalapeño Burger",
    description: "Fiery jalapeños, pepper jack cheese & chipotle mayo",
    price: 289, discount: 0, category: "Burgers", isVeg: false, spicyLevel: 3,
    preparationTime: 13, stock: 45, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 112,
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop&auto=format",
    tag: "Extra Spicy"
  },

  // ─── PIZZA ─────────────────────────────────────────────────
  {
    name: "Margherita Pizza",
    description: "Classic tomato base, fresh mozzarella & basil on thin crust",
    price: 299, discount: 0, category: "Pizza", isVeg: true, spicyLevel: 0,
    preparationTime: 20, stock: 100, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 300,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop&auto=format",
    tag: "Classic"
  },
  {
    name: "Pepperoni Feast Pizza",
    description: "Loaded with spicy pepperoni, mozzarella & oregano",
    price: 399, discount: 10, category: "Pizza", isVeg: false, spicyLevel: 2,
    preparationTime: 22, stock: 80, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 410,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "BBQ Chicken Pizza",
    description: "Smoky BBQ sauce, grilled chicken, red onion & coriander",
    price: 379, discount: 5, category: "Pizza", isVeg: false, spicyLevel: 1,
    preparationTime: 22, stock: 75, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 275,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Paneer Tikka Pizza",
    description: "Tandoori paneer, capsicum, onion & tikka sauce on thick crust",
    price: 349, discount: 0, category: "Pizza", isVeg: true, spicyLevel: 2,
    preparationTime: 20, stock: 85, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 190,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&auto=format",
    tag: "Veg Special"
  },
  {
    name: "Four Cheese Pizza",
    description: "Mozzarella, cheddar, parmesan & gouda on a creamy white base",
    price: 429, discount: 0, category: "Pizza", isVeg: true, spicyLevel: 0,
    preparationTime: 22, stock: 60, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 155,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=400&fit=crop&auto=format",
    tag: "Chef's Special"
  },
  {
    name: "Veggie Supreme Pizza",
    description: "Bell peppers, mushrooms, olives, corn & jalapeños",
    price: 329, discount: 0, category: "Pizza", isVeg: true, spicyLevel: 1,
    preparationTime: 20, stock: 90, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 140,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Spicy Chicken Tikka Pizza",
    description: "Fiery chicken tikka, green chillies & mint drizzle",
    price: 389, discount: 15, category: "Pizza", isVeg: false, spicyLevel: 3,
    preparationTime: 23, stock: 65, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 178,
    image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&h=400&fit=crop&auto=format",
    tag: "Spicy"
  },

  // ─── PASTA ─────────────────────────────────────────────────
  {
    name: "Spaghetti Bolognese",
    description: "Classic Italian meat sauce with spaghetti & parmesan",
    price: 299, discount: 0, category: "Pasta", isVeg: false, spicyLevel: 0,
    preparationTime: 18, stock: 70, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 165,
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&h=400&fit=crop&auto=format",
    tag: "Classic"
  },
  {
    name: "Penne Arrabbiata",
    description: "Spicy tomato sauce with garlic, chilli flakes & fresh basil",
    price: 269, discount: 0, category: "Pasta", isVeg: true, spicyLevel: 2,
    preparationTime: 15, stock: 80, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 120,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop&auto=format",
    tag: "Spicy"
  },
  {
    name: "Creamy Chicken Alfredo",
    description: "Fettuccine in rich parmesan cream sauce with grilled chicken",
    price: 329, discount: 5, category: "Pasta", isVeg: false, spicyLevel: 0,
    preparationTime: 18, stock: 65, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 200,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Mushroom Pesto Pasta",
    description: "Basil pesto, sautéed mushrooms & cherry tomatoes",
    price: 289, discount: 0, category: "Pasta", isVeg: true, spicyLevel: 0,
    preparationTime: 15, stock: 75, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 98,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Mac & Cheese",
    description: "Creamy four-cheese macaroni baked to golden perfection",
    price: 249, discount: 0, category: "Pasta", isVeg: true, spicyLevel: 0,
    preparationTime: 20, stock: 90, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 230,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&h=400&fit=crop&auto=format",
    tag: "Kids Favourite"
  },
  {
    name: "Prawn Aglio Olio",
    description: "Juicy prawns, garlic, olive oil & parsley on spaghetti",
    price: 379, discount: 0, category: "Pasta", isVeg: false, spicyLevel: 1,
    preparationTime: 18, stock: 50, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 110,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop&auto=format",
    tag: "Seafood"
  },

  // ─── INDIAN ────────────────────────────────────────────────
  {
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato-butter gravy, best with naan",
    price: 329, discount: 0, category: "Indian", isVeg: false, spicyLevel: 1,
    preparationTime: 20, stock: 100, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 520,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes in creamy tomato-cashew gravy",
    price: 299, discount: 0, category: "Indian", isVeg: true, spicyLevel: 1,
    preparationTime: 18, stock: 90, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 380,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in buttery tomato gravy",
    price: 249, discount: 0, category: "Indian", isVeg: true, spicyLevel: 1,
    preparationTime: 25, stock: 80, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 290,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format",
    tag: "Classic"
  },
  {
    name: "Chicken Biryani",
    description: "Fragrant basmati rice with spiced chicken, saffron & fried onions",
    price: 349, discount: 10, category: "Indian", isVeg: false, spicyLevel: 2,
    preparationTime: 30, stock: 70, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 610,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Veg Biryani",
    description: "Aromatic basmati with seasonal vegetables & whole spices",
    price: 279, discount: 0, category: "Indian", isVeg: true, spicyLevel: 1,
    preparationTime: 25, stock: 85, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 210,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Palak Paneer",
    description: "Creamy spinach gravy with soft paneer cubes & spices",
    price: 279, discount: 0, category: "Indian", isVeg: true, spicyLevel: 1,
    preparationTime: 18, stock: 75, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 175,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Chole Bhature",
    description: "Spicy chickpea curry served with fluffy deep-fried bhature",
    price: 199, discount: 0, category: "Indian", isVeg: true, spicyLevel: 2,
    preparationTime: 15, stock: 100, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 340,
    image: "https://images.unsplash.com/photo-1626132647523-66c3f4942c3e?w=600&h=400&fit=crop&auto=format",
    tag: "Street Food"
  },
  {
    name: "Mutton Rogan Josh",
    description: "Slow-cooked mutton in Kashmiri spices & aromatic gravy",
    price: 399, discount: 0, category: "Indian", isVeg: false, spicyLevel: 2,
    preparationTime: 35, stock: 50, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 180,
    image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&h=400&fit=crop&auto=format",
    tag: "Chef's Special"
  },
  {
    name: "Garlic Naan",
    description: "Soft tandoor-baked naan brushed with garlic butter & coriander",
    price: 69, discount: 0, category: "Indian", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 200, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 450,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format",
    tag: "Must Try"
  },

  // ─── SANDWICHES ────────────────────────────────────────────
  {
    name: "Club Sandwich",
    description: "Triple-decker with chicken, bacon, egg, lettuce & tomato",
    price: 229, discount: 0, category: "Sandwiches", isVeg: false, spicyLevel: 0,
    preparationTime: 10, stock: 80, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 145,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop&auto=format",
    tag: "Classic"
  },
  {
    name: "Grilled Cheese Sandwich",
    description: "Golden toasted bread with melted cheddar & mozzarella",
    price: 169, discount: 0, category: "Sandwiches", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 100, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 190,
    image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&h=400&fit=crop&auto=format",
    tag: "Comfort Food"
  },
  {
    name: "BLT Sandwich",
    description: "Crispy bacon, fresh lettuce & tomato with mayo on sourdough",
    price: 219, discount: 0, category: "Sandwiches", isVeg: false, spicyLevel: 0,
    preparationTime: 8, stock: 70, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 110,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Bombay Masala Toast",
    description: "Spiced potato filling with green chutney on toasted bread",
    price: 149, discount: 0, category: "Sandwiches", isVeg: true, spicyLevel: 2,
    preparationTime: 8, stock: 120, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 260,
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&h=400&fit=crop&auto=format",
    tag: "Street Style"
  },
  {
    name: "Chicken Tikka Sub",
    description: "Spicy chicken tikka, onion, capsicum & mint mayo in a sub roll",
    price: 259, discount: 5, category: "Sandwiches", isVeg: false, spicyLevel: 2,
    preparationTime: 12, stock: 65, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 135,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Avocado Toast",
    description: "Smashed avocado, cherry tomatoes & poached egg on multigrain",
    price: 249, discount: 0, category: "Sandwiches", isVeg: true, spicyLevel: 0,
    preparationTime: 10, stock: 60, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 88,
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&h=400&fit=crop&auto=format",
    tag: "Healthy"
  },

  // ─── ASIAN ─────────────────────────────────────────────────
  {
    name: "Chicken Fried Rice",
    description: "Wok-tossed rice with chicken, egg, soy sauce & spring onion",
    price: 249, discount: 0, category: "Asian", isVeg: false, spicyLevel: 1,
    preparationTime: 15, stock: 90, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 310,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Veg Hakka Noodles",
    description: "Stir-fried noodles with colourful veggies & Indo-Chinese sauces",
    price: 199, discount: 0, category: "Asian", isVeg: true, spicyLevel: 1,
    preparationTime: 12, stock: 100, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 220,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Chicken Manchurian",
    description: "Crispy chicken balls in spicy Manchurian gravy",
    price: 279, discount: 0, category: "Asian", isVeg: false, spicyLevel: 2,
    preparationTime: 18, stock: 75, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 280,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Pad Thai",
    description: "Classic Thai rice noodles with shrimp, peanuts & tamarind sauce",
    price: 319, discount: 0, category: "Asian", isVeg: false, spicyLevel: 1,
    preparationTime: 18, stock: 60, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 145,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop&auto=format",
    tag: "Thai"
  },
  {
    name: "Dim Sum Basket",
    description: "Steamed pork & prawn dumplings with soy dipping sauce (6 pcs)",
    price: 299, discount: 0, category: "Asian", isVeg: false, spicyLevel: 0,
    preparationTime: 20, stock: 55, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 130,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop&auto=format",
    tag: "Chinese"
  },
  {
    name: "Veg Spring Rolls",
    description: "Crispy rolls stuffed with cabbage, carrot & glass noodles (4 pcs)",
    price: 179, discount: 0, category: "Asian", isVeg: true, spicyLevel: 1,
    preparationTime: 12, stock: 90, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 175,
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Ramen Bowl",
    description: "Rich tonkotsu broth, chashu pork, soft egg & bamboo shoots",
    price: 349, discount: 0, category: "Asian", isVeg: false, spicyLevel: 1,
    preparationTime: 20, stock: 50, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 160,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&auto=format",
    tag: "Japanese"
  },

  // ─── HEALTHY ───────────────────────────────────────────────
  {
    name: "Grilled Chicken Salad",
    description: "Grilled chicken breast, mixed greens, cherry tomatoes & balsamic",
    price: 279, discount: 0, category: "Healthy", isVeg: false, spicyLevel: 0,
    preparationTime: 12, stock: 70, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 120,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format",
    tag: "Low Calorie"
  },
  {
    name: "Quinoa Buddha Bowl",
    description: "Quinoa, roasted veggies, chickpeas, avocado & tahini dressing",
    price: 319, discount: 0, category: "Healthy", isVeg: true, spicyLevel: 0,
    preparationTime: 15, stock: 60, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 95,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format",
    tag: "Vegan"
  },
  {
    name: "Acai Bowl",
    description: "Blended acai with banana, topped with granola, berries & honey",
    price: 299, discount: 0, category: "Healthy", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 55, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 88,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop&auto=format",
    tag: "Superfood"
  },
  {
    name: "Greek Salad",
    description: "Cucumber, tomato, olives, feta cheese & oregano dressing",
    price: 229, discount: 0, category: "Healthy", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 80, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 105,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Protein Wrap",
    description: "Grilled chicken, hummus, spinach & roasted peppers in whole wheat wrap",
    price: 259, discount: 0, category: "Healthy", isVeg: false, spicyLevel: 0,
    preparationTime: 10, stock: 65, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 78,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop&auto=format",
    tag: "High Protein"
  },
  {
    name: "Detox Green Smoothie Bowl",
    description: "Spinach, kale, mango & coconut water topped with seeds & fruits",
    price: 249, discount: 0, category: "Healthy", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 50, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 65,
    image: "https://images.unsplash.com/photo-1638439430466-b2bb7fdc1d67?w=600&h=400&fit=crop&auto=format",
    tag: "Detox"
  },

  // ─── DESSERTS ──────────────────────────────────────────────
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten centre, served with vanilla ice cream",
    price: 199, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 15, stock: 60, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 380,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop&auto=format",
    tag: "Must Try"
  },
  {
    name: "New York Cheesecake",
    description: "Classic creamy cheesecake on graham cracker crust with berry compote",
    price: 219, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 50, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 260,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop&auto=format",
    tag: "Classic"
  },
  {
    name: "Gulab Jamun",
    description: "Soft milk-solid dumplings soaked in rose-cardamom sugar syrup (4 pcs)",
    price: 129, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 150, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 420,
    image: "https://images.unsplash.com/photo-1666195786388-b5b2e5e3b5e3?w=600&h=400&fit=crop&auto=format",
    tag: "Indian Sweet"
  },
  {
    name: "Tiramisu",
    description: "Italian classic with espresso-soaked ladyfingers & mascarpone cream",
    price: 229, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 45, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 175,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop&auto=format",
    tag: "Italian"
  },
  {
    name: "Mango Kulfi",
    description: "Creamy frozen Indian dessert with real Alphonso mango",
    price: 119, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 3, stock: 100, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 310,
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=400&fit=crop&auto=format",
    tag: "Seasonal"
  },
  {
    name: "Brownie Sundae",
    description: "Warm fudge brownie topped with vanilla ice cream & chocolate sauce",
    price: 189, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 70, inStock: true, isAvailable: true, rating: 4.9, ratingCount: 290,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Rasmalai",
    description: "Soft cottage cheese patties in saffron-flavoured sweetened milk",
    price: 149, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 80, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 240,
    image: "https://images.unsplash.com/photo-1666195786388-b5b2e5e3b5e3?w=600&h=400&fit=crop&auto=format",
    tag: "Indian Sweet"
  },

  // ─── DRINKS ────────────────────────────────────────────────
  {
    name: "Mango Lassi",
    description: "Thick chilled yogurt drink blended with fresh Alphonso mango",
    price: 119, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 120, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 350,
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&h=400&fit=crop&auto=format",
    tag: "Bestseller"
  },
  {
    name: "Cold Coffee",
    description: "Chilled espresso blended with milk, ice cream & chocolate syrup",
    price: 149, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 100, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 280,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Fresh Lime Soda",
    description: "Freshly squeezed lime with sparkling water, mint & black salt",
    price: 79, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 3, stock: 200, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 190,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop&auto=format",
    tag: "Refreshing"
  },
  {
    name: "Strawberry Milkshake",
    description: "Thick creamy milkshake with fresh strawberries & whipped cream",
    price: 169, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 80, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 210,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Masala Chai",
    description: "Aromatic Indian spiced tea with ginger, cardamom & cinnamon",
    price: 59, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 200, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 480,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop&auto=format",
    tag: "Must Try"
  },
  {
    name: "Virgin Mojito",
    description: "Fresh mint, lime, sugar syrup & sparkling water over crushed ice",
    price: 129, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 150, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 230,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&h=400&fit=crop&auto=format",
    tag: "Refreshing"
  },
  {
    name: "Watermelon Juice",
    description: "Fresh cold-pressed watermelon juice with a hint of mint",
    price: 99, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 100, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 155,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop&auto=format",
    tag: "Seasonal"
  },
  {
    name: "Chocolate Milkshake",
    description: "Rich dark chocolate blended with milk & topped with whipped cream",
    price: 169, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 90, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 265,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },

  // ─── EXTRA ITEMS (more variety) ────────────────────────────
  {
    name: "Chicken Wings (6 pcs)",
    description: "Crispy fried wings tossed in buffalo sauce with blue cheese dip",
    price: 299, discount: 10, category: "Burgers", isVeg: false, spicyLevel: 2,
    preparationTime: 18, stock: 70, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 195,
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=400&fit=crop&auto=format",
    tag: "Spicy"
  },
  {
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato & served with sambar & chutney",
    price: 179, discount: 0, category: "Indian", isVeg: true, spicyLevel: 1,
    preparationTime: 15, stock: 100, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 390,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop&auto=format",
    tag: "South Indian"
  },
  {
    name: "Pav Bhaji",
    description: "Spiced mashed vegetable curry served with buttered pav buns",
    price: 159, discount: 0, category: "Indian", isVeg: true, spicyLevel: 2,
    preparationTime: 12, stock: 120, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 420,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format",
    tag: "Street Food"
  },
  {
    name: "Hakka Chilli Chicken",
    description: "Crispy chicken tossed with bell peppers, onion & Indo-Chinese sauces",
    price: 289, discount: 0, category: "Asian", isVeg: false, spicyLevel: 2,
    preparationTime: 18, stock: 75, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 210,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop&auto=format",
    tag: "Popular"
  },
  {
    name: "Paneer Tikka",
    description: "Marinated paneer cubes grilled in tandoor with mint chutney",
    price: 269, discount: 0, category: "Indian", isVeg: true, spicyLevel: 1,
    preparationTime: 20, stock: 80, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 280,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop&auto=format",
    tag: "Starter"
  },
  {
    name: "French Fries",
    description: "Golden crispy fries seasoned with sea salt & served with ketchup",
    price: 119, discount: 0, category: "Healthy", isVeg: true, spicyLevel: 0,
    preparationTime: 8, stock: 200, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 500,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop&auto=format",
    tag: "Snack"
  },
  {
    name: "Loaded Nachos",
    description: "Tortilla chips with cheese sauce, jalapeños, salsa & sour cream",
    price: 229, discount: 0, category: "Healthy", isVeg: true, spicyLevel: 2,
    preparationTime: 10, stock: 80, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 145,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=400&fit=crop&auto=format",
    tag: "Snack"
  },
  {
    name: "Waffles with Nutella",
    description: "Crispy Belgian waffles topped with Nutella, banana & whipped cream",
    price: 199, discount: 0, category: "Desserts", isVeg: true, spicyLevel: 0,
    preparationTime: 12, stock: 65, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 220,
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&h=400&fit=crop&auto=format",
    tag: "Sweet"
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk foam, dusted with cocoa powder",
    price: 129, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 150, inStock: true, isAvailable: true, rating: 4.7, ratingCount: 310,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop&auto=format",
    tag: "Coffee"
  },
  {
    name: "Chicken Caesar Salad",
    description: "Romaine lettuce, grilled chicken, croutons & Caesar dressing",
    price: 269, discount: 0, category: "Healthy", isVeg: false, spicyLevel: 0,
    preparationTime: 10, stock: 65, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 115,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Egg Fried Rice",
    description: "Wok-tossed rice with scrambled egg, soy sauce & sesame oil",
    price: 199, discount: 0, category: "Asian", isVeg: false, spicyLevel: 0,
    preparationTime: 12, stock: 100, inStock: true, isAvailable: true, rating: 4.5, ratingCount: 180,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format",
    tag: ""
  },
  {
    name: "Tandoori Chicken Half",
    description: "Half chicken marinated in yogurt & spices, grilled in tandoor",
    price: 349, discount: 5, category: "Indian", isVeg: false, spicyLevel: 2,
    preparationTime: 25, stock: 60, inStock: true, isAvailable: true, rating: 4.8, ratingCount: 240,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format",
    tag: "Tandoor"
  },
  {
    name: "Veggie Wrap",
    description: "Grilled veggies, hummus & feta in a whole wheat tortilla",
    price: 199, discount: 0, category: "Sandwiches", isVeg: true, spicyLevel: 0,
    preparationTime: 10, stock: 80, inStock: true, isAvailable: true, rating: 4.4, ratingCount: 90,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop&auto=format",
    tag: "Healthy"
  },
  {
    name: "Pineapple Smoothie",
    description: "Fresh pineapple blended with coconut milk & a hint of ginger",
    price: 149, discount: 0, category: "Drinks", isVeg: true, spicyLevel: 0,
    preparationTime: 5, stock: 90, inStock: true, isAvailable: true, rating: 4.6, ratingCount: 120,
    image: "https://images.unsplash.com/photo-1638439430466-b2bb7fdc1d67?w=600&h=400&fit=crop&auto=format",
    tag: "Tropical"
  },
];

// ─── SEED FUNCTION ──────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await MenuItem.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  Database already has ${existing} items.`);
      const answer = process.argv[2];
      if (answer !== "--force") {
        console.log("Run with --force to clear and re-seed: node seedMenu.js --force");
        process.exit(0);
      }
      await MenuItem.deleteMany({});
      console.log("🗑️  Cleared existing menu items");
    }

    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`\n🎉 Successfully seeded ${inserted.length} menu items!\n`);

    // Summary by category
    const categories = [...new Set(menuItems.map(i => i.category))];
    categories.forEach(cat => {
      const count = menuItems.filter(i => i.category === cat).length;
      console.log(`   ${cat}: ${count} items`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
