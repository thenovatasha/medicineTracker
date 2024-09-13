import { Request, Response } from "express";

export async function displayDashboard(req: Request, res: Response) {
  console.log("INSIDE DISPLAY DASHBOARD");

  console.log(req.body.user);
}
