import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
import authorize from "./middleware/authorize.js";
import authenticate from "./middleware/authMiddleware.js";
connectDB();

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // or wherever your FrontEnd or test.html is served
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// main route 
app.use("/api/v1/auth",userRoutes)

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from DevElevate !');
});


// Sample Usage of authenticate and autherie middleware for roleBased Features
app.get("/api/admin/dashboard", authenticate, authorize("admin"), (req, res) => {
  res.send("Hello Admin");
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
