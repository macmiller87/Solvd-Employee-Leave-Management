import { authConfig } from "./authConfig.js";
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
            response.status(401).json({ message: "Token Not found !" });
        }

        if(error.message === "invalid signature") {
            response.status(401).json({ message: "Token incorrect !" });
        }

    }
}
