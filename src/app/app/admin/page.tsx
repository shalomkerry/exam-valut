import { loadExams, loadSubjects } from "@/actions/FetchSubjects";
import AdminClient from "./admin-client";

export default async function AdminPage(){
 const subjects = await loadSubjects()  
 const exams = await loadExams()
    return (
      <>
     <AdminClient initialSubjects={subjects} /> 
      </>
    )
}




 

