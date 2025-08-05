import express from "express";
import {
  getAllProgrammingProblems,
  getDSAProblems,
  createProgrammingProblem,
  updateProgrammingProblem,
  deleteProgrammingProblem
} from "../controller/programmingController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProgrammingProblems);
router.get("/dsa", getDSAProblems);

// Admin routes
router.post("/", authenticateToken, requireAdmin, createProgrammingProblem);
router.put("/:problemId", authenticateToken, requireAdmin, updateProgrammingProblem);
router.delete("/:problemId", authenticateToken, requireAdmin, deleteProgrammingProblem);

export default router;
