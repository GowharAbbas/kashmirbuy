import { Router } from "express";
import { createOrder, getAllOrders, getMyOrders, requestReturn } from "../controllers/order.controller.js";
import auth from "../middlewares/auth.js";
import { generateInvoice } from "../controllers/invoice.controller.js";

const router = Router();

router.post("/create", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/all",auth, getAllOrders);
router.get("/invoice/:id", generateInvoice);

// new route

router.post("/request-return", auth, requestReturn);

export default router;
