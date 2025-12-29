import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpay_order_id,
      products,
      subTotal,
      tax,
      totalAmount,
      delivery_address,
    } = req.body;

    const orderProducts = products.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.images,
      price: item.productId.price,
      qty: item.quantity,
    }));

    const order = await OrderModel.create({
      userId,
      products: orderProducts,
      razorpay_order_id,
      subTotal,
      tax,
      totalAmount,
      delivery_address,
      payment_status: "pending",
      order_status: "pending",
    });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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


// New Function

export const requestReturn = async (req, res) => {
  try {
    const { orderId, productId } = req.body;
    const userId = req.userId;

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order)
      return res.json({ success: false, message: "Order not found" });

    const diffDays =
      (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24);

    if (diffDays > 2)
      return res.json({
        success: false,
        message: "Return allowed only within 2 days",
      });

    const product = order.products.find(
      (p) => p.productId.toString() === productId
    );

    if (!product || product.returnRequested)
      return res.json({
        success: false,
        message: "Return already requested",
      });

    product.returnRequested = true;
    product.returnRequestedAt = new Date();

    await order.save();

    res.json({ success: true, message: "Return request submitted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const syncOrderPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ If already confirmed, no need to sync
    if (order.payment_status === "captured") {
      return res.json({
        success: true,
        data: order,
        message: "Order already confirmed",
      });
    }

    // 🔥 Ask Razorpay directly
    const payments = await razorpayInstance.orders.fetchPayments(
      order.razorpay_order_id
    );

    const capturedPayment = payments.items.find(
      (p) => p.status === "captured"
    );

    if (capturedPayment) {
      order.payment_status = "captured";
      order.order_status = "confirmed";
      order.razorpay_payment_id = capturedPayment.id;
      await order.save();
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



