"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminReviewActionsProps {
  examId: number
}

export function AdminReviewActions({ examId }: AdminReviewActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null)

  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(action)

    try {
      const response = await fetch(`/api/admin/exams/${examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      })

      if (response.ok) {
        router.push("/app/admin/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error(`Failed to ${action} exam:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => handleAction("approve")}
        disabled={isLoading !== null}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading === "approve" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Approve
      </Button>
      <Button variant="destructive" onClick={() => handleAction("reject")} disabled={isLoading !== null}>
        {isLoading === "reject" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Reject
      </Button>
    </div>
  )
}
