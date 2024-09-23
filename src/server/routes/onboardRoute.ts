import { signupHandler } from "./signup";
import { Router } from "express";
import loginMiddleware from "./auth/login";
import { bodyChecker } from "./validationHandlers";
import { onBoardErrHandler } from "../middleware/error/err.handlers";
export const onBoardRouter = Router();

onBoardRouter.use(bodyChecker("onBoardHandler")); // validations

onBoardRouter.post("/signup", signupHandler);
onBoardRouter.post("/login", loginMiddleware);

onBoardRouter.use(onBoardErrHandler) // error handler;