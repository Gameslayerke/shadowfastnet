import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for stored user data and token on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");

    if (storedUser && token && expiry && new Date(expiry) > new Date()) {
      setUser(JSON.parse(storedUser));
    } else {
      logout(); // Clear invalid or expired data
    }
  }, []);

  const login = (userData, token, expiry) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
    localStorage.setItem("token", token); // Store token
    localStorage.setItem("expiry", expiry); // Store token expiry
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user data
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("expiry"); // Clear token expiry
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
