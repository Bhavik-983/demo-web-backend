import express from "express";
import adminRouter from "./admin.route.js";
import authRouter from "./auth.route.js";
import managerRouter from "./manager.route.js"

const router = express.Router();

// API Routes
router.use("/auth", authRouter);      // Authentication routes
router.use("/admin", adminRouter);    // Admin specific routes
router.use("/manager",managerRouter)

export default router;
