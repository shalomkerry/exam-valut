import AdminClient from "./admin-client";
import { db } from "@/db";
import { exams, subjects ,examImages} from "@/db/data_schema";
import auth from "@/lib/auth/auth";
import { sql, eq } from "drizzle-orm";
 import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export type ExamImages = typeof examImages.$inferSelect;
type SinglePendingExam = {
  exam: {
    id: number;
    title: string;
    year: string;
    type: "final" | "midterm" | "quiz";
    subject_id: number;
    status: "pending" | "approved" | "rejected";
    created_at: Date;
    createdByUserId: string | null;
    university:string|null
  };
  images: any
};
export default async function AdminPage(){
  const pendingExams:SinglePendingExam[] = await db
    .select({
      exam: exams,
      images: sql<ExamImages[]>`json_agg(${examImages}.*)`.as("images"),
    })
    .from(exams)
    .leftJoin(examImages, eq(examImages.exam_id, exams.id))
    .where(eq(exams.status, "pending"))
    .groupBy(exams.id);
  
 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user?.role 
if(user=='approver'){
  redirect('/admin/upload')
}

if(user!='admin'  ){
  notFound()
}
  return (
    <>
      <AdminClient fetchedExams={pendingExams} />
    </>
  );
}






