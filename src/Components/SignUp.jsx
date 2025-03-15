import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "./AuthContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    setError("");
    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);

      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/signup",
        data
      );

      setLoading(false);
      setSuccess(response.data.success);

      login(response.data.user);

      // Check if the user is admin and navigate accordingly
      if (username === "admin" && password === "admin123") {
        navigate("/AddProduct"); // Redirect admin to AddProduct page
      } else {
        navigate("/GetProducts"); // Redirect regular users to GetProducts page
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-6 card shadow p-4">
        <h2>Sign Up</h2>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-warning">Please wait while we submit your data...</p>
          </div>
        )}
        {success && <b className="text-success">{success}</b>}
        {error && <b className="text-danger">{error}</b>}

        <form onSubmit={submitForm}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            className="form-control mb-3"
            placeholder="Enter phone number"
            required
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/SignIn">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;