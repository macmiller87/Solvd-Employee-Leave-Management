import { authConfig } from "./authConfig.js";
import { AppError } from "../error/appError.js";
import pkg from 'jsonwebtoken';
const { verify } = pkg;

export async function EnsureUserAuthenticate(request, response) {

    try {

        const authToken = request.headers.authorization.replace(/bearer\s/ig, '');

        verify(authToken, authConfig.jwt.secret_Token, {
            audience: "boss",
            issuer: "bossLoginToken"
        });

        return true;

    }catch(error) {

        if(error.message === "jwt malformed") {
            throw new AppError("Token Not found !", 404);
        }

        if(error.message === "invalid signature") {
            throw new AppError("Token incorrect !", 401);
        }

        if(error.message === "jwt expired") {
            throw new AppError("Token expired, please authenticate again !", 401);
        }

    }
}
