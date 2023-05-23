const express = require("express");
const productRouter = express.Router();
const auth = require("../middleweres/auth");
// const admin = require("../middlewares/admin");
const { Product } = require("../models/product");

productRouter.get("/api/products", auth, async (req, res) => {
  try {
    //console.log(req.query.category);
    const products = await Product.find({ category: req.query.category });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: console.log(e.message) });
  }
});

//get Request for search query

productRouter.get("/api/products/search/:name", auth, async (req, res) => {
  try {
    //console.log(req.query.category);
    //  const products = await Product.find({category: req.query.category});
    const products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: console.log(e.message) });
  }
});

// productRouter.get()

module.exports = productRouter;
