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

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());

// CORS Config
const allowedOrigins = [
  "https://admin-mshzsx78o-stefas-projects-ed283907.vercel.app",  // frontend live
  "https://licenta-gglpn71yr-stefas-projects-ed283907.vercel.app",        // admin live
  "http://localhost:5173",                    // vite dev frontend
  "http://localhost:5174"                     // vite dev admin
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow curl/Postman
    if(!allowedOrigins.includes(origin)){
      return callback(new Error("CORS: Origin not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight OPTIONS requests
app.options("*", cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(!allowedOrigins.includes(origin)){
      return callback(new Error("CORS: Origin not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
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