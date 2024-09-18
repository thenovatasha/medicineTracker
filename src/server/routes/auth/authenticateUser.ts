import {Request, Response } from "express";

export function authenticateUser(req: Request, res: Response) {
    console.log("COOKIES: ", req.cookies.cooks);
    res.json({status: "Acknowledged"});
}