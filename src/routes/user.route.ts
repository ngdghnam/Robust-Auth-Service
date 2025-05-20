import UserController from "../controllers/user.controller";
import express, { Router } from "express";

const userRouter: Router = express.Router();
const userController = new UserController();

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);
userRouter.put("/{:userId}", userController.updateUser);
userRouter.delete("/{:userId}", userController.deleteUser);
userRouter.post("/personal-user", userController.getUserByUserEmail);

export default userRouter;
