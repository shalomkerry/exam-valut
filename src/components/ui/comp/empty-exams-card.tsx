"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilePlus } from "lucide-react"

interface EmptyExamsCardProps {
  title?: string
  description?: string
  actionHref?: string
  actionLabel?: string
}

export default function EmptyExamsCard({
  title = "No exams available",
  description = "There are currently no exams for this subject. You can help others by posting one.",
  actionHref = "/upload",
  actionLabel = "Post an exam",
}: EmptyExamsCardProps) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border border-slate-950 bg-[#1b1b1b] p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#222222] border border-slate-700">
          <FilePlus className="h-5 w-5 text-indigo-300" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-300">{description}</p>
          <div className="mt-4">
            <Button className="hover:scale-105">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
