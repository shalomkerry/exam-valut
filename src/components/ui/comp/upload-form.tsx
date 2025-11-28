"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, FileImage, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {Subjects} from "@/types/types"


interface UploadFormProps {
  courses: Subjects[]
}

export default function UploadForm({ courses }: UploadFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") || file.type === "application/pdf",
      )
      setFiles((prev) => [...prev, ...newFiles])
    }
  }
  useEffect(()=>{
    
  },[])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setUploadProgress("Creating exam record...")

    const formData = new FormData(e.currentTarget)

    try {
      // First, create the exam record
      const examResponse = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: formData.get("courseId"),
          year: formData.get("year"),
          semester: formData.get("semester"),
          examType: formData.get("examType"),
          title: formData.get("title"),
        }),
      })

      if (!examResponse.ok) {
        throw new Error("Failed to create exam record")
      }

      const { examId } = await examResponse.json()

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading page ${i + 1} of ${files.length}...`)

        const fileFormData = new FormData()
        fileFormData.append("file", files[i])
        fileFormData.append("examId", examId.toString())
        fileFormData.append("pageNumber", (i + 1).toString())

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: fileFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload page ${i + 1}`)
        }
      }

      setUploadProgress("Extracting text with OCR...")
      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      })

      if (!ocrResponse.ok) {
        console.error("OCR processing failed but upload succeeded")
      } else {
        const ocrResult = await ocrResponse.json()
        console.log(`OCR completed: ${ocrResult.pagesProcessed} pages processed, ${ocrResult.pagesFailed || 0} failed`)
      }

      setSuccess(true)
      setUploadProgress(null)

      // Redirect after success
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setUploadProgress(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-xl font-semibold">Upload Successful!</h2>
        <p className="mt-2 text-muted-foreground">
          Your exam has been submitted for review. You'll be redirected shortly.
        </p>
      </div>
    )
  }


  return (
    <div className="max-w-md m-auto w-[600px] px-12 py-3 rounded-md bg-slate-700">
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {/* Course Selection */}
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>
        <Select name="courseId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
              {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year and Semester */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select name="year" required>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      <div className="space-y-2">
        <Label htmlFor="examType">Exam Type</Label>
        <Select name="examType" required>
          <SelectTrigger>
            <SelectValue placeholder="Select exam type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="midterm">Midterm</SelectItem>
            <SelectItem value="Final">Final</SelectItem>
            <SelectItem value="Quiz">Quiz</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>

      {/* Exam Type */}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" name="title" placeholder="e.g., Midterm 1 - Solutions" />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Exam Pages</Label>
        <div
          className={cn(
            "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            files.length > 0 ? "border-primary/50 bg-primary/5" : "hover:bg-muted",
          )}
        >
          <input type="file" id="files" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          <label htmlFor="files" className="flex cursor-pointer flex-col items-center">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 font-medium">Click to upload images</p>
            <p className="mt-1 text-sm text-muted-foreground">PNG, JPG up to 10MB each</p>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <FileImage className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Page {index + 1} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting || files.length === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {uploadProgress || "Uploading..."}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Exam ({files.length} page{files.length !== 1 ? "s" : ""})
          </>
        )}
      </Button>
    </form>

    </div>
  )
}
