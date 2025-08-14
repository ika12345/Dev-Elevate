import express from "express";
import { uploadContent, deleteContent, getAllContent } from "../controller/adminContentController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
// POST /admin/content/upload
router.post("/content/upload", authenticateToken, requireAdmin, uploadContent);

// DELETE /admin/content/:id
router.delete("/content/:id", authenticateToken, requireAdmin, deleteContent);

// GET /admin/content
router.get("/content", authenticateToken, requireAdmin, getAllContent);

export default router;
