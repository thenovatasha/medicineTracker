import * as express from "express";
import { authorizeUser } from "./auth/authenticateUser.js";
import { logoutHandler } from "./auth/logout.js";
import { sendMedInfo, newMedHandler, deleteMedHandler, updateMedHandler } from "./medicine.js";
export const router = express.Router();


router.use(authorizeUser);
router.post("/logout", logoutHandler); 

router.get("/meds", sendMedInfo); // get all the info related to this med
router.post("/meds", newMedHandler); // user creates a new medicine
router.delete("/meds", deleteMedHandler); // user deletes a previous medicine
router.post("/meds/update", updateMedHandler); // user updates a specific medicine

