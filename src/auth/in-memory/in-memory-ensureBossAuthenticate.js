import { authConfig } from "../authConfig.js";
import { AppError } from "../../error/appError.js";
import crypto from 'node:crypto';

export async function EnsureUserAuthenticate(token) {

    const [encodedHeader, encodedPayload, signature] = token.split('.');

    const validSignature = crypto
        .createHmac('sha256', authConfig.jwt.secret_Token)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    const checkSignature = signature === validSignature ? true : false;

    if(checkSignature === false) {
        throw new AppError("Invalid Token !", 401);
    }

    return checkSignature;
}
