import AdminClient from "./admin-client";
import { db } from "@/db";
import { exams, subjects ,examImages} from "@/db/data_schema";
import { sql, desc, eq } from "drizzle-orm";

export default async function AdminPage(){
  const pendingExams = await db
    .select({
      exam: exams,
      images: sql`json_agg(${examImages}.*)`.as("images"),
    })
    .from(exams)
    .leftJoin(examImages, eq(examImages.exam_id, exams.id))
    .where(eq(exams.status, "pending"))
    .groupBy(exams.id);

  // Map the pending exams to extract exams and their images
  const fetchedExams = pendingExams.map((exam: any) => ({
    exam: exam.exam,
    images: exam.images,
  }));

  console.log(fetchedExams); // Log the fetched exams and images for debugging

  return (
    <>
      <AdminClient fetchedExams={fetchedExams} />
    </>
  );
}






