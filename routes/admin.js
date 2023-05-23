const express = require("express");
const adminRouter = express.Router();
const admin = require("../middleweres/admin");
const paystackAuth = require("../middleweres/paystack");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Product } = require("../models/product");
const Order = require("../models/order");

adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const {
      name,
      description,
      quantity,
      price,
      status,
      category,
      images,
      models,
    } = req.body;
    let product = new Product({
      name,
      description,
      quantity,
      price,
      status,
      category,
      images,
      models,
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.put("/admin/update-product/:id", admin, async (req, res) => {
  try {
    const {
      name,
      description,
      quantity,
      price,
      status,
      category,
      images,
      models,
    } = req.body;

    const { id } = req.params;
    const filter = { name: name };
    const update = {
      name: name,
      description: description,
      status: status,
      quantity: quantity,
      price: price,
      category: category,
      models: models,
      images: images,
    };
    let doc = await Product.findOneAndUpdate(filter, update);
    const options = { new: true };
    doc = await Product.findOneAndUpdate(filter, update, options);
    doc = await doc.save();

    // console.log(id);
    // oldProduct = product;
    // console.log(oldProduct);

    // oldProduct = await oldProduct.save();
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
    //  product = await product.save;
  } catch (e) {
    res
      .status(500)
      .json({ error: console.log("AdminRouter Error " + e.message) });
  }
});

adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Delete Product

adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    //  product = await product.save;
    res.json(product);
  } catch (e) {
    res
      .status(500)
      .json({ error: console.log("AdminRouter Error" + e.message) });
  }
});

adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    let totalEarnings = 0;
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalEarnings +=
          orders[i].products[j].quantity * orders[i].products[j].product.price;
      }
    }

    //  CATEGORYWISE ORDER FETCHING
    let sofasEarnings = (await fetchCategoryWiseProducts("Sofas")) ?? 0;
    let armchairsEarnings = (await fetchCategoryWiseProducts("Armchairs")) ?? 0;
    let tablesEarnings = (await fetchCategoryWiseProducts("Tables")) ?? 0;
    let bedsEarnings = (await fetchCategoryWiseProducts("Beds")) ?? 0;
    let accessoriesEarnings =
      (await fetchCategoryWiseProducts("Accessories")) ?? 0;
    let lightsEarnings = (await fetchCategoryWiseProducts("Lights")) ?? 0;

    let earnings = {
      totalEarnings,
      sofasEarnings,
      armchairsEarnings,
      tablesEarnings,
      bedsEarnings,
      accessoriesEarnings,
      lightsEarnings,
    };

    res.json(earnings);
  } catch (e) {
    res
      .status(500)
      .json({ error: console.log("AdminRouter Error " + e.message) });
  }
});

async function fetchCategoryWiseProducts(category) {
  earnings = 0;
  let categoriesOrder = await Order.find({
    "products.product.category": category,
  });

  for (let i = 0; i < categoriesOrder.length; i++) {
    for (let j = 0; j < categoriesOrder[i].products.length; j++) {
      earnings +=
        categoriesOrder[i].products[j].quantity *
        categoriesOrder[i].products[j].product.price;
    }
    return earnings;
  }
}

adminRouter.get("/admin/get-order-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let orders = await Order.findById(id);
    let orderStatus = orders.status;
    console.log("Order status is: " + orderStatus);
    res.json(orderStatus);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/transaction-initialize", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: req.body.amount,
        email: req.body.email,
      },
      {
        headers: {
          Authorization: `Bearer sk_test_bf32db4917b3d3c664de7ac036c9e9c73ead384a`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response.data);
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
});

adminRouter.post("/verify-payment", async (req, res) => {
  const { transactionReference } = req.body;
  // const transactionReference = req.body;
  const paystackSecretKey = "sk_test_bf32db4917b3d3c664de7ac036c9e9c73ead384a";

  console.log(transactionReference);

  try {
    const apiResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${transactionReference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const body = apiResponse.data;

    if (body.status && body.data.status === "success") {
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Payment verification failed." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while verifying the payment." });
    console.log(error);
  }
});

module.exports = adminRouter;

// try {
//     const token = req.header('x-auth-token')
//     if(!token)
//     return res.status(401).json({msg: 'No auth token: Access Denied. Period'});

//     const verified =  jwt.verify(token, 'passwordKey');
//     if(!verified) return res.status(401).json({msg: 'Token verification failed, autorisation denied',},);

//     req.user = verified.id;
//     req.token = token;
//     next();
// } catch (e) {
//     res.status(500).json({error: e.message });
// }
