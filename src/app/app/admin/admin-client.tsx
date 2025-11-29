'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
type pendingProp = {
  exam:{ id: number; title: string; year: string; type: "final" | "midterm" | "quiz"; subject_id: number; status: "pending" | "approved" | "rejected"; created_at: Date; createdByUserId: string | null; }
  images:unknown
}
// interface AdminProps{
//   pendingExams:pendingProp[]
// }
export default function AdminClient({fetchedExams}:any){
  const router = useRouter()
    return (
      <>
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
        <h1 className="text-blue-600">Welcome to the dashboard You fools</h1>
        <button onClick={()=> router.push('/app/admin/upload')}>Upload</button>

        <div className="mt-4">
          {fetchedExams.map((examData:any) => (
            <div key={examData.exam.id} className="border p-4 mb-4 rounded shadow">
              <h2 className="text-lg font-bold">{examData.exam.title} ({examData.exam.year})</h2>
              <p>Type: {examData.exam.type}</p>
              <p>Status: {examData.exam.status}</p>
              <p>Subject ID: {examData.exam.subject_id}</p>
              <p>Created At: {new Date(examData.exam.created_at).toLocaleDateString()}</p>

              <div className="mt-2">
                <h3 className="font-semibold">Images:</h3>
                {Array.isArray(examData.images) && examData.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {examData.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Exam ${examData.exam.id} Image ${index + 1}`}
                        className="w-full h-auto border rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
  ) 

}
