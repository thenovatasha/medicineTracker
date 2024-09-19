import * as express from "express";
import { authorizeUser } from "./auth/authenticateUser.js";
import { logoutHandler } from "./logout.js";
import { sendMedInfo } from "./medicine.js";
import { newMedHandler } from "./medicine.js";
export const router = express.Router();

router.use(authorizeUser);
router.get("/meds", sendMedInfo);
router.post("/logout", logoutHandler);

// user creates a new medicine
router.post("/meds", newMedHandler);
// user deletes a previous medicine

// user updates a specific medicine
