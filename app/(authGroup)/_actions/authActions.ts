"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginState = {
    success : true,
    statusCode : number,
    message : string,
    data : {
        accessToken : string,
        refreshToken : string
    }
}


export const loginAction = async (prevState : LoginState , formData: FormData) => {

    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
        email,
        password
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(payload)
    });

    const result = await res.json();

    if(result.success){
        const cookieStore = await cookies()

        cookieStore.set("accessToken", result.data.accessToken , {
            httpOnly : true,
            maxAge : 60 * 60 * 24,
            sameSite : "lax",
        });
        cookieStore.set("refreshToken", result.data.refreshToken , {
            httpOnly : true,
            maxAge : 60 * 60 * 24 * 7,
            sameSite : "lax",
        });

        const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;

        if(decodedToken.role === "USER"){
            redirect("/customer");
        } else if (decodedToken.role === "ADMIN"){
            redirect("/admin");
        } else if (decodedToken.role === "AUTHOR"){
            redirect("/provider");
        }
    }

    return result
}