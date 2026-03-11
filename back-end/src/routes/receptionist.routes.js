import express from "express";
import { createReceptionist, disableReceptionist, enableReceptionist, getReceptionists, updateReceptionist } from "../controllers/receptionistController.js";

const router = express.Router();

router.get("/receptionists", getReceptionists);
router.post("/receptionists", createReceptionist);
router.patch("/receptionists/:id", updateReceptionist);
router.patch("/receptionists/:id/enable", enableReceptionist);
router.patch("/receptionists/:id/disable", disableReceptionist);

export default router;