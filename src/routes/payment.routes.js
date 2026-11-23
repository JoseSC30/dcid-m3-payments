import { Router } from "express";
import { registerPaymentRoutes } from "../controllers/payment.controller.js";
const router = Router();
registerPaymentRoutes(router);
export default router;
