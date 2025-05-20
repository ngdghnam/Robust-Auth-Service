import express, { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter: Router = express.Router();

authRouter.post("/register", AuthController.handleRegister);
authRouter.post("/login", AuthController.handleLogin);
authRouter.get("/token", AuthController.handleGetSecretToken);
authRouter.post("/refresh-token", AuthController.handleRefreshToken);

export default authRouter;
