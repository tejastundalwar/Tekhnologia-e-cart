import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetails({ products }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id, products]);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <Link to="/">Back to Products</Link>
    </div>
  );
}

export default ProductDetails;
