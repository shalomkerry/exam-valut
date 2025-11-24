import { loadExams, loadSubjects } from "@/actions/FetchSubjects";
import AdminClient from "./admin-client";
 
type subjectOptions = {
  value:string,
  label:string

}
export default async function AdminPage(){
 const subjects = await loadSubjects() 
 const exams = await loadExams()
    return (
      <>
     <AdminClient initialSubjects={subjects} initialExams={exams}/> 
      </>
    )
}




 

