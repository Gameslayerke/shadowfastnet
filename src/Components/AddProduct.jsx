import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // Date picker component
import "react-datepicker/dist/react-datepicker.css"; // Date picker styles

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [isFree, setIsFree] = useState(false); // Toggle for free/paid
  const [expirationDate, setExpirationDate] = useState(null); // Expiration date for free files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file); // Set the file in state
      setError("");
    } else {
      setImage(null);
      setError("Please upload a valid image file.");
    }
  };

  // Validate form inputs
  const validateForm = () => {
    if (!name || !description || !image) {
      setError("All fields are required.");
      return false;
    }

    if (!isFree && (isNaN(price) || price <= 0)) {
      setError("Price must be a valid number greater than 0.");
      return false;
    }

    if (isFree && !expirationDate) {
      setError("Please set an expiration date for free files.");
      return false;
    }

    setError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("product_name", name);
    formData.append("product_desc", description);
    formData.append("product_cost", isFree ? 0 : price); // Set price to 0 for free files
    formData.append("product_photo", image);
    formData.append("is_free", isFree); // Add is_free flag
    formData.append("expiration_date", isFree ? expirationDate.toISOString() : null); // Add expiration date

    // Log FormData entries for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/addproduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      setLoading(false);
      setSuccess("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setIsFree(false);
      setExpirationDate(null);
      setTimeout(() => {
        navigate("/"); // Redirect to the product listing page after 2 seconds
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Add Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isFree} // Disable price input for free files
                required={!isFree}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Is this product free?</Form.Label>
              <ToggleButtonGroup
                type="radio"
                name="isFree"
                value={isFree}
                onChange={(val) => setIsFree(val)}
              >
                <ToggleButton value={true} variant={isFree ? "primary" : "outline-primary"}>
                  Free
                </ToggleButton>
                <ToggleButton value={false} variant={!isFree ? "primary" : "outline-primary"}>
                  Paid
                </ToggleButton>
              </ToggleButtonGroup>
            </Form.Group>
            {isFree && (
              <Form.Group className="mb-3">
                <Form.Label>Expiration Date</Form.Label>
                <DatePicker
                  selected={expirationDate}
                  onChange={(date) => setExpirationDate(date)}
                  minDate={new Date()} // Prevent past dates
                  required
                  className="form-control"
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;