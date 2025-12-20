'use client'
import HeaderComponent from "@/components/ui/comp/header";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"
type exam = {
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
    images: unknown;
}

interface ExamListProp{
    exam:exam[]
}
export default function ExamClient({exam}:ExamListProp){

    const router = useRouter()
    return(
    <div className="flex flex-col gap-4 mt-5 h-full">
    
      <div className="m-auto border border-t-12 flex justify-between">
        <p>12 Exams</p>
        
      </div>


        {exam.map((x: any, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex items-center justify-center gap-3 
               shadow hover:bg-gray-100 hover:text-black cursor-pointer
               mx-auto w-[30em]"
          >

            <Link  href={`/courses/${x.exam.subject_id}/exams/${x.exam.id}`}>
           Go To individual page 
            </Link>
            <h4 className="text-md font-bold">{x.exam.title}</h4>
            <p className="text-sm ">Year: {x.exam.year}</p>
            <p className="text-sm ">Type: {x.exam.type}</p>
            <p className="text-sm ">Num_Images: {x.images.length}</p>
          </div>
        ))}
      </div>
    )
}