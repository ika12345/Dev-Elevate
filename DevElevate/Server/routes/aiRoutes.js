import express from "express";
import { getAIReply } from "../controller/aiController.js";
const router = express.Router();

router.post("/gemini", getAIReply);

export default router;
