import {Request, Response } from "express";

export function sendMedInfo(req: Request, res: Response) {
    return res.status(203).json({finally: "Made it"});
}