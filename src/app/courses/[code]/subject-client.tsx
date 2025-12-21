'use client'
import Link from "next/link";
import { useMemo, useState } from "react";
import { Calendar, File, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyExamsCard from "@/components/ui/comp/empty-exams-card";

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
  const [filterByYear,setFilterByYear] = useState('')
  const [filterByType,setFilterByType] = useState('')
  const [page,setPage] = useState(1)

  const ITEMS_PER_PAGE = 12;

  const resetFilters = () => {
    setFilterByYear('');
    setFilterByType('');
  };

  const years = useMemo(() => Array.from(new Set(exam.map((e) => e.exam.year))).sort(), [exam]);
  const types = useMemo(() => Array.from(new Set(exam.map((e) => e.exam.type))), [exam]);

  const filteredExam = useMemo(
    () =>
      exam.filter((e) => {
        const matchYear = filterByYear ? e.exam.year === filterByYear : true;
        const matchType = filterByType ? e.exam.type === filterByType : true;
        return matchYear && matchType;
      }),
    [exam, filterByYear, filterByType]
  );

  const totalPages = Math.max(1, Math.ceil(filteredExam.length / ITEMS_PER_PAGE));
  const pageSafe = Math.min(page, totalPages);
  const startIndex = (pageSafe - 1) * ITEMS_PER_PAGE;
  const currentPageItems = filteredExam.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  if (exam.length === 0) {
    return (
      <div className="flex flex-col gap-4 mt-5 h-full">
        <EmptyExamsCard />
      </div>
    )
  }
    return(
    <div className="flex flex-col gap-4 mt-5 h-full">
      <div className="m-auto border border-t-12 rounded-lg border-[#FFFFFF] border-b-0 border-t-0  px-3 flex gap-5 items-center">
        <p>{exam.length} exam{exam.length>1?<span>s</span>:''}</p>
    <div className="flex gap-2 px-4 py-2 rounded-xl z-0 rounded-tl-lg rounded-bl-lg outline-none bg-[#1E1E1E]">
     <Calendar />
      <select 
        value={filterByYear} 
        onChange={(e) => setFilterByYear(e.target.value)}
        className="bg-[#1E1E1E] outline-none border-none"
      >
        <option value="">
          Year</option>
        {years.map((year)=>(
          <option  key={year} value={year}>{year}</option>
        ))}
      </select>
      </div>
    <div className="flex gap-2 px-4 py-2 rounded-xl z-0 rounded-tl-lg rounded-bl-lg outline-none bg-[#1E1E1E]">
      <File className="h-23"/>
      <select 
        value={filterByType} 
        onChange={(e) => setFilterByType(e.target.value)}
        className="bg-[#1E1E1E] outline-none border-none"
      >
        <option value="">Type</option>
        {types.map((type)=>(
          <option  key={type} value={type}>{type}</option>
        ))}
      </select>
      </div>
         <button
           className="ml-3 rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
           onClick={resetFilters}
           type="button"
         >
           Reset
         </button>
      </div>


        <div className="mx-auto w-full max-w-3xl rounded-lg border border-slate-700 bg-[#1b1b1b] p-4 text-white">
          {currentPageItems.length === 0 ? (
            <p className="text-center text-sm text-slate-300">No exams match these filters.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {currentPageItems.map((x: any, index: number) => {
                const pageNumber = startIndex + index + 1;
                const pagesCount = Array.isArray(x.images) ? x.images.length : 0;
                return (
                  <li
                    key={x.exam.id}
                    className="rounded-md border border-transparent bg-[#222222] px-4 py-3 shadow transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-indigo-400/20"
                  >

                    <Link className="text-indigo-300 hover:text-indigo-200" href={`/courses/${x.exam.subject_id}/exams/${x.exam.id}`}>
                    <p className="text-sm font-semibold leading-relaxed">
                      <span className="text-white">{pageNumber}.</span>
                      <span className="text-slate-300"> Title: </span>
                        &ldquo;{x.exam.title}&rdquo;
                      <span className="ml-2 text-slate-300">Year:</span>
                      <span className="ml-1 text-indigo-300">{x.exam.year}</span>
                      <span className="ml-2 text-slate-300">Type:</span>
                      <span className="ml-1 text-indigo-300 capitalize">{x.exam.type}</span>
                      <span className="ml-2 text-slate-300">Pages:</span>
                      <span className="ml-1 text-white">{pagesCount}</span>
                    </p>

                      </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mx-auto flex items-center justify-center gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-white transition hover:border-indigo-400 hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => goToPage(pageSafe - 1)}
            disabled={pageSafe === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === pageSafe;
            return (
              <button
                key={pageNum}
                className={`h-10 w-10 rounded-md border text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-slate-900"
                    : "border-slate-800 bg-[#3F3F3F] text-white hover:border-indigo-400 hover:text-indigo-200"
                }`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-white transition hover:border-indigo-400 hover:text-indigo-200 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => goToPage(pageSafe + 1)}
            disabled={pageSafe === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    )
}