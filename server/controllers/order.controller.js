import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products,
      subTotal,
      tax,
      totalAmount,
      delivery_address
    } = req.body;

    // Validate payment fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: "Missing payment details" });
    }

    // ------------------------------
    // Verify Razorpay Payment
    // ------------------------------
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ------------------------------
    // FIX: Format products correctly
    // ------------------------------
    const orderProducts = products.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.images, // array
      price: item.productId.price,
      qty: item.quantity
    }));

    // ------------------------------
    // Save Order
    // ------------------------------
    const order = await OrderModel.create({
      userId,
      products: orderProducts,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subTotal,
      tax,
      totalAmount,
      delivery_address,
      payment_status: "paid",
    });

    // Clear user cart
    await CartProductModel.deleteMany({ userId });

    return res.json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getMyOrders = async (req, res) => {
  const orders = await OrderModel.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  return res.json({
    success: true,
    data: orders,
  });
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


