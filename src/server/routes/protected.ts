import * as express from "express";
import { authorizeUser } from "./auth/authenticateUser";
import { logoutHandler } from "./auth/logout";
import { sendMedInfo, newMedHandler, deleteMedHandler, updateMedHandler } from "./medicine";
import { body } from "express-validator";
import { cookieChecker, queryChecker, bodyChecker } from "./validationHandlers";
export const router = express.Router();

router.use(cookieChecker()); // ensure both cookies are set
router.use(authorizeUser);
router.post("/logout", logoutHandler);

router.get("/meds", sendMedInfo); // get all the info related to this med
router.put("/meds", bodyChecker('newMedHandler'), newMedHandler); // user creates a new medicine (idempotent)
router.delete("/meds", queryChecker(['name']), deleteMedHandler); // user deletes a previous medicine
router.patch("/meds/update/", bodyChecker('updateMedHandler'), updateMedHandler); // user updates a specific medicine

router.use(errHandler);

function errHandler(err: express.ErrorRequestHandler, req: express.Request, 
                    res: express.Response, next: express.NextFunction) {
    console.log("inside err handler");
    if(err) {
        return res.status(400).json({status: JSON.stringify(err)});
    }
    res.status(200).json({status: "end reached with no problems"});
}