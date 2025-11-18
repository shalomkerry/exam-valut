"use client"
import { authClient } from "@/lib/auth/auth-client";

export default function AdminPage(){
  const { data: session } = authClient.useSession();
    console.log(session?.user)
    return (
        <>
       <h1>Hey Shalom</h1> 
        </>
    )
}