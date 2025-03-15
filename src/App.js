import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import GetProducts from "./Components/GetProducts";
import AddProduct from "./Components/AddProduct";
import Dashboard from "./Components/Dashboard";
import { AuthProvider } from "./Components/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute"; // ✅ Fixed import
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Shadow Net - It's all about speed</h1>
          </header>
          <Routes>
            {/* Redirect root path ("/") to "/SignUp" */}
            <Route path="/" element={<Navigate to="/SignUp" replace />} />

            {/* Public Routes */}
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />

            {/* Protected Routes */}
            <Route
              path="/GetProducts"
              element={
                <ProtectedRoute>
                  <GetProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/AddProduct"
              element={
                <ProtectedRoute role="admin"> {/* Only admins can access this route */}
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route for Invalid Paths */}
            <Route path="*" element={<Navigate to="/SignUp" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
