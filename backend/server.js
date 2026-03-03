import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

// CORS Config
const allowedOrigins = [
  "https://licenta-frontend-url.vercel.app", // frontend live
  "https://licenta-admin-url.vercel.app",    // admin live
  "http://localhost:5173",                   // vite dev frontend
  "http://localhost:5174"                    // vite dev admin, dacă ai alt port
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port} ❤️`);
});