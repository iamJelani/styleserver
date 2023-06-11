const express = require("express");
const auth = require("../middleweres/auth");
const { Product } = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
// require("dotenv").config();
// const { connect, removeItemFromCart } = require("../mongomongo/database");
const userRouter = express.Router();
userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }
      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
});

userRouter.delete(
  "/api/remove-deleted-from-cart/:id",
  auth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const products = await Product.find({});
      let user = await User.findById(req.user);

      const cartIds = user.cart.map((item) => item.product._id);
      const filteredCart = user.cart.filter((item) =>
        products.some((product) => product._id.equals(item.product._id))
      );

      user.cart = filteredCart;

      user = await user.save();
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
      console.log(e);
    }
  }
);

userRouter.delete("/api/delete-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { index } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);
    user.cart.splice(index, 1);
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
});

userRouter.post("/api/save-user-address", auth, async (req, res) => {
  try {
    const { address, phone } = req.body;
    let user = await User.findById(req.user);
    user.address = address;
    user.phone = phone;
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Save User Address Error: " + e.message });
  }
});

userRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;
    let products = [];
    for (let c = 0; c < cart.length; c++) {
      let product = await Product.findById(cart[c].product._id);
      let cartQuantity = cart[c].quantity;
      let fcartQuantity = parseInt(cartQuantity);
      //...........................................................................
      let bigCartQuantity = product.quantity;
      let bcartQuantity = parseInt(bigCartQuantity);
      let good = true;
      if (product.quantity >= cart[c].quantity) {
        product.quantity -= cart[c].quantity;
        products.push({
          product: product,
          quantity: cart[c].quantity,
        });
        await product.save();
      } else {
        return res
          .status(400)
          .json(`{msg: ${product.name} is out of stocks } `);
      }
    }
    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();
    let order = new Order({
      products: products,
      totalPrice,
      address,
      userId: req.user,
      orderTime: new Date().getTime(),
    });
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: "Processing Order Error: " + e.message });
  }
});

userRouter.get("/api/orders/me", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.put("/api/change/profile-picture", async (req, res) => {
  try {
    const { id, image } = req.body;
    const filter = { _id: id };
    const options = { new: true };
    const update = { picture: image };
    let doc = await User.findOneAndUpdate(filter, update, options);

    if (doc != null) {
      doc = await doc.save();
      res.json(doc);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
