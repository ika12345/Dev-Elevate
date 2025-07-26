import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
import courseRoutes from "./routes/courseRoutes.js";

connectDB();

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());


// main route 
app.use("/api/v1/auth",userRoutes);
app.use("/api/admin", courseRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from DevElevate !');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
