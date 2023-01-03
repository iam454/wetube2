import express from "express";
import { see } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", see);

export default videoRouter;
