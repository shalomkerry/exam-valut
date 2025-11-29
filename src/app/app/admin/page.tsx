import AdminClient from "./admin-client";
import { db } from "@/db";
import { exams, subjects ,examImages} from "@/db/data_schema";
import { sql, desc, eq } from "drizzle-orm";

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
  };
  images: ExamImages[]
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
console.log(pendingExams)
  return (
    <>
      <AdminClient fetchedExams={pendingExams} />
    </>
  );
}






