import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner, Alert, Container, Button, Badge, Pagination, Placeholder } from "react-bootstrap";

const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for payment
  const productsPerPage = 5;

  // Format price in Kenya Shillings
  const formatPrice = (price) => {
    if (isNaN(price)) {
      return "Ksh 0"; // Default value if price is invalid
    }
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://alvins.pythonanywhere.com/api/getproducts"
        );
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Paginate products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle M-Pesa payment
  const handleMpesaPayment = async (phoneNumber, amount) => {
    try {
      const response = await axios.post(
        "https://your-mpesa-api.com/payment", // Replace with your M-Pesa API endpoint
        {
          phoneNumber: `254${phoneNumber.slice(1)}`, // Convert to M-Pesa format (254...)
          amount: amount,
          transactionReference: `REF-${Date.now()}`, // Unique reference for each transaction
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authentication if needed
          },
        }
      );

      if (response.data.success) {
        alert("Payment initiated successfully. Please check your phone to complete the transaction.");
        setSelectedProduct(null); // Reset selected product
      } else {
        alert(response.data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <h2 className="text-center mb-4">Our Products</h2>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="mb-3 shadow-sm">
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
                <Placeholder xs={6} /> <Placeholder xs={8} />
              </Placeholder>
            </Card.Body>
          </Card>
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center mt-5">
        {error}
      </Alert>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Our Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-4"
      />
      <div className="mb-4 d-flex justify-content-center flex-wrap">
        <Button
          variant={selectedCategory === "All" ? "primary" : "outline-primary"}
          onClick={() => setSelectedCategory("All")}
          className="me-2 mb-2"
        >
          All
        </Button>
        <Button
          variant={selectedCategory === "Electronics" ? "primary" : "outline-primary"}
          onClick={() => setSelectedCategory("Electronics")}
          className="me-2 mb-2"
        >
          Electronics
        </Button>
        <Button
          variant={selectedCategory === "Clothing" ? "primary" : "outline-primary"}
          onClick={() => setSelectedCategory("Clothing")}
          className="me-2 mb-2"
        >
          Clothing
        </Button>
      </div>
      {currentProducts.length === 0 ? (
        <p className="text-center text-muted">No products found.</p>
      ) : (
        <div>
          {currentProducts.map((product) => (
            <Card key={product.product_id} className="mb-3 shadow-sm">
              <Card.Img
                variant="top"
                src={product.image_url || "https://via.placeholder.com/150"}
                alt={product.product_name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>
                  {product.product_name}{" "}
                  {product.is_free && <Badge bg="success">Free</Badge>}
                </Card.Title>
                <Card.Text>Description: {product.product_desc}</Card.Text>
                <Card.Text>Price: {formatPrice(product.product_cost)}</Card.Text>
                {product.is_free && (
                  <Card.Text>
                    Expires on: {new Date(product.expiration_date).toLocaleDateString()}
                  </Card.Text>
                )}
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => {
                    console.log("Selected Product:", product); // Debugging line
                    setSelectedProduct(product);
                  }}
                >
                  Buy
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* M-Pesa Payment Form */}
      {selectedProduct && (
        console.log("Rendering Payment Form for:", selectedProduct), // Debugging line
        <div className="mt-4">
          <h3>Payment for {selectedProduct.product_name}</h3>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Enter your M-Pesa phone number:
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-control"
              placeholder="07XX XXX XXX"
              maxLength="10"
            />
          </div>
          <Button
            variant="success"
            className="w-100"
            onClick={() =>
              handleMpesaPayment(
                document.getElementById("phoneNumber").value,
                selectedProduct.product_cost
              )
            }
          >
            Pay Ksh {selectedProduct.product_cost} via M-Pesa
          </Button>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map(
            (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </div>
    </Container>
  );
};

export default GetProducts;