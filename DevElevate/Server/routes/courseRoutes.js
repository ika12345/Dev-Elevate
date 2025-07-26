import express from "express";
import { createCourse, editCourse, deleteCourse, getAllCourses } from "../controller/courseController.js";
import isAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/courses").post(isAdmin, createCourse);
router.route("/courses").get(isAdmin, getAllCourses);
router.route("/courses/:courseId").delete(isAdmin, deleteCourse);
router.route("/courses/:courseId/:moduleId").put(isAdmin, editCourse);

export default router;