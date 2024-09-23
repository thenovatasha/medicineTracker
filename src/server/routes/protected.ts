import * as express from "express";
import { authorizeUser } from "./auth/authenticateUser.js";
import { logoutHandler } from "./auth/logout.js";
import { sendMedInfo, newMedHandler, deleteMedHandler, updateMedHandler } from "./medicine.js";


export const router = express.Router();

router.use(authorizeUser);
router.post("/logout", logoutHandler);

router.get("/meds", sendMedInfo); // get all the info related to this med
router.put("/meds", newMedHandler); // user creates a new medicine (idempotent)
router.delete("/meds", deleteMedHandler); // user deletes a previous medicine
router.patch("/meds/update/", updateMedHandler); // user updates a specific medicine

router.use(errHandler);

function errHandler(err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log("inside err handler");
    if(err) {
        res.status(400).json({status: JSON.stringify(err)});
    }
    res.status(200).json({status: "end reached with no problems"});
}