import express from "express";
import {Register,Login} from "../controllers/auth.js";
import { authenticateToken } from "../middlewares/authToken.js";
const router = express.Router();
router.post("/signin", Login);
router.post("/signup", Register);
export default router;