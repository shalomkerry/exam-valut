import { loadExams, loadSubjects } from "@/actions/FetchSubjects";
import auth from "@/lib/auth/auth";
import { headers } from "next/headers";
import AdminClientWrapper from "./AdminClientWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const subjects = await loadSubjects()
  const exams = await loadExams()
 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user 
 ? {id:session.user.id,role:session.user.role}
 : {id:'',role:''}
 
  // 2. Pass data to the Client Wrapper
  return (
    <div className="admin-layout-container">
      <AdminClientWrapper
        initialSubjects={subjects}
        initialExams={exams}
        user={user}
      >
        {/* All children (pages) are now wrapped and have access to data */}
        <main className="p-6">
            {children}
        </main>
      </AdminClientWrapper>
    </div>
  );
}