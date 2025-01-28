import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import ItemDetails from "./Components/ItemDetails";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const addToCart = (product) => {
    let found = false;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === product.id) {
        cart[i].quantity += 1;
        found = true;
        break;
      }
    }
    if (!found) {
      product.quantity = 1;
      cart.push(product);
    }
    setCart([...cart]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container mt-4">
              <h1 className="text-center mb-4">Product List</h1>
              <div className="row">
                {products.map((product) => (
                  <div key={product.id} className="col-12 col-md-3 mb-4">
                    <div className="card">
                      <img
                        src={product.image_url}
                        className="card-img-top"
                        alt={product.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text">
                          <strong>Price:</strong> ${product.price}
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="go-cart btn btn-dark">
                  <Link to="/cart">Go to Cart</Link>
                </button>
              </div>
            </div>
          }
        />
        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />
        <Route
          path="/product/:id"
          element={<ItemDetails products={products} />}
        />
      </Routes>
    </Router>
  );
};

const Cart = ({ cart, setCart }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = () => {
    axios
      .post("http://localhost:5000/order", {
        totalValue: total,
        orderDetails: cart,
      })
      .then(() => {
        setCart([]);
        alert("Order placed successfully!");
      })
      .catch((error) => {
        console.error("There was an error placing the order!", error);
      });
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id}>
          <img
            src={item.image_url}
            alt={item.name}
            style={{ width: "100px", height: "100px" }}
          />
          <p>{item.description}</p>
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price}</p>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <button onClick={placeOrder}>Place Order</button>
      <button>
        <Link to="/">Back to Products</Link>
      </button>
    </div>
  );
};

export default App;
