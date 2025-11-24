import { loadSubjects } from "@/actions/FetchSubjects";
import DashboardClient from "./dashboard-client";

export type Subjects_Type = {
  id: number;
  title: string;
  type:string;
  image:string,
  sub_code:string,
};

export default async function DashboardPage() {
  // const router = useRouter();
  const subjects = await loadSubjects() as Subjects_Type[]

  return (
<div className="p-6 max-w-6xl mx-auto">
  
<DashboardClient initialSubjects={subjects}/>

</div>  );
}