import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("https://dummyjson.com/products")
      .then((response) => {
        setProducts(response.data.products); 
      })
      .catch((error) => {
        console.error("Error fetching products!", error);
      });
  }, []);

  const addToCart = (product) => {
    let found = false;
    const updatedCart = cart.map((item) => {
      if (item.id === product.id) {
        found = true;
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    if (!found) {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
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
                      <img src={product.thumbnail} className="card-img-top" alt={product.title} />
                      <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                        <Link to={`/product/${product.id}`} className="btn btn-info">View Details</Link>
                        <button className="btn btn-primary ml-2" onClick={() => addToCart(product)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/cart" className="btn btn-dark mt-3">Go to Cart</Link>
              </div>
            </div>
          }
        />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/product/:id" element={<ProductDetails products={products} />} />
      </Routes>
    </Router>
  );
};

const ProductDetails = ({ products }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  return product ? (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <img src={product.thumbnail} alt={product.title} />
      <Link to="/">Back to Products</Link>
    </div>
  ) : (
    <p>Product not found</p>
  );
};

const Cart = ({ cart, setCart }) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id}>
          <img src={item.thumbnail} alt={item.title} style={{ width: "100px", height: "100px" }} />
          <p>{item.title}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price}</p>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <button onClick={() => alert("Order placed successfully!")}>Place Order</button>
      <Link to="/" className="btn btn-secondary">Back to Products</Link>
    </div>
  );
};

export default App;
