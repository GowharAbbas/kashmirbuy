import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, paymentFailed, placeCODOrder, requestReturn, verifyPayment } from "../controllers/order.controller.js";
import auth from "../middlewares/auth.js";
import { generateInvoice } from "../controllers/invoice.controller.js";

const router = Router();

router.post("/create", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/all",auth, getAllOrders);
router.get("/invoice/:id", generateInvoice);

// new route

router.post("/request-return", auth, requestReturn);

router.post("/verify-payment", auth, verifyPayment);

router.post("/payment-failed", auth, paymentFailed);


//New for cod

router.post("/cod", auth, placeCODOrder);

export default router;
