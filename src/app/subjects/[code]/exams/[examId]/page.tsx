import { db } from "@/db";

export default function Page({ params }: { params: { subjectId: string } }) {
  console.log("Subject ID:", params.subjectId) 

    // const exams = await db.select().from().
  return <div>Preview page for subject {params.subjectId}</div>;
}