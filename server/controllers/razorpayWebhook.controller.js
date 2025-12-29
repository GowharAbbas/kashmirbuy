import crypto from "crypto";
import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import razorpayInstance from "../config/razorpay.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false });
    }

    const payload = JSON.parse(req.body.toString());

    // 🔥 HANDLE ONLY order.paid (MOST RELIABLE)
    if (payload.event === "order.paid") {
      const razorpayOrderId = payload.payload.order.entity.id;

      const order = await OrderModel.findOne({
        razorpay_order_id: razorpayOrderId,
      });

      if (order && order.payment_status !== "captured") {
        // 🔥 FETCH PAYMENT FROM RAZORPAY API
        const payments = await razorpayInstance.orders.fetchPayments(
          razorpayOrderId
        );

        const capturedPayment = payments.items.find(
          (p) => p.status === "captured"
        );

        if (capturedPayment) {
          order.payment_status = "captured";
          order.order_status = "confirmed";
          order.razorpay_payment_id = capturedPayment.id;
          await order.save();

          // ✅ CLEAR CART
          await CartProductModel.deleteMany({ userId: order.userId });
        }
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ success: false });
  }
};


