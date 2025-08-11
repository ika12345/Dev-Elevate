import express from "express";
import { 
  addUser,
  createAdminLog, 
  deleteUserById, 
  getAdminLogs,getAllUserRegister
} from "../controller/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/system-log",authenticateToken,requireAdmin, createAdminLog);

router.get("/system-logs",authenticateToken,requireAdmin, getAdminLogs);

router.post("/add-user",authenticateToken,requireAdmin,addUser)
router.get("/all-users",authenticateToken,requireAdmin,getAllUserRegister)
router.delete("/delete-user",authenticateToken,requireAdmin, deleteUserById)



export default router;
