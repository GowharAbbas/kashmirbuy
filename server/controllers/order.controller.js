import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import crypto from "crypto";

/* ----------------------------------
   CREATE ORDER (PENDING)
-----------------------------------*/
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

/* ----------------------------------
   VERIFY PAYMENT (MAIN FIX)
-----------------------------------*/
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 🔐 Generate signature on backend
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ❌ Invalid signature
    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Find order
    const order = await OrderModel.findOne({ razorpay_order_id });

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Update order
    order.payment_status = "captured";
    order.order_status = "confirmed";
    order.razorpay_payment_id = razorpay_payment_id;

    await order.save();

    // ✅ CLEAR CART (THIS FIXES YOUR ISSUE)
    await CartProductModel.deleteMany({ userId: order.userId });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ----------------------------------
   USER ORDERS
-----------------------------------*/
export const getMyOrders = async (req, res) => {
  const orders = await OrderModel.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  return res.json({
    success: true,
    data: orders,
  });
};

/* ----------------------------------
   ADMIN ORDERS
-----------------------------------*/
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------
   RETURN REQUEST
-----------------------------------*/
export const requestReturn = async (req, res) => {
  try {
    const { orderId, productId } = req.body;
    const userId = req.userId;

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order)
      return res.json({ success: false, message: "Order not found" });

    const diffDays =
      (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24);

    if (diffDays > 5)
      return res.json({
        success: false,
        message: "The return window for this item has expired.",
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


export const paymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "razorpay_order_id is required",
      });
    }

    // ❌ DELETE the pending order
    await OrderModel.findOneAndDelete({
      razorpay_order_id,
      payment_status: "pending",
      order_status: "pending",
    });

    return res.json({
      success: true,
      message: "Failed order removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//New For Cod

export const placeCODOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { products, subTotal, tax, totalAmount, delivery_address } = req.body;

    if (!products || products.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

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
      subTotal,
      tax,
      totalAmount,
      delivery_address,
      payment_method: "cod",
      payment_status: "pending",
      order_status: "confirmed",
    });

    // ✅ CLEAR CART
    await CartProductModel.deleteMany({ userId });

    return res.json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





