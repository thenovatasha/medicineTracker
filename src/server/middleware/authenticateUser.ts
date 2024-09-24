import {NextFunction, Request, Response } from "express";
import { decodeAccessToken, decodeRefreshToken } from "../util/tokens";
import { getRefreshToken } from "../../db/find";
import { Payload } from "../../types/Payload";
import { assert } from "console";
import { Unauthorized } from "../../types/ResponseStatus";
import { generateTokenPair } from "./login";
import { ConfigError, UnexpectedError } from "../../types/Errors";
enum ACCESS_STATE {
    INVALID_ACCESS_TOKEN,
    VALID_ACCESS_TOKEN,
    INVALID_REFRESH_TOKEN,
    VALID_REFRESH_TOKEN
}

export async function authorizeUser(req: Request, res: Response<Unauthorized>, next: NextFunction) {
    console.log("inside authorize user");
    const refreshToken = req.cookies.r_token;
    const responseUnauthorized: Unauthorized = {
        err: "unauthorized"
    } 
    let accessStatus: ACCESS_STATE = ACCESS_STATE.INVALID_ACCESS_TOKEN;
    let accessTokenDecoded;

    // check for valid access token   
    try {
        accessTokenDecoded = decodeAccessToken(req.cookies.a_token);
        accessStatus = ACCESS_STATE.VALID_ACCESS_TOKEN;
    } catch(e) {
        // if not a config error, 
        if(e instanceof ConfigError) {
            throw e;
        } else {
            accessStatus = ACCESS_STATE.INVALID_ACCESS_TOKEN;
        }
    }

    /* 
        Check if a valid refresh token exists to refresh the access.
        A valid refresh token is a token that is not yet revoked and is still
        within expiry
    */
    if(accessStatus === ACCESS_STATE.INVALID_ACCESS_TOKEN) {
        
        let refreshTokenDecoded: Payload;
        // check for validity of refresh token
        try {
            refreshTokenDecoded = decodeRefreshToken(req.cookies.r_token);        
            accessStatus = ACCESS_STATE.VALID_REFRESH_TOKEN;
        } catch (e) {
            accessStatus = ACCESS_STATE.INVALID_REFRESH_TOKEN;
            return res.status(403).json(responseUnauthorized)
        }
        assert(accessStatus === ACCESS_STATE.VALID_REFRESH_TOKEN);
        // ensure that the token wasn't revoked
        // TODO: Test this
        const db_result = await getRefreshToken(refreshTokenDecoded.username);
        if(!db_result) {
            return res.status(403).json(responseUnauthorized);
        }        
        const db_refresh_token = db_result.refreshToken;
        
        assert(db_refresh_token !== null);
        if(refreshToken !== db_refresh_token) {
            return res.status(403).json(responseUnauthorized);
        }

        // since all is passed, refresh token was valid and never used before. 
        // create a new pair and send back
        const {a_token, r_token} = generateTokenPair(refreshTokenDecoded.username)

        
        req.cookies.a_token = a_token; // for any handlers in the current request-response cycle
        req.body.username = refreshTokenDecoded.username;
        res.cookie("a_token", a_token);
        res.cookie("r_token", r_token);
    }

    // check if refresh token was previously used
    if(accessStatus === ACCESS_STATE.VALID_ACCESS_TOKEN) {
        if(!accessTokenDecoded) {
            throw new UnexpectedError("access token returned no payload, but access token was valid")
        }
        req.body.username = accessTokenDecoded.username;
    }
    next();
}