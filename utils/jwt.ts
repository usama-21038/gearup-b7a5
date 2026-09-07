import jwt from "jsonwebtoken";


const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Token verification failed";
        return {
            success: false,
            error: message
        }
    }
}


export const jwtUtils = {
    verifyToken
}