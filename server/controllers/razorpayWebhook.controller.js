import crypto from "crypto";
import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";

export const razorpayWebhook = async (req, res) => {
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

  //console.log("🔥 RAZORPAY WEBHOOK RECEIVED:", payload.event);


  if (
  payload.event === "order.paid" ||
  payload.event === "payment.captured"
) {
  const payment = payload.payload.payment.entity;

  const order = await OrderModel.findOne({
    razorpay_order_id: payment.order_id,
  });

  if (order && order.payment_status !== "captured") {
  order.payment_status = "captured";
  order.order_status = "confirmed";
  order.razorpay_payment_id = payment.id;
  await order.save();

  await CartProductModel.deleteMany({ userId: order.userId });
}

}

  res.json({ status: "ok" });
};

