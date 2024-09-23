import * as express from "express";
import { authorizeUser } from "./auth/authenticateUser";
import { logoutHandler } from "./auth/logout";
import { sendMedInfo, newMedHandler, deleteMedHandler, updateMedHandler } from "./medicine";
import { cookieChecker, queryChecker, bodyChecker } from "./validationHandlers";
import { apiErrHandler } from "../middleware/error/err.handlers";
export const apiRouter = express.Router();

apiRouter.use(cookieChecker()); // ensure both cookies are set
apiRouter.use(authorizeUser);
apiRouter.post("/logout", logoutHandler);

apiRouter.get("/meds", sendMedInfo); // get all the info related to this med
apiRouter.put("/meds", bodyChecker('newMedHandler'), newMedHandler); // user creates a new medicine (idempotent)
apiRouter.delete("/meds", queryChecker(['name']), deleteMedHandler); // user deletes a previous medicine
apiRouter.patch("/meds/update/", bodyChecker('updateMedHandler'), updateMedHandler); // user updates a specific medicine

apiRouter.use(apiErrHandler);

