import { db } from "@/db";
import { exams } from "@/db/data_schema";
import { eq } from "drizzle-orm";
import ExamClient from "./exam-client";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const {code} = await params
  
  return (
    <ExamClient/>
  )
}