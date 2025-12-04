import { db } from "@/db"
import { examImages, exams, subjects } from "@/db/data_schema"
import { eq,sql} from "drizzle-orm"
import { notFound } from "next/navigation"
import  ExamClient from "../exam-client"

async function getExam(id: number) {
  const examsWithImages = await db
  .select({
    exam: exams,
    images: sql`json_agg(${examImages}.*)`.as("images"),
  })
  .from(exams)
  .leftJoin(examImages, eq(examImages.exam_id, exams.id))
  .where(eq(exams.subject_id, id))
  .groupBy(exams.id);

  return examsWithImages
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const examId = Number.parseInt(code)

  if (isNaN(examId)){
    console.log('yo hoo')
    notFound()}

  const exam = await getExam(examId)
  console.log(exam)
  if (!exam){
notFound()
  } 

return (
    <>
    <ExamClient exam={exam}/>
    </>
  );
}