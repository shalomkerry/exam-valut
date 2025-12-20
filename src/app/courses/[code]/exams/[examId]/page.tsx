import { db } from "@/db";
import { sql } from "drizzle-orm";
import { exams, examImages } from "@/db/data_schema";
import { eq } from "drizzle-orm";
import ExamClient from "./exam-client";
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

  return examsWithImages;
}


interface ImageType 
    {   id:number;
            exam_id:number,
            image_url:string,
            ocr_status:string,

            extracted_text:string,
            page_number:number
    }
type exam = {
    exam: {
        id: number;
        title: string;
        year: string;
        type: "final" | "midterm" | "quiz";
        subject_id: number;
        status: "pending" | "approved" | "rejected";
        created_at: Date;
        createdByUserId: string | null;
    };
    images:ImageType [
    ];
}


export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const {code} = await params
  const exam = await getExam(Number(code)) as exam[] 
  return (
    <ExamClient exam={exam}/>
  )
}