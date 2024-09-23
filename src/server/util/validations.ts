import { NextFunction } from "express";
import {Request, Response } from "express-serve-static-core";
import { body, cookie, query, validationResult } from "express-validator";


/**
 * Ensure cookies are in the request
 * @returns V
 */
export function cookieChecker() {
    return [cookie(["a_token", "r_token"]).trim().notEmpty().isString(), resultValidator];
}

/**
 * Ensure that there are no errors from the validators. If there is, pass it to the error handler
 * @returns 
 */
function resultValidator(req: Request, res: Response, next: NextFunction) {

    const result = validationResult(req);
    if(!result.isEmpty()) {
        return next(result);
    }
    next();
}

export function queryChecker([...params]: string[]) {
    return [query(params).trim().notEmpty().isString(), resultValidator];
}

/**
 * Check if the body parameters satisfy the middleware requirements, if any error,
 * pass the error into the error handling middleware
 * @param middleware 
 * @returns array of middlewares for express to go through
 */
export function bodyChecker(middleware: string) {
    // for creating a new medicine
    if(middleware === 'newMedHandler') {
        return [
            body('name').trim().notEmpty().isString(),
            body(['height', 'width', 'startingDose', 'missed', 'startDate']).notEmpty().isNumeric(),
            body('dosages').notEmpty().isArray(),
            resultValidator
        ];
    }
    // for updating the medicine
    else if(middleware === 'updateMedHandler') {
        return [
            body(['medicine', 'type']).trim().notEmpty().isString(),
            body('amount').notEmpty().isNumeric(),
            resultValidator
        ];
    // for login and signup
    } else if(middleware === "onBoardHandler") {
        return [
            body(["username", "password"]).trim().notEmpty().isString(),
            body("username").isLength({min: 2, max: 50}),
            body("password").isLength({min: 6}),
            resultValidator
        ];
    } else {
        return [];
    }
}