import {CirclePlus } from"lucide-react"
interface HeaderProp{
    user:string,
}
import { useRouter} from "next/navigation";
export default function HeaderComponent({user}:HeaderProp){
    const router = useRouter()
    return(
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
      {/* <Link  href={`/${main}`}>
        Go Back
      </Link> */}
      <button>
      </button>
    <nav className="flex gap-3 items-center justify-center">
      <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center" >
        <h1 className="text-center text-black text-xl">{user[0]}</h1>
      </div>
    </nav>
  </header>
    )

}