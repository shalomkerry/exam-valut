'use client'
import { useState,useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter} from "next/navigation";
import {Subjects} from "@/types/types"
import {CirclePlus } from"lucide-react"
import Link from "next/link";
interface DashboardClientProps{
    initialSubjects:Subjects[],
    user:any
}

export default function DashboardClient({initialSubjects,user}:DashboardClientProps){
    const router = useRouter()
    const [subjects,setSubjects] = useState(initialSubjects)
    const [query, setQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const userName = user
  const filtered = subjects.filter((e:any) => {
    const q = query.trim().toLowerCase();
    if (q && !(`${e.title}`.toLowerCase().includes(q))) return false;
    if (subjectFilter && !e.title.toLowerCase().includes(subjectFilter.toLowerCase())) return false;
    if(typeFilter && !e.type.toLowerCase().includes(typeFilter.toLowerCase()))return false
    return true;
  });
   return <>

  <button onClick={()=>router.push('/admin')}>hey</button>
  <header className="flex items-center justify-between mb-6">

    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 rounded-lg bg-[#666363] flex items-center justify-center text-white font-bold">
        EV
      </div>
      <div className="font-bold text-lg">ExamVault</div>
    </div>

      <button className="bg-slate-800 px-2 rounded-md py-2 flex gap-2" onClick={() => router.push("/upload")}>
        <CirclePlus/> Post Exam
      </button>
    <nav className="flex gap-3 items-center justify-center">
      <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center" >
        <h1 className="text-center text-black text-xl">{userName[0]}</h1>
      </div>
    </nav>
  </header>
  <section className="text-center mb-6">
    <h1 className="text-5xl m-0 leading-tight">Access Hundreds of Past Exam Papers</h1>
    <p className="text-gray-500 mt-2">
      Find past exam papers with ease. Search by subject to prepare for your next test.
    </p>
  </section>

  <section className="mb-6 flex items-center justify-center">
    <div className="flex justify-center z-20 overflow-hidden gap-3 w-[800px] items-center border-soli border-[#EFEAEA] border-2 rounded-2xl bg-[#010206] ">
      <select 
        value={subjectFilter} 
        onChange={(e) => setSubjectFilter(e.target.value)}
        className="px-4 py-2 rounded-xl z-0 rounded-tl-lg rounded-bl-lg outline-none w-40 bg-[#666363]"
      >
        <option value="">Subjects {subjects.length}</option>

        {subjects.map((exam:any)=>(
          <option value={`${exam.title}`}>{exam.title}</option>
        ))}
      </select>
      <input
        aria-label="Search exams"
        placeholder="Search by subject"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none outline-none w-full"/>
    </div>
  </section>

  <section>
    
      <div className="grid grid-cols-1h  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filtered.map((exam:any) => (
          <div key={exam.id} className="hover:-translate-y-2 hover:drop-shadow-blue-600 bg-white/70 rounded-lg shadow-sm overflow-hidden h-[340px] flex flex-col">
            <img src={exam.image} alt="" className="w-[300px] h-3/4"/>
            <div className="p-3 flex-1 flex flex-col gap-2">
              <h3 className="text-black font-bold leading-tight">{exam.title}</h3>
                <button  className="w-full hover:cursor-pointer hover:scale-110  hover:inset-ring-2   bg-indigo-50 rounded-lg px-2 py-2 border-none text-black text-md  font-medium">
            <Link key={exam.id} href={`/subjects/${exam.id}`}>
           Go To individual page 
            </Link>
                </button>

              </div>
            </div>
        ))}
      </div>
    
  </section>

  <footer className="mt-9 text-center text-gray-500">
    <small>Signed in as {userName}</small>
  </footer>
   </> 
}