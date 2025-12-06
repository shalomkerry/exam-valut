import { ReactNode } from "react";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { exams, examImages } from "@/db/data_schema";
import SubjectClientWrapper from "./SubjectClientWrapper";


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
  // Assuming 'code' in the URL represents the Subject ID
  const { code } = await params;
  console.log(code)
  const subjectId = Number(code);

  if (isNaN(subjectId)) {
    return <div>Invalid Subject ID</div>;
  }

  const examData = await getSubjectExams(subjectId);

  return (
    <SubjectClientWrapper initialExams={examData}>
      {children}
    </SubjectClientWrapper>
  );
}