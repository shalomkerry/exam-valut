import { db } from "@/db"
import { exams } from "@/db/data_schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const examId = Number.parseInt(id)
    const { status } = await request.json()

    if (isNaN(examId)) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 })
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    const response = await db
      .update(exams)
      .set({ status })
      .where(eq(exams.id, examId))
      .returning({id:exams.id})
    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error("Update exam error:", error)
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 })
  }
}