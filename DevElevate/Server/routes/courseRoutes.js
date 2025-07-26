import express from "express";
import { createCourse, editCourse, deleteCourse, getAllCourses } from "../controller/courseController.js";
import isAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(isAdmin, createCourse);
router.route("/").get(isAdmin, getAllCourses);
router.route("/:courseId").delete(isAdmin, deleteCourse);
router.route("/:courseId/module/:moduleId").post(isAdmin, editCourse);

export default router;