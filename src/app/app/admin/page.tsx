import { loadSubjects } from "@/actions/FetchSubjects";
import { headers } from "next/headers";
import AdminClientWrapper from "./AdminClientWrapper";
import auth from "@/lib/auth/auth";


export default async function AdminPage(){
 const subjects = await loadSubjects()  
 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user 
 ? {id:session.user.id,role:session.user.role}
 : {id:'',role:''}
    return (
      <>
     <AdminClientWrapper initialSubjects={subjects} user={user} /> 
      </>
    )
}






