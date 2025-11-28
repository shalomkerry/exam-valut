'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AdminClient(){
  const router = useRouter()
    return (
      <>
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
        <h1 className="text-blue-600">Welcome to the dashboard You fools</h1>
        <button onClick={()=> router.push('/app/admin/upload')}>Upload</button>
      </>
  ) 

}