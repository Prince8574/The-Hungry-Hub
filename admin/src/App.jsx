import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import MenuManagement from "./pages/MenuManagement";
import MenuItemForm from "./pages/MenuItemForm";
import Admins from "./pages/Admins";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./App.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("adminToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Layout with Sidebar
function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Navbar />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255,107,0,0.3)",
            fontFamily: "Poppins, sans-serif",
          },
          success: { iconTheme: { primary: "#ff6b00", secondary: "#fff" } },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <MenuManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/menu/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <MenuItemForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/menu/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <MenuItemForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Admins />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
