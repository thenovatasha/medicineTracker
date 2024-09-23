import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

export function apiErrHandler(err: ErrorRequestHandler, req: Request, 
                    res: Response, next: NextFunction) {
    if(err) {
        return res.status(400).json({status: JSON.stringify(err)});
    }
    res.status(200).json({status: "end reached with no problems"});
}

export function onBoardErrHandler(err: ErrorRequestHandler, req: Request, 
                    res: Response, next: NextFunction) {

    if(err) {
        return res.status(400).json({status: JSON.stringify(err)});
    }
    res.status(200).json({status: "from onboard handler"});

}