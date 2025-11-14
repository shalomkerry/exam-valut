"use client";

import { authClient } from "@/lib/auth/auth-client";
import { redirect,useRouter } from "next/navigation";
import { useState } from "react";

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
};
export default function App(){
    
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
const {data:session} = authClient.useSession()
    if(!session?.user){
        redirect('/')
    }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/signin')
  };
   const name = session.user.name 
    return(<>
            <h1 id="home-title">Welcome{ name?`, ${name}` : ""}!</h1>

            <p style={{ marginTop: 12 }}>
              <button className='btn primary'onClick={handleSignOut}>
                Sign out
              </button>
            </p>

    </>)
}