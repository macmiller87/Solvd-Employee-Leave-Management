import crypto from 'node:crypto';

export class GenerateJWT {

    async generateJWT(payload, secret_Token) {

        const header = { 
            typ: "JWT",
            alg: "HS256"
        }
    
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
        const signature = crypto
                .createHmac('sha256', secret_Token)
                .update(`${encodedHeader}.${encodedPayload}`)
                .digest('base64url');

        const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    
        return token;
    }

}