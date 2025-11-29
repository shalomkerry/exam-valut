'use client'
import { Button } from "@/components/ui/button"
import { AdminExamCard } from "@/components/ui/comp/admin-exam-card";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

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
  };
  images: any
};
type AdminClientProps = {
  fetchedExams: SinglePendingExam[];
};


export default function AdminClient({fetchedExams}:AdminClientProps){
  const router = useRouter()

    return (
      <>
        <Button onClick={()=>router.push('/app/dashboard')}>Home</Button>
        <h1 className="text-blue-600">Welcome to the dashboard You fools</h1>
        <button onClick={()=> router.push('/app/admin/upload')}>Upload</button>

        <div className="mt-4">
          {fetchedExams.map((examData:any) => (
            <AdminExamCard key={examData.exam.id} exam={examData.exam} />
          ))} 
        </div>
      </>
  ) 

}
