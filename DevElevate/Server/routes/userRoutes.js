import express from "express";
const router = express.Router();

import { registerUser, loginUser } from "../controller/userController.js";
import { loginValidator, signUpValidator } from "../middleware/Validators.js";

router.post("/signup", signUpValidator, registerUser);

router.post("/login", loginValidator, loginUser);

export default router;
