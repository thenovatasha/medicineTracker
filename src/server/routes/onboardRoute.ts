import { signupHandler } from "../middleware/signup";
import { Router } from "express";
import loginMiddleware from "../middleware/login";
import { bodyChecker } from "../util/validations";
import { onBoardErrHandler } from "../middleware/err.handlers";
export const onBoardRouter = Router();

onBoardRouter.use(bodyChecker("onBoardHandler")); // validations


onBoardRouter.post("/signup", signupHandler);
onBoardRouter.post("/login", loginMiddleware);

onBoardRouter.use(onBoardErrHandler) // error handler;