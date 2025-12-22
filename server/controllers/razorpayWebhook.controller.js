import crypto from "crypto";
import OrderModel from "../models/order.model.js";

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  const body = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false });
  }

  const payload = JSON.parse(body.toString());

  // ✅ Payment captured event
  if (payload.event === "payment.captured") {
    const payment = payload.payload.payment.entity;

    // prevent duplicate orders
    const exists = await OrderModel.findOne({
      razorpay_payment_id: payment.id,
    });

    if (!exists) {
      await OrderModel.create({
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        payment_status: "captured",
        totalAmount: payment.amount / 100,
        order_status: "confirmed",
      });
    }
  }

  res.json({ status: "ok" });
};
