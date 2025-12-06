import { ReactNode } from "react";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { exams, examImages } from "@/db/data_schema";
import { loadSubjects } from "@/actions/FetchSubjects";
import Header from "./header";

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
  console.log(subject)
  const selected = Object.fromEntries(
    Object.entries(subject).filter(([_,v])=>v.id==subjectId)
  )
  const title : string = selected[1]?.title ||  ''
  return (
    <>
    <Header title={title}/>
    {children}
    </>
  );
}