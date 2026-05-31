import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(255,107,0,0.3)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.9rem",
            },
            success: { iconTheme: { primary: "#ff6b00", secondary: "#fff" } },
          }}
        />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/menu"     element={<Menu />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/orders"   element={<Orders />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
