import { Router } from "express";
import { createRazorpayOrder } from "../controllers/payment.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/create-order", auth, createRazorpayOrder);

export default router;
