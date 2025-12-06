'use client'
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
    console.log(exam)
    return(
    <div className="flex flex-col gap-4 mt-5 h-full">
  <header className="flex items-center justify-around mb-6">
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
        <button onClick={()=>{router.push('/dashboard')}}>
        EV
        </button>
      </div>
    </div>

    <div className="flex gap-3 items-center">
      <button className="bg-slate-800 px-2 rounded-md py-2 flex gap-2" onClick={() => router.push("/app/upload")}>
        <CirclePlus/> Post Exam
      </button>
    </div>
  </header>
    <div className="flex justify-center items-center mx-auto">

    <h3> Number of Exams {exam.length}</h3>
    </div>
        {exam.map((x: any, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex items-center justify-center gap-3 
               shadow hover:bg-gray-100 hover:text-black cursor-pointer
               mx-auto w-[30em]"
          >

            <Link  href={`/subjects/${x.exam.subject_id}/exams/${x.exam.id}`}>
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