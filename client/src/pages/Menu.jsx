import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import MenuHeroBg from "../components/menu/MenuHeroBg";
import MenuHeroCollage from "../components/menu/MenuHeroCollage";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/menu.css";

gsap.registerPlugin(ScrollTrigger);

const API_URL = "http://localhost:5000/api";

const CATEGORIES = [
  { name: "All",        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop&auto=format", color: "#ff6b00" },
  { name: "Burgers",    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&auto=format", color: "#ff4500" },
  { name: "Pizza",      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&auto=format", color: "#ff6b00" },
  { name: "Pasta",      img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop&auto=format", color: "#f59e0b" },
  { name: "Indian",     img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop&auto=format", color: "#ff6b00" },
  { name: "Sandwiches", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop&auto=format", color: "#a3e635" },
  { name: "Asian",      img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop&auto=format", color: "#e65c00" },
  { name: "Healthy",    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&auto=format", color: "#22c55e" },
  { name: "Desserts",   img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop&auto=format", color: "#f59e0b" },
  { name: "Drinks",     img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop&auto=format", color: "#3b82f6" },
];

// Fallback menu items (used if backend is unavailable)
const FALLBACK_MENU_ITEMS = [
  { id: 11, img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop&auto=format", name: "Steamed Dumplings",      price: 199, category: "Asian",    rating: 4.8, tag: "Popular",    desc: "Pork & ginger filling, soy dipping sauce" },
  { id: 12, img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&auto=format", name: "Thai Green Curry",       price: 279, category: "Asian",    rating: 4.7, tag: "",          desc: "Coconut milk, Thai basil, jasmine rice" },
  { id: 33, img: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop&auto=format", name: "Pad Thai Noodles",       price: 229, category: "Asian",    rating: 4.8, tag: "Trending",   desc: "Rice noodles, shrimp, peanuts, tamarind sauce" },
  { id: 34, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format", name: "Fried Rice Bowl",        price: 199, category: "Asian",    rating: 4.6, tag: "",          desc: "Wok-fried rice, egg, vegetables, soy sauce" },
  { id: 35, img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&auto=format", name: "Sushi Platter",          price: 499, category: "Asian",    rating: 4.9, tag: "Premium",    desc: "12-piece assorted nigiri & maki rolls" },
  { id: 36, img: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop&auto=format", name: "Korean BBQ Bowl",        price: 319, category: "Asian",    rating: 4.8, tag: "New",        desc: "Bulgogi beef, kimchi, steamed rice, sesame" },
  // Healthy
  { id: 13, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format", name: "Caesar Salad",           price: 179, category: "Healthy",  rating: 4.6, tag: "Light",      desc: "Romaine, parmesan, croutons, Caesar dressing" },
  { id: 14, img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop&auto=format", name: "Grilled Chicken Wrap",   price: 219, category: "Healthy",  rating: 4.7, tag: "",          desc: "Grilled chicken, hummus, fresh veggies" },
  { id: 15, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&auto=format", name: "Acai Bowl",              price: 249, category: "Healthy",  rating: 4.8, tag: "Trending",   desc: "Acai blend, granola, fresh fruits, honey" },
  { id: 16, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format", name: "Buddha Bowl",            price: 229, category: "Healthy",  rating: 4.6, tag: "Vegan",      desc: "Quinoa, roasted veggies, tahini dressing" },
  { id: 37, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format", name: "Avocado Toast",          price: 159, category: "Healthy",  rating: 4.7, tag: "Brunch",     desc: "Sourdough, smashed avocado, poached egg" },
  { id: 38, img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop&auto=format", name: "Quinoa Power Bowl",      price: 259, category: "Healthy",  rating: 4.7, tag: "Protein",    desc: "Quinoa, chickpeas, kale, lemon tahini" },
  { id: 39, img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop&auto=format", name: "Greek Salad",            price: 169, category: "Healthy",  rating: 4.6, tag: "",          desc: "Feta, olives, cucumber, tomato, oregano" },
  { id: 40, img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&h=300&fit=crop&auto=format", name: "Smoothie Bowl",          price: 219, category: "Healthy",  rating: 4.8, tag: "Fresh",      desc: "Mango, banana, berries, chia seeds, granola" },
  // Desserts
  { id: 17, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&auto=format", name: "Chocolate Lava Cake",    price: 149, category: "Desserts", rating: 4.9, tag: "Must Try",   desc: "Warm chocolate center, vanilla ice cream" },
  { id: 18, img: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop&auto=format", name: "Red Velvet Cupcake",     price: 99,  category: "Desserts", rating: 4.7, tag: "",          desc: "Cream cheese frosting, moist red velvet" },
  { id: 19, img: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop&auto=format", name: "Crème Brûlée",           price: 179, category: "Desserts", rating: 4.8, tag: "Premium",    desc: "Classic French custard, caramelized sugar" },
  { id: 20, img: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=300&fit=crop&auto=format", name: "Mango Sorbet",           price: 129, category: "Desserts", rating: 4.6, tag: "Fresh",      desc: "Real Alphonso mango, no artificial flavors" },
  { id: 41, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&auto=format", name: "Tiramisu",               price: 169, category: "Desserts", rating: 4.9, tag: "Italian",    desc: "Espresso-soaked ladyfingers, mascarpone cream" },
  { id: 42, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&auto=format", name: "New York Cheesecake",    price: 189, category: "Desserts", rating: 4.8, tag: "Classic",    desc: "Creamy cheesecake, graham cracker crust" },
  { id: 43, img: "https://images.unsplash.com/photo-1551529834-525807d6b4f3?w=400&h=300&fit=crop&auto=format", name: "Gulab Jamun",            price: 89,  category: "Desserts", rating: 4.8, tag: "Desi",       desc: "Soft milk dumplings in rose sugar syrup" },
  { id: 44, img: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=300&fit=crop&auto=format", name: "Waffles & Ice Cream",    price: 159, category: "Desserts", rating: 4.7, tag: "Indulgent",  desc: "Belgian waffles, 2 scoops, chocolate drizzle" },
  // Drinks
  { id: 21, img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&auto=format", name: "Fresh Lime Soda",        price: 79,  category: "Drinks",   rating: 4.7, tag: "",          desc: "Fresh lime, soda, mint, black salt" },
  { id: 22, img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop&auto=format", name: "Mango Lassi",            price: 99,  category: "Drinks",   rating: 4.9, tag: "Bestseller", desc: "Thick yogurt, Alphonso mango, cardamom" },
  { id: 23, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&auto=format", name: "Cold Brew Coffee",       price: 149, category: "Drinks",   rating: 4.8, tag: "Premium",    desc: "12-hour cold brew, oat milk, vanilla" },
  { id: 24, img: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400&h=300&fit=crop&auto=format", name: "Matcha Latte",           price: 139, category: "Drinks",   rating: 4.7, tag: "Trending",   desc: "Ceremonial grade matcha, steamed oat milk" },
  { id: 45, img: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop&auto=format", name: "Strawberry Milkshake",   price: 129, category: "Drinks",   rating: 4.8, tag: "Sweet",      desc: "Fresh strawberries, vanilla ice cream, milk" },
  { id: 46, img: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop&auto=format", name: "Virgin Mojito",          price: 99,  category: "Drinks",   rating: 4.7, tag: "Refreshing", desc: "Mint, lime, sugar syrup, soda water" },
  { id: 47, img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&auto=format", name: "Oreo Shake",             price: 149, category: "Drinks",   rating: 4.9, tag: "Popular",    desc: "Crushed Oreos, vanilla ice cream, milk" },
  { id: 48, img: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop&auto=format", name: "Blue Lagoon",            price: 119, category: "Drinks",   rating: 4.6, tag: "Special",    desc: "Blue curacao syrup, lemon, soda, ice" },

  // Pasta
  { id: 49, img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&auto=format", name: "Spaghetti Carbonara",    price: 299, category: "Pasta",    rating: 4.9, tag: "Classic",    desc: "Creamy egg sauce, pancetta, parmesan, black pepper" },
  { id: 50, img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop&auto=format", name: "Penne Arrabbiata",       price: 249, category: "Pasta",    rating: 4.7, tag: "Spicy 🌶️",  desc: "Spicy tomato sauce, garlic, fresh basil" },
  { id: 51, img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&auto=format", name: "Fettuccine Alfredo",     price: 319, category: "Pasta",    rating: 4.8, tag: "Creamy",     desc: "Rich butter cream sauce, parmesan, fettuccine" },
  { id: 52, img: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=300&fit=crop&auto=format", name: "Pasta Bolognese",        price: 329, category: "Pasta",    rating: 4.8, tag: "Bestseller", desc: "Slow-cooked beef ragu, tagliatelle, parmesan" },
  { id: 53, img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop&auto=format", name: "Pesto Pasta",            price: 279, category: "Pasta",    rating: 4.7, tag: "Veg",        desc: "Basil pesto, pine nuts, cherry tomatoes, fusilli" },
  { id: 54, img: "https://images.unsplash.com/photo-1551183053-bf91798d047e?w=400&h=300&fit=crop&auto=format", name: "Seafood Pasta",          price: 399, category: "Pasta",    rating: 4.9, tag: "Premium",    desc: "Shrimp, squid, mussels, white wine, linguine" },
  { id: 55, img: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=400&h=300&fit=crop&auto=format", name: "Mac & Cheese",           price: 199, category: "Pasta",    rating: 4.8, tag: "Comfort",    desc: "Triple cheese sauce, crispy breadcrumb topping" },
  { id: 56, img: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop&auto=format", name: "Lasagna",                price: 349, category: "Pasta",    rating: 4.9, tag: "Hearty",     desc: "Layers of beef, béchamel, mozzarella, tomato" },

  // Indian
  { id: 57, img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&auto=format", name: "Butter Chicken",         price: 299, category: "Indian",   rating: 4.9, tag: "Bestseller", desc: "Tender chicken in rich tomato butter gravy" },
  { id: 58, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&auto=format", name: "Paneer Butter Masala",   price: 269, category: "Indian",   rating: 4.8, tag: "Veg",        desc: "Soft paneer in creamy tomato cashew gravy" },
  { id: 59, img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop&auto=format", name: "Chicken Biryani",        price: 319, category: "Indian",   rating: 4.9, tag: "Popular",    desc: "Fragrant basmati rice, spiced chicken, saffron" },
  { id: 60, img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&auto=format", name: "Dal Makhani",            price: 219, category: "Indian",   rating: 4.7, tag: "Veg",        desc: "Slow-cooked black lentils, butter, cream" },
  { id: 61, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&auto=format", name: "Chole Bhature",          price: 179, category: "Indian",   rating: 4.8, tag: "Classic",    desc: "Spiced chickpeas, fluffy fried bread" },
  { id: 62, img: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop&auto=format", name: "Palak Paneer",           price: 249, category: "Indian",   rating: 4.7, tag: "Healthy",    desc: "Creamy spinach gravy with fresh paneer cubes" },
  { id: 63, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format", name: "Tandoori Chicken",       price: 349, category: "Indian",   rating: 4.9, tag: "Smoky",      desc: "Marinated chicken, tandoor-roasted, mint chutney" },
  { id: 64, img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format", name: "Samosa Chaat",           price: 129, category: "Indian",   rating: 4.7, tag: "Street",     desc: "Crispy samosa, chole, chutneys, sev, onion" },

  // Sandwiches
  { id: 65, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&auto=format", name: "Club Sandwich",          price: 199, category: "Sandwiches", rating: 4.7, tag: "Classic",   desc: "Triple-decker, chicken, bacon, egg, lettuce" },
  { id: 66, img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop&auto=format", name: "Grilled Cheese",         price: 149, category: "Sandwiches", rating: 4.8, tag: "Comfort",   desc: "Sourdough, triple cheese, golden butter crust" },
  { id: 67, img: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop&auto=format", name: "BLT Sandwich",           price: 179, category: "Sandwiches", rating: 4.6, tag: "",          desc: "Bacon, lettuce, tomato, mayo, toasted bread" },
  { id: 68, img: "https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400&h=300&fit=crop&auto=format", name: "Chicken Pesto Sub",      price: 229, category: "Sandwiches", rating: 4.8, tag: "Popular",   desc: "Grilled chicken, basil pesto, mozzarella, ciabatta" },
  { id: 69, img: "https://images.unsplash.com/photo-1485451456034-3f9391c6f769?w=400&h=300&fit=crop&auto=format", name: "Veggie Panini",          price: 169, category: "Sandwiches", rating: 4.6, tag: "Veg",       desc: "Roasted veggies, hummus, feta, pressed panini" },
  { id: 70, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format", name: "Pulled Pork Sandwich",   price: 259, category: "Sandwiches", rating: 4.9, tag: "Smoky",     desc: "Slow-cooked pulled pork, coleslaw, BBQ sauce" },
  { id: 71, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format", name: "Egg & Cheese Bagel",     price: 139, category: "Sandwiches", rating: 4.7, tag: "Breakfast", desc: "Scrambled egg, cheddar, cream cheese, toasted bagel" },
  { id: 72, img: "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&h=300&fit=crop&auto=format", name: "Tuna Melt",              price: 189, category: "Sandwiches", rating: 4.6, tag: "",          desc: "Tuna salad, melted cheddar, toasted sourdough" },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems, totalPrice } = useCart();
  const { toggleWishlist, isInWishlist, wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/menu`);
      setMenuItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    // Hero text animations — each element separately
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(".mh-badge",
      { opacity: 0, y: -20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    )
    .fromTo(".mh-title-line1",
      { opacity: 0, x: -60, skewX: 8 },
      { opacity: 1, x: 0, skewX: 0, duration: 0.7, ease: "power3.out" },
      "-=0.2"
    )
    .fromTo(".mh-title-line2",
      { opacity: 0, x: -60, skewX: 8 },
      { opacity: 1, x: 0, skewX: 0, duration: 0.7, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(".mh-subtitle",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(".mh-stat",
      { opacity: 0, y: 20, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(1.5)" },
      "-=0.2"
    );

    // Continuous shimmer on orange text
    gsap.to(".mh-title-line2", {
      textShadow: "0 0 30px rgba(255,107,0,0.8)",
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });

    // Stats counter pulse
    gsap.to(".mh-num", {
      scale: 1.08,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.4,
      delay: 2,
    });

    // Category tabs
    gsap.fromTo(".cat-scroll-item",
      { opacity: 0, scale: 0.7, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)", delay: 0.5 }
    );

    // Menu cards
    gsap.fromTo(".menu-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: ".menu-grid", start: "top 85%" }
      }
    );
  }, [activeCategory]);

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch; // Backend already filters by isAvailable
  });

  const addItemToCart = (item) => {
    // Calculate discounted price if discount exists
    const actualPrice = item.discount > 0 
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;
    
    // Ensure image field is available as 'img' for cart compatibility
    const cartItem = {
      ...item,
      img: item.image || item.img,
      id: item._id || item.id,
      originalPrice: item.price,
      price: actualPrice, // Use discounted price
      discount: item.discount || 0
    };
    addToCart(cartItem);
    toast.success(`${item.name} added to cart 🛒`, { duration: 1500 });
  };

  const handleToggleWishlist = (item) => {
    const wasInWishlist = isInWishlist(item.id);
    toggleWishlist(item);
    
    if (wasInWishlist) {
      toast.success(`Removed from wishlist`, { duration: 1500 });
      // pop-out animation
      gsap.fromTo(`#wl-btn-${item.id}`,
        { scale: 1 },
        { scale: 0.75, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    } else {
      toast.success(`${item.name} added to wishlist ❤️`, { duration: 1500 });
      // heart burst animation
      gsap.fromTo(`#wl-btn-${item.id}`,
        { scale: 0.6 },
        { scale: 1, duration: 0.4, ease: "back.out(2.5)" }
      );
    }
  };

  // Drag scroll
  let isDown = false, startX, scrollLeft;
  const onMouseDown  = (e) => { isDown = true; startX = e.pageX - scrollRef.current.offsetLeft; scrollLeft = scrollRef.current.scrollLeft; };
  const onMouseLeave = ()  => { isDown = false; };
  const onMouseUp    = ()  => { isDown = false; };
  const onMouseMove  = (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - scrollRef.current.offsetLeft; scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5; };

  return (
    <div className="menu-page">
      <Navbar search={search} onSearchChange={setSearch} />

      {/* ── Hero ── */}
      <section className="menu-hero">
        <div className="menu-hero-bg" />
        <MenuHeroBg />

        {/* Left — Text */}
        <div className="menu-hero-content">
          <p className="section-tag mh-badge">Our Menu</p>
          <h1 className="menu-hero-title">
            <span className="mh-title-line1">Explore Every</span><br />
            <span className="text-orange mh-title-line2">Craving</span>
          </h1>
          <p className="menu-hero-sub mh-subtitle">
            From comfort classics to exotic delights —<br />
            handcrafted with love, delivered fast 🚀
          </p>
          <div className="menu-hero-stats">
            <div className="mh-stat"><span className="mh-num">72+</span><span className="mh-label">Dishes</span></div>
            <div className="mh-dot" />
            <div className="mh-stat"><span className="mh-num">10</span><span className="mh-label">Categories</span></div>
            <div className="mh-dot" />
            <div className="mh-stat"><span className="mh-num">30 min</span><span className="mh-label">Delivery</span></div>
          </div>
        </div>

        {/* Right — Animated food collage */}
        <div className="menu-hero-right">
          <MenuHeroCollage />
        </div>
      </section>

      {/* ── Category Scroller ── */}
      <section className="cat-section">
        <div
          className="cat-scroller"
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`cat-scroll-item ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.name)}
              style={{ "--cat-color": cat.color }}
            >
              {/* Circle image */}
              <div className="cat-img-wrap">
                <img src={cat.img} alt={cat.name} className="cat-img" draggable="false" />
                <div className="cat-img-overlay" />
                {activeCategory === cat.name && <div className="cat-active-ring" />}
              </div>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Menu Body ── */}
      <section className="menu-body">
        {/* Category Heading */}
        <div className="menu-heading">
          <h2 className="menu-cat-heading">
            {activeCategory === "All" ? "All Items" : activeCategory}
          </h2>
          <p className="menu-count">
            <span className="menu-count-num">{filtered.length}</span> items available
          </p>
        </div>

        <div className="menu-grid">
          {filtered.length === 0 ? (
            <div className="menu-empty">
              <span>😕</span>
              <p>No items found. Try a different search!</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div className="menu-card" key={item._id}>
                {/* Image */}
                <div className="menu-card-img-wrap">
                  <img src={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format"} alt={item.name} className="menu-card-img" loading="lazy" />
                  
                  {/* VEG/NON-VEG Icon - Top Left */}
                  <span 
                    className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`}
                    title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                  ></span>
                  
                  {/* Out of Stock Ribbon */}
                  {item.inStock === false && (
                    <div className="corner-ribbon">
                      <span>OUT OF STOCK</span>
                    </div>
                  )}
                  
                  {/* Wishlist heart */}
                  <button
                    id={`wl-btn-${item._id}`}
                    className={`menu-wl-btn ${isInWishlist(item._id) ? "active" : ""}`}
                    onClick={() => handleToggleWishlist(item)}
                    aria-label={isInWishlist(item._id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isInWishlist(item._id) ? "❤️" : "🤍"}
                  </button>
                </div>
                
                {/* Info */}
                <div className="menu-card-body">
                  <div className="menu-card-header">
                    <h3 className="menu-card-name">{item.name}</h3>
                    <div className="menu-card-meta">
                      <span className="menu-card-rating">
                        <span className="rating-star">★</span>
                        {item.rating || 4.5}
                      </span>
                      {item.tag && <span className="badge-tag">• {item.tag}</span>}
                    </div>
                  </div>
                  
                  <p className="menu-card-desc">{item.description}</p>
                  
                  <div className="menu-card-footer">
                    <div className="menu-card-price-wrapper">
                      {item.discount > 0 ? (
                        <>
                          <span className="menu-card-price-original">₹{item.price}</span>
                          <span className="menu-card-price">₹{Math.round(item.price * (1 - item.discount / 100))}</span>
                          <span className="menu-card-discount">{item.discount}% OFF</span>
                        </>
                      ) : (
                        <span className="menu-card-price">₹{item.price}</span>
                      )}
                    </div>
                    <button 
                      className="menu-add-btn" 
                      onClick={() => addItemToCart(item)}
                      disabled={item.inStock === false}
                    >
                      {item.inStock === false ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Floating Cart */}
      {totalItems > 0 && (
        <div className="floating-cart">
          🛒 {totalItems} item{totalItems > 1 ? "s" : ""} — ₹{totalPrice}
          {wishlistCount > 0 && (
            <span className="floating-wl-count">❤️ {wishlistCount}</span>
          )}
          <button className="floating-cart-btn" onClick={() => navigate("/cart")}>
            View Cart →
          </button>
        </div>
      )}
    </div>
  );
}
