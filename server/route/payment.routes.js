import { Router } from "express";
import bodyParser from "body-parser";
import { createRazorpayOrder } from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.js";
import { razorpayWebhook } from "../controllers/razorpayWebhook.controller.js";

const router = Router();

router.post("/create-order", auth, createRazorpayOrder);


router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),razorpayWebhook
);

export default router;
