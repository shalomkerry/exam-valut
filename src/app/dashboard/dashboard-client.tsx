'use client'
import { useState } from "react";
import { useRouter} from "next/navigation";
import {Subjects} from "@/types/types"
import {Search } from"lucide-react"
import Link from "next/link";
import HeaderComponent from "@/components/ui/comp/header";
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
    const handleReset = () => {
      setQuery("");
      setSubjectFilter("");
      setTypeFilter("");
    };
    const userName = user
  const filtered = subjects.filter((e:any) => {
    const q = query.trim().toLowerCase();
    if (q && !(`${e.title}`.toLowerCase().includes(q))) return false;
    if (subjectFilter && !e.title.toLowerCase().includes(subjectFilter.toLowerCase())) return false;
    if(typeFilter && !e.type.toLowerCase().includes(typeFilter.toLowerCase()))return false
    return true;
  });
   return <>

 <HeaderComponent user={user}/> 
  <section className="text-center ml-20 mb-6">
    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Exam Vault</h1>
    <p className="mt-2 text-2xl md:text-3xl text-white">
      A catalog of <span className="text-purple-500 font-semibold">previous</span> year <span className="text-purple-500 font-semibold">exams</span>
    </p>
  </section>

  <section className="mb-12 flex items-center justify-center">
    <div className="flex justify-center z-20 overflow-hidden gap-3 w-[800px] items-center border-solid bg-blend-darken shadow-[12px_10bpx_13.3px_2px_rgba(177,177,177,0.25)] border-[#EFEAEA] border-2 rounded-2xl bg-[#010206] ">
      <select 
        value={subjectFilter} 
        onChange={(e) => setSubjectFilter(e.target.value)}
        className="px-4 py-2 rounded-xl z-0 rounded-tl-lg rounded-bl-lg outline-none w-40 bg-gray-900 "
      >
        <option value="">Courses {subjects.length}</option>

        {subjects.map((exam:any)=>(
          <option  key={exam.id} value={`${exam.title}`}>{exam.title}</option>
        ))}
      </select>
      <input
        aria-label="Search exams"
        placeholder="Search by course"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none outline-none w-full"/>
          <Search className="w-16 mr-2"/>
    </div>

          <button
            type="button"
            onClick={handleReset}
            className="ml-2 rounded-md px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Reset
          </button>
  </section>

  <section>
      <div className="grid grid-cols-1h  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filtered.map((exam:any) => (
        <Link key={exam.id} href={`/courses/${exam.id}`}>
          <div key={exam.id} className="hover:-translate-y-2 hover:drop-shadow-blue-600 bg-[#3C3E46] rounded-md text:md hover:shadow-zinc-400 shadow-lg hover:text-red-950 overflow-hidden h-[200px] flex flex-col">
            <img src={exam.image} alt="" className="w-full h-3/4"/>
            <div className="m-auto px-2 py-1">
              <h3 className="text-white font-bold leading-tight">{exam.title}</h3>
              </div>
            </div>

                </Link>
        ))}
      </div>
    
  </section>

  <footer className="mt-9 text-center text-gray-500">
    <small>Signed in as {userName}</small>
  </footer>
   </> 
}