import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import productModel from "../models/productModel.js";

// GLOBAL VARIABLES
const currency = "RON";
const deliveryCharges = 10;

// GET WAY INITIALIZE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// PLACING ORDERS USING COD
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: true,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    for (const item of items) {
      const productId = item.productId || item._id;
      const size = item.size;

      if (!productId || !size) {
        console.log("ID sau mărime lipsă pentru item:", item);
        continue;
      }

      const updateField = `quantity.${size}`;

      const updated = await productModel.findByIdAndUpdate(
        productId,
        { $inc: { [updateField]: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        console.log(`Produsul cu ID ${productId} nu a fost găsit.`);
      } else {
        console.log(`Produs ${productId}, mărime ${size} actualizat. Stoc nou: ${updated.quantity.get(size)}`);
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// PLACING ORDERS USING STRIPE
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    for (const item of items) {
      const productId = item.productId || item._id;
      const size = item.size;

      if (!productId || !size) {
        console.log("ID sau mărime lipsă pentru item:", item);
        continue;
      }

      const updateField = `quantity.${size}`;

      const updated = await productModel.findByIdAndUpdate(
        productId,
        { $inc: { [updateField]: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        console.log(`Produsul cu ID ${productId} nu a fost găsit.`);
      } else {
        console.log(`Produs ${productId}, mărime ${size} actualizat. Stoc nou: ${updated.quantity.get(size)}`);
      }
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: `${item.name} (${item.size})`,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// VERIFY STRIPE
export const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// ALL ORDERS DATA FOR ADMIN PANEL
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// USER ORDERS DATA FOR FRONTEND
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// UPDATE ORDER STATUS FROM ADMIN PANEL
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// DELETE ORDER FROM ADMIN PANEL
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deleted = await orderModel.findByIdAndDelete(orderId);

    if (!deleted) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//USER ORDER DELETE
export const hideUserOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.body.userId;

    const order = await orderModel.findOneAndUpdate(
      { _id: orderId, userId },
      { $set: { hiddenFromUser: true } }, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order hidden successfully" });
  } catch (error) {
    console.error("Error in hideUserOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






// DASHBOARD
export const getAdminMetrics = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalRevenueData = await orderModel.find({ payment: true });
    const totalRevenue = totalRevenueData.reduce((sum, order) => sum + order.amount, 0);
    const totalCustomers = await userModel.countDocuments();

    res.json({
      success: true,
      totalOrders,
      totalRevenue,
      totalCustomers,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const sales = await orderModel.find({ payment: true });

    const grouped = {};

    sales.forEach(order => {
      const createdAt = order.createdAt;
      if (!createdAt) {
        console.warn(`Order ${order._id} missing createdAt, skipping.`);
        return;
      }

      const ts = new Date(createdAt);
      if (isNaN(ts)) {
        console.warn(`Order ${order._id} has invalid createdAt: ${createdAt}, skipping.`);
        return;
      }

      ts.setHours(0, 0, 0, 0);
      const dayTimestamp = ts.getTime();

      if (!grouped[dayTimestamp]) {
        grouped[dayTimestamp] = { count: 0, totalAmount: 0 };
      }

      grouped[dayTimestamp].count += 1;

      
      grouped[dayTimestamp].totalAmount = Math.round((grouped[dayTimestamp].totalAmount + order.amount) * 100) / 100;
    });

    const salesArray = Object.entries(grouped)
      .map(([timestamp, data]) => {
        const date = new Date(Number(timestamp));
        if (isNaN(date)) {
          return null;
        }
        return {
          date: date.toISOString(),
          count: data.count,
          totalAmount: Number(data.totalAmount.toFixed(2)),  
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ success: true, sales: salesArray });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const sales = await orderModel.find({ payment: true });

    const grouped = {};

    sales.forEach(order => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`; 

      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0 };
      }

      grouped[key].total += order.amount;
      grouped[key].count += 1;
    });

    const result = Object.entries(grouped).map(([month, data]) => ({
      month,
      total: Number(data.total.toFixed(2)),
      count: data.count,
    }));

    res.json({ success: true, sales: result.sort((a, b) => a.month.localeCompare(b.month)) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
