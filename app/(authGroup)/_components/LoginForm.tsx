"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { loginAction } from "../_actions/authActions"


const LoginForm = () => {

    const [state, action, pending] = useActionState(loginAction, false)
    // const router = useRouter()


    useEffect(()=> {
        if(!state) return;

        // if(state.success){
        //     toast.success(state.message || "Login Successful");
        //     // router.push("/customer")
        // }

        if(!state.success){
            toast.error(state.message || "Login failed");
        }
    }, [state]);


  return (
    <form action={action} className="space-y-4">
        <Card className="p-5 space-y-4">
            <Input name="email" type="email" placeholder="Enter Your Email" required />
            <Input name="password" type="password" placeholder="Enter Your Password" required />
            <Button type="submit">
                {
                    pending ? "Submitting..." : "Login"
                }
            </Button>
        </Card>
    </form>
  )
}

export default LoginForm