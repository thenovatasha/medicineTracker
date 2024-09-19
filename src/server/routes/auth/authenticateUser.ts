import {Request, Response } from "express";

export function authenticateUser(req: Request, res: Response) {
    res.json({status: `Acknowledged ${req.cookies.cooks}`});
}