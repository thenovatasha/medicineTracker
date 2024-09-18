import { Request, Response } from "express";
import { createMedicine } from "../../db/insert";

export async function displayDashboard(req: Request, res: Response) {
    console.log("INSIDE DISPLAY DASHBOARD");
	console.log(req.body.user);
	// createMedicine(req.body.user, {name: "tufnil", size: 20});

}
