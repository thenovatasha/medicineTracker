import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import fs from 'fs';
import path from 'path';
import { StatusResponse } from "../../types/ResponseStatus";
import { DatabaseError } from "../../types/Errors";
import { ConfigError } from "../../types/Errors";
import { UnexpectedError } from "../../types/Errors";
export async function logError(err: Error) {
    const logMessage = `[${new Date().toISOString()}] ${err.name}: ${err.message}\n${err.stack}\n\n`;

    // Log to console
    console.error(logMessage);
    // and to file
    const logFilePath = path.join(import.meta.dirname, 'error.log');
    fs.appendFile(logFilePath, logMessage, (fileErr) => {
        if (fileErr) {
            console.error('Failed to write to log file:', fileErr);
        }
    });
}
export const apiErrHandler: ErrorRequestHandler = async (err: Error, req: Request, 
                    res: Response<StatusResponse>, next: NextFunction) => {

    if(err) {
        await logError(err);
        return res.status(500).json({status: "failure"});
    }

    return res.status(200).json({status: "success"});
}

export const onBoardErrHandler: ErrorRequestHandler = async (err: Error, req: Request, 
                    res: Response<StatusResponse>, next: NextFunction) => {

    console.log("onBoardErrorHandler saying hi");
    if(err) {
        await logError(err);
        return res.status(400).json({status: "failure"});
    }
    return res.status(200).json({status: "success"});
}

/**
 * Handle the different types of errors
 * TODO: Yet to implement some of the response types
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const globalErrorHandler: ErrorRequestHandler = async (err: Error, req: Request,
                    res:Response<StatusResponse>, next: NextFunction) => {
    // handle global error
    if(err) {
        await logError(err);
        if(err instanceof DatabaseError) {
            return res.status(500).json({status: "failure"});
        }
        if(err instanceof ConfigError) {
            return res.status(503).json({status: "failure"});
        }
        if(err instanceof UnexpectedError) {
            return res.status(500).json({status: "failure"});
        }
        return res.status(500).json({status: "failure"});
    }
    return res.status(200).json({status: "success"});
}