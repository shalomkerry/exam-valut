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
 ? {id:session.user.id,role:session.user.role,name:session.user.name}
 : {id:'',role:'',name:'unknown'}
 let userName= user.name
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <UploadClient user={user} subjects={subjects}/>
    </div>
  )
}
