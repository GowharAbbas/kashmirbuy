import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: [String],     // FIXED → must be array
        price: Number,
        qty: Number,
      },
    ],

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    subTotal: Number,
    tax: Number,
    totalAmount: Number,

    delivery_address: {
      fullName: String,
      email: String,
      mobile: String,
      address_line: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    payment_status: { type: String, default: "paid" },
    order_status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

