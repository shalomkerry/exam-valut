import { db } from "@/db";
import { exams } from "@/db/data_schema";
import { eq } from "drizzle-orm";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const {code} = await params

  const exam = await db
  .select({
    exam: exams,
  })
  .from(exams)
  .where(eq(exams.subject_id, Number(code)))
  .groupBy(exams.id);

  return (
  <div>Preview page for subject </div>
  )
}