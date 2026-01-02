'use client'
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import HeaderComponent from "@/components/ui/comp/header";
import { Department, Subjects } from "@/types/types";

interface DashboardClientProps {
  subjects: Subjects[];
  departments: Department[];
  user: string;
}

export default function DashboardClient({ subjects, departments, user }: DashboardClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const subjectCountByDepartment = useMemo(() => {
    return subjects.reduce((acc, subj) => {
      const deptId = subj.departmentId;
      acc[deptId] = (acc[deptId] ?? 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [subjects]);

  const filteredDepartments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((dept) => dept.name.toLowerCase().includes(q));
  }, [departments, query]);

  const filteredSubjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Subjects[];
    return subjects.filter((subj) => subj.title.toLowerCase().includes(q));
  }, [query, subjects]);

  return (
    <>
      <HeaderComponent user={user} />

      <section className="text-center ml-20 mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Exam Vault</h1>
        <p className="mt-2 text-2xl md:text-3xl text-white">
          Browse <span className="text-purple-500 font-semibold">departments</span> to reach their
          <span className="text-purple-500 font-semibold"> subjects</span>
        </p>
      </section>

      <section className="mb-10 flex items-center justify-center">
        <div className="flex w-full max-w-3xl items-center gap-3 overflow-hidden rounded-2xl border-2 border-[#EFEAEA] bg-[#010206] px-4 py-3 shadow-[12px_10bpx_13.3px_2px_rgba(177,177,177,0.25)]">
          <Search className="h-5 w-5 text-white" />
          <input
            aria-label="Search departments"
            placeholder="Search by department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Clear
            </button>
          ) : null}
        </div>
      </section>

      <section>
        {query && filteredSubjects.length > 0 ? (
          <div className="mb-8 rounded-lg border border-slate-800 bg-[#1b1b1b] p-4 text-white">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Subjects matching “{query}”</h2>
              <span className="text-xs text-slate-300">{filteredSubjects.length} found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSubjects.map((subj) => (
                <Link key={subj.id} href={`/courses/${subj.id}`} className="group">
                  <div className="flex h-[180px] flex-col overflow-hidden rounded-md bg-[#2f3139] shadow-md transition hover:-translate-y-1 hover:shadow-indigo-400/30">
                    {subj.image ? (
                      <img src={subj.image} alt={subj.title} className="h-3/4 w-full object-fit" />
                    ) : (
                      <div className="flex h-3/4 w-full items-center justify-center bg-slate-800 text-sm text-slate-200">
                        No image
                      </div>
                    )}
                    <div className="flex flex-1 items-center justify-between px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold leading-tight text-white">{subj.title}</p>
                        <p className="text-[11px] text-slate-300">Code: {subj.sub_code}</p>
                      </div>
                      <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">Open</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {filteredDepartments.length === 0 ? (
          <p className="text-center text-slate-300">No departments found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredDepartments.map((dept) => {
              const subjectCount = subjectCountByDepartment[dept.id] ?? 0;
              return (
                <Link key={dept.id} href={`/department/${dept.id}`} className="group">
                  <div className="flex h-[200px] flex-col overflow-hidden rounded-md bg-[#3C3E46] shadow-lg transition hover:-translate-y-2 hover:shadow-zinc-400">
                    {dept.image ? (
                      <img src={dept.image} alt={dept.name} className="h-3/4 w-full object-fit" />
                    ) : (
                      <div className="flex h-3/4 w-full items-center justify-center bg-slate-800 text-sm text-slate-200">
                        No image
                      </div>
                    )}
                    <div className="flex flex-1 items-center justify-between px-3 py-2">
                      <div>
                        <h3 className="text-white font-bold leading-tight">{dept.name}</h3>
                        <p className="text-xs text-slate-200">{subjectCount} subject{subjectCount === 1 ? "" : "s"}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/department/${dept.id}`);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <footer className="mt-9 text-center text-gray-500">
        <small>Signed in as {user}</small>
      </footer>
    </>
  );
}