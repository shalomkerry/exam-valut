'use client'
import { Button } from "@/components/ui/button"
import { AdminExamCard } from "@/components/ui/comp/admin-exam-card";
import { useRouter } from "next/navigation"

type SinglePendingExam = {
  exam: {
    id: number;
    title: string;
    year: string;
    type: "final" | "midterm" | "quiz";
    subject_id: number;
    status: "pending" | "approved" | "rejected";
    created_at: Date;
    createdByUserId: string | null;
    university:string|null
  };
  images: any
};
type AdminClientProps = {
  fetchedExams: SinglePendingExam[];
};


export default function AdminClient({fetchedExams}:AdminClientProps){
  const router = useRouter()
    return (
      <div className="w-full max-w-md m-auto mt-20 space-y-6">
      <div className="flex justify-center align-center gap-5">
        <button onClick={()=>router.push('/dashboard')}>Dashboard</button>
        <Button onClick={()=> router.push('/admin/upload')}>Upload</Button>
      </div>
        <h1 className="text-blue-600 text-center">This is where you review stuff</h1>
        <div className="mt-4">
          {fetchedExams.map((examData:any) => (
            <AdminExamCard key={examData.exam.id} exam={examData.exam} images={examData.images} />
          ))} 
        </div>
      </div>
  ) 

}
