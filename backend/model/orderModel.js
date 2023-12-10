const mongoose = require("mongoose");

  // order item details array
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      image: {
        type: String,
        required: true,
      },

      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductModel", 
        required: true,
      },
    },
  ],



module.exports = mongoose.model("OrdersModel" , orderSchema);