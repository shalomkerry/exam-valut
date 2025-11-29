'use server'
import { loadSubjects } from "@/actions/FetchSubjects"
import UploadForm from "@/components/ui/comp/upload-form"
import auth from "@/lib/auth/auth"
import { headers } from "next/headers"
import Link from "next/link"


export default async function UploadPage() {
  const subjects = await loadSubjects()

 const currentHeaders = await headers();
 const session = await auth.api.getSession({
    headers: currentHeaders,
  });
 const user = session?.user 
 ? {id:session.user.id,role:session.user.role}
 : {id:'',role:''}
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
      <UploadForm subjects={subjects} user={user}/>
      <Link href="/app/dashboard" className="text-blue-500 hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  )
}
