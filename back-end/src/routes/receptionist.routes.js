import express from "express";
import {
  createReceptionist,
  disableReceptionist,
  enableReceptionist,
  getReceptionistDashboard,
  getReceptionists,
  updateReceptionist,
} from "../controllers/receptionist.controller.js";
import { isAuthenticated, restrictTo } from "../middleware/auth.middleware.js";
import { createReceptionistSchema, updateReceptionistSchema } from "../validations/receptionist.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/dashboard", restrictTo("RECEPTIONIST"), getReceptionistDashboard);

router.use(restrictTo("SUPER_ADMIN"));
router.get("/", getReceptionists);
router.post("/", validate(createReceptionistSchema), createReceptionist);
router.patch("/:id", validate(updateReceptionistSchema), updateReceptionist);
router.patch("/:id/enable", enableReceptionist);
router.patch("/:id/disable", disableReceptionist);

export default router;
