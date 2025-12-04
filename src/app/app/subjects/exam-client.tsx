'use client'
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
  <header className="flex items-center justify-between mb-6">

    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
        EV
      </div>
      <div className="font-bold text-lg">ExamVault</div>
    </div>

    <nav className="flex gap-3 items-center">
      <button className="bg-slate-800 px-2 rounded-md py-2 flex gap-2" onClick={() => router.push("/app/upload")}>
      </button>
      <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center" >
      </div>

    </nav>
  </header>
        {exam.map((x: any, index: number) => (
          <div
            key={index}
            className="p-2 border rounded-lg flex justify-evenly shadow hover:bg-gray-100 hover:text-black cursor-pointer"
          >
            <h4 className="text-md font-bold">{x.exam.title}</h4>
            <p className="text-sm ">Year: {x.exam.year}</p>
            <p className="text-sm ">Type: {x.exam.type}</p>
            <p className="text-sm ">Num_Images: {x.images.length}</p>
          </div>
        ))}
      </div>
    )
}