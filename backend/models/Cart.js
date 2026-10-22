const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ek user ka ek hi cart hoga
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Cart ki total price calculate karne ka virtual field
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
});

module.exports = mongoose.model("Cart", cartSchema);

