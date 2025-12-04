import { loadSubjects } from "@/actions/FetchSubjects";
import DashboardClient from "./dashboard-client";
import auth from "@/lib/auth/auth";
import { headers } from "next/headers";

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
 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user?.name || session?.user?.email || "User";
  return (
<div className="p-6 max-w-6xl mx-auto">
  
<DashboardClient initialSubjects={subjects} user={user}/>

</div>  );
}