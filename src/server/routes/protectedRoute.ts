import * as express from "express";
import { authorizeUser } from "../middleware/authenticateUser";
import { logoutHandler } from "../middleware/logout";
import { sendMedInfo, newMedHandler, deleteMedHandler, updateMedHandler } from "../middleware/medicine";
import { cookieChecker, queryChecker, bodyChecker } from "../util/validations";
import { apiErrHandler } from "../middleware/err.handlers";
import { getAllMeds } from "../../db/find";
export const apiRouter = express.Router();

apiRouter.use(cookieChecker()); // ensure both cookies are set
apiRouter.use(authorizeUser);
apiRouter.post("/logout", logoutHandler);

apiRouter.get("/meds", sendMedInfo)
apiRouter.put("/meds", bodyChecker('newMedHandler'), newMedHandler); // user creates a new medicine (idempotent)
apiRouter.delete("/meds", queryChecker(['name']), deleteMedHandler); // user deletes a previous medicine
apiRouter.patch("/meds/update/", bodyChecker('updateMedHandler'), updateMedHandler); // user updates a specific medicine

apiRouter.use(apiErrHandler);

