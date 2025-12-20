import { ReactNode } from "react";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { exams, examImages } from "@/db/data_schema";
import { loadSubjects } from "@/actions/FetchSubjects";
import Header from "./header";
import auth from "@/lib/auth/auth";
import { headers } from "next/headers";
// Fetches all exams for a specific Subject ID
async function getSubjectExams(subjectId: number) {
  const examsWithImages = await db
    .select({
      exam: exams,
      // coalescing to empty array handles cases with no images
      images: sql`COALESCE(json_agg(${examImages}.*) FILTER (WHERE ${examImages.id} IS NOT NULL), '[]')`.as("images"),
    })
    .from(exams)
    .leftJoin(examImages, eq(examImages.exam_id, exams.id))
    .where(eq(exams.subject_id, subjectId))
    .groupBy(exams.id);

  return examsWithImages;
}
export default async function Layout({ children, params }: {children:ReactNode,  params: Promise<{ code: string }>}) {
  const { code } = await params;
  const subjectId = Number(code);
  if (isNaN(subjectId)) {
    return <div>Invalid Subject ID</div>;
  }

  const examData = await getSubjectExams(subjectId) 
  const subject = await loadSubjects()
 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user?.name || session?.user?.email || "User";
  const selected = Object.fromEntries(
    Object.entries(subject).filter(([_,v])=>v.id==subjectId)
  )

 const [selectedId] = Object.entries(selected)
 const ID = selectedId[1].title
  const title : string = ID ||  'Course Title'
  return (
<div className="p-6 max-w-6xl mx-auto">
    <Header user={user} />
    <h1 className="text-2xl font-bold text-center my-4">{title}</h1>
    {children}
    </div>
  );
}