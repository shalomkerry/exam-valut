"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Eye, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { exams,examImages } from "@/db/data_schema"
import { db } from "@/db"

export type ExamImages = typeof examImages.$inferSelect;

interface Exam {
    id: number;
    title: string;
    year: string;
    type: "final" | "midterm" | "quiz";
    subject_id: number;
    status: "pending" | "approved" | "rejected";
    created_at: Date;
    createdByUserId: string | null;
}

interface AdminExamCardProps {
  exam: Exam,
  images:any
  showActions?: boolean
}
export function AdminExamCard({ exam, images, showActions = true }: AdminExamCardProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null)
const id = exam.id
  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(action)

    try {
      const response = await fetch(`/api/admin/exams/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error(`Failed to ${action} exam:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  const statusColor =
    {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }[exam.status] || ""

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{exam.year}</Badge>
            <Badge variant="secondary">{exam.type}</Badge>
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor}`}>{exam.status}</span>
          </div>
          <h3 className="mt-2 font-semibold">{exam.title}</h3>
          <p className="text-sm text-muted-foreground">{exam.title}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {images.length} pages
            </span>
            <span>Uploaded {new Date(exam.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/app/admin/review/${exam.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-1 h-4 w-4" />
              Review
            </Button>
          </Link>

          {showActions && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:bg-green-50 hover:text-green-700 bg-transparent"
                onClick={() => handleAction("approve")}
                disabled={isLoading !== null}
              >
                {isLoading === "approve" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                onClick={() => handleAction("reject")}
                disabled={isLoading !== null}
              >
                {isLoading === "reject" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
