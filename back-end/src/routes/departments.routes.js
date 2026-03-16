import express from "express";
import { getDepartments } from "../controllers/departments.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";


const router = express.Router();
router.use(isAuthenticated);

router.get("/",restrictTo("SUPER_ADMIN", "RECEPTIONIST"), getDepartments);

export default router;