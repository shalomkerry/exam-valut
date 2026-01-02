import { loadDepartments, loadSubjects } from "@/actions/FetchSubjects";
import DashboardClient from "./dashboard-client";
import auth from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Department, Subjects } from "@/types/types";

export default async function DashboardPage() {
  const subjects = await loadSubjects() as Subjects[];
  const departments = await loadDepartments() as Department[];
 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user?.name || session?.user?.email || "User";
  return (
<div className="p-6 max-w-5xl mx-auto">
  
<DashboardClient subjects={subjects} departments={departments} user={user}/>
</div>  
);
}