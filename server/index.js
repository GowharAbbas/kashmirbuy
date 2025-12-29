import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import connectDB from "./config/connectDb.js";

import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/myList.route.js";
import addressRouter from "./route/address.route.js";
import sliderRouter from "./route/homeSlider.js";
import sliderSmall1Router from "./route/homeSliderSmall1.js";
import sliderSmall2Router from "./route/homeSliderSmall2.js";
import paymentRouter from "./route/payment.routes.js";
import orderRouter from "./route/order.routes.js";
import { razorpayWebhook } from "./controllers/razorpayWebhook.controller.js";

const app = express();

/* 🔴 WEBHOOK FIRST (RAW BODY) */
app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "*/*" }),
  razorpayWebhook
);




/* NORMAL MIDDLEWARES */
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* JSON FOR ALL OTHER ROUTES */
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/slider", sliderRouter);
app.use("/api/sliderSmall1", sliderSmall1Router);
app.use("/api/sliderSmall2", sliderSmall2Router);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);

// Start server
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("🚀 Server running on port", process.env.PORT);
  });
});
