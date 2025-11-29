import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db"
import { AdminReviewActions } from "@/components/ui/comp/admin-review-action"
import { eq, asc } from "drizzle-orm"
import { examImages, exams } from "@/db/data_schema"

async function getExam(id: number) {
  const [exam] = await db
    .select()
    .from(exams)
    .where(eq(exams.id, id))

  return exam
}

// ---- Load pages for this exam ----
async function getPages(examId: number) {
  return await db
    .select()
    .from(examImages)
    .where(eq(examImages.exam_id, examId))
    .orderBy(asc(examImages.page_number))
}

// ---- Page Component ----
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const examId = Number.parseInt(id)


  if (isNaN(examId)) notFound()

  const exam = await getExam(examId)
  if (!exam) notFound()

  const pages = await getPages(examId)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Exam Vault</span>
          </Link>
          <Badge variant="secondary">Admin Review</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Link */}
        <Link
          href="/app/admin"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Exam Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{exam.year}</Badge>
              <Badge variant="secondary">{exam.type}</Badge>

              <Badge
                variant={
                  exam.status === "approved"
                    ? "default"
                    : exam.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {exam.status}
              </Badge>
            </div>

            <h1 className="mt-3 text-2xl font-bold">
              {exam.title} – {exam.type}
            </h1>
          </div>

          {exam.status === "pending" && (
            <AdminReviewActions examId={exam.id} />
          )}
        </div>

        {/* Pages Grid */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Exam Pages ({pages.length})
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {pages.map((page) => (
              <div
                key={page.id}
                className="rounded-lg border bg-card overflow-hidden"
              >
                <div className="relative aspect-[8.5/11] bg-muted">
                  <Image
                    src={page.image_url || "/placeholder.svg"}
                    alt={`Page ${page.page_number}`}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Page {page.page_number}
                    </span>

                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
