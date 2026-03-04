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
  "http://localhost:5173",
  "http://localhost:5174"
];

const corsOptions = {
  origin: function(origin, callback){
    if(!origin) return callback(null, true);

    const isAllowed = 
      allowedOrigins.includes(origin) ||
      /https:\/\/licenta-.*\.vercel\.app$/.test(origin) ||
      /https:\/\/admin-.*\.vercel\.app$/.test(origin);

    if(isAllowed) return callback(null, true);
    return callback(new Error("CORS: Origin not allowed"), false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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