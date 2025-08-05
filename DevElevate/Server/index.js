import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from "cookie-parser";
import authorize from "./middleware/authorize.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import courseRoutes from "./routes/courseRoutes.js";
import adminFeedbackRoutes from './routes/adminFeedbackRoutes.js';
import programmingRoutes from './routes/programmingRoutes.js';

// Load environment variables FIRST
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB only if MONGO_URI is available
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log('MongoDB connection skipped - PDF routes will work without database');
}

// CORS Configuration - Use ONLY ONE approach
app.use(cors({
  origin: [
    'http://localhost:5174',  // Your frontend URL
    'http://localhost:3000',  // Alternative frontend URL
    process.env.FRONTEND_URL  // From .env file if set
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);

// Routes
// USER ROUTES
app.use("/api/v1", userRoutes);

// PROGRAMMING ROUTES
app.use("/api/v1/programming", programmingRoutes); // programming problems and DSA filter

// ADMIN ROUTES
app.use("/api/v1/admin", adminRoutes); // general admin stuff like login, profile
app.use("/api/v1/admin/courses", courseRoutes); // course create/delete/edit
app.use("/api/v1/admin/feedback", adminFeedbackRoutes); // feedback-related

// Sample Usage of authenticate and authorize middleware for roleBased Features
app.get("/api/admin/dashboard", authenticateToken, authorize("admin"), (req, res) => {
  res.send("Hello Admin");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});