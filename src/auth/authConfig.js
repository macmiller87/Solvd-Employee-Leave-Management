export const authConfig = {
    jwt: {
        secret_Token: process.env.SECRET_TOKEN,
        expiresIn: process.env.EXPIRES_IN
    }
}