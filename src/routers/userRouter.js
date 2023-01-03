import express from "express";
import { join } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", join);

export default userRouter;
