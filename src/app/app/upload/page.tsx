import Link from "next/link"
import { GraduationCap, Upload } from "lucide-react"
import { db } from "@/db"
import { loadSubjects } from "@/actions/FetchSubjects"
import UploadForm from "@/components/ui/comp/upload-form"

async function getCourses() {
  const courses = await loadSubjects()
     return courses
  
}

export default async function UploadPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen min-w-screen  flex flex-col justify-center align-center bg-background">

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Upload Exam</h1>
          <p className="mt-2 text-muted-foreground">
            Upload past exam papers to help fellow students. All uploads are reviewed before being published.
          </p>
        </div>


      </main>
      <UploadForm courses={courses}/>
    </div>
  )
}
