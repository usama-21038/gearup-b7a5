"use server"

import { cookies } from "next/headers";
import type { CurrentUserResponse } from "@/types/user";

export const getMe = async (): Promise<CurrentUserResponse> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;

    if(!accessToken){
        return {
            success : false,
            message : "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers : {
            Cookie : `accessToken=${accessToken}`
        },
        cache : "force-cache",
        next : {
            revalidate : 60 * 60 * 24,
            tags : ["my-profile"]
        }
    });

    return res.json();
}