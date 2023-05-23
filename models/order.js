const mongoose = require("mongoose");
const { productSchema } = require("./product");

const orderSchema = mongoose.Schema({
  products: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        require: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId: {
    require: true,
    type: String,
  },
  orderTime: {
    required: true,
    type: Number,
  },
  status: {
    type: Number,
    default: 0,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
