export const razorpayWebhook = async (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());

    console.log("🔥 WEBHOOK HIT:", payload.event);

    if (payload.event === "order.paid") {
      const razorpayOrderId = payload.payload.order.entity.id;

      const order = await OrderModel.findOne({
        razorpay_order_id: razorpayOrderId,
      });

      if (order && order.payment_status !== "captured") {
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

          await CartProductModel.deleteMany({ userId: order.userId });
        }
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ success: false });
  }
};



