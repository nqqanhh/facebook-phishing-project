import { Router } from "express";
import authController from "../controllers/auth.controllers.js";
const userRouter = Router();
//
//login
userRouter.post("/login", authController.login);
//email
userRouter.post("/send-email", authController.sendEmail);
//
export default userRouter;
