import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tejas04",
  database: "ecart_db",
});

db.connect((err) => {
  if (err) {
    console.log("Failed to connect", err);
  } else {
    console.log("Running Backend Successfully");
  }
});


app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";

  
  
  
  db.query(query, (err, results) => {
    if (err) {
     
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});


app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });
});


app.post("/cart", (req, res) => {
  const { items } = req.body;
  const totalValue = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  res.json({ totalValue });
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port 5000`);
});