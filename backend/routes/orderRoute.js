import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
  deleteOrder,
  getSalesData,
  hideUserOrder,
  getMonthlySales
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

//ADMIN FEATURE
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.delete("/delete/:orderId", adminAuth, deleteOrder);

//PAYMENT FEATURE
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

//USER FEATURE
orderRouter.post("/userorders", authUser, userOrders);
orderRouter.patch("/hide/:orderId", authUser, hideUserOrder);


//VERIFY PAYMENT
orderRouter.post("/verifystripe", authUser, verifyStripe);

// DASHBOARD FEATURE DATA FOR CHART
orderRouter.get("/sales", adminAuth, getSalesData);
orderRouter.get("/monthly-sales", getMonthlySales);




export default orderRouter;
