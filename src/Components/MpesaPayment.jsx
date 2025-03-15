import React, { useState } from "react";
import axios from "axios";

const MpesaPayment = ({ totalAmount, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    // Validate the phone number
    if (!phoneNumber || phoneNumber.length !== 10 || !phoneNumber.startsWith("07")) {
      setError("Please enter a valid 10-digit phone number starting with 07.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Format the phone number to 254XXXXXXXXX
      const formattedPhoneNumber = `254${phoneNumber.slice(1)}`;

      // Send payment request to the M-Pesa API
      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/mpesa_payment", // Replace with your M-Pesa API endpoint
        {
          phoneNumber: formattedPhoneNumber, // Use the formatted phone number
          amount: totalAmount,
          transactionReference: `REF-${Date.now()}`, // Unique reference for each transaction
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication if needed
          },
        }
      );

      // Handle API response
      if (response.data.success) {
        onSuccess(); // Handle successful payment
      } else {
        setError(response.data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h3>M-Pesa Payment</h3>
      <div className="mb-3">
        <label htmlFor="phoneNumber" className="form-label">
          Enter your M-Pesa phone number:
        </label>
        <input
          type="tel"
          id="phoneNumber"
          className="form-control"
          placeholder="07XX XXX XXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength="10"
          pattern="07\d{8}" // Ensure the input starts with 07 and has 10 digits
          required
        />
      </div>
      {error && <div className="text-danger mb-3">{error}</div>}
      <button
        className="btn btn-primary w-100"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay Ksh ${totalAmount}`}
      </button>
    </div>
  );
};

export default MpesaPayment;