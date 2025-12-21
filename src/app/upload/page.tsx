'use server'
import { loadSubjects } from "@/actions/FetchSubjects"
import UploadForm from "@/components/ui/comp/upload-form"
import auth from "@/lib/auth/auth"
import { headers } from "next/headers"
import UploadClient from "./uploadclient"
export default async function UploadPage() {
  const subjects = await loadSubjects()

 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user 
 ? {id:session.user.id,role:session.user.role}
 : {id:'',role:''}
  return (
    <div className="min-h-screen min-w-screen  flex flex-col justify-center align-center bg-background">
      <UploadClient/>
      <UploadForm subjects={subjects} user={user}/>
    </div>
  )
}
