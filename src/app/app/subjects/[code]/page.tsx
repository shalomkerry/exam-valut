import { db } from "@/db"
import { exams } from "@/db/data_schema"
import { eq } from "drizzle-orm"


export default async function CoursePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const exam_data = await db.select().from(exams)
return(
    <>
    <div className="bg-blue-50 h-full">
        <div className="">

        </div>

    </div>
    </>
)


}