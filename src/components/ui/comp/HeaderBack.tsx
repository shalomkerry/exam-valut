'use client';

import { ArrowLeft, CirclePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface HeaderProps {
  user:string;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter()
    return(
  <header className="flex items-center justify-between mb-6">

    <div className="flex gap-4 items-center">
    <div className="font-bold text-lg">
      <Link href='/dashboard'>
        ExamVault
      </Link> 
        </div>
    </div>
    <div>
      <button
        className="flex items-center gap-2 rounded-md px-3 py-2 text-md font-semibold transition hover:scale-105 hover:bg-slate-100 hover:text-slate-900"
        onClick={()=>{router.back()}}
      >
        <span className="border border-white rounded-[50%] ">
        <ArrowLeft className="h-6 w-6" />
        </span>
        Go back 
      </button>
    </div>
    <nav className="flex gap-3 items-center justify-center">

      <button className="bg-slate-800 px-2 rounded-md py-2 flex gap-2" onClick={() => router.push("/upload")}>
        <CirclePlus/> Post Exam
      </button>
      <div className="w-9 h-9 rounded-full bg-slate-500 flex items-center justify-center" >
        <h1 className="text-center text-black text-xl">{user[0]}</h1>
      </div>
    </nav>
  </header>
  
)
}
