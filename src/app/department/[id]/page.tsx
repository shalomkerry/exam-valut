import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { departments, subjects } from "@/db/data_schema";

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const departmentId = Number.parseInt(id, 10);

  if (Number.isNaN(departmentId)) {
    notFound();
  }

  const department = await db.query.departments.findFirst({
    where: eq(departments.id, departmentId),
  });

  if (!department) {
    notFound();
  }

  const departmentSubjects = await db.query.subjects.findMany({
    where: eq(subjects.departmentId, departmentId),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-purple-400">Department</p>
          <h1 className="text-3xl font-semibold text-white">{department.name}</h1>
          <p className="text-slate-300">Choose a subject to view its exams.</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Back to dashboard
        </Link>
      </div>

      {departmentSubjects.length === 0 ? (
        <p className="text-center text-slate-300">No subjects yet for this department.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {departmentSubjects.map((subject) => (
            <Link key={subject.id} href={`/courses/${subject.id}`} className="group">
              <div className="flex h-[200px] flex-col overflow-hidden rounded-md bg-[#3C3E46] shadow-lg transition hover:-translate-y-2 hover:shadow-zinc-400">
                {subject.image ? (
                  <img src={subject.image} alt={subject.title} className="h-3/4 w-full object-fit" />
                ) : (
                  <div className="flex h-3/4 w-full items-center justify-center bg-slate-800 text-sm text-slate-200">
                    No image
                  </div>
                )}
                <div className="m-auto w-full px-3 py-2">
                  <h3 className="text-white font-bold leading-tight">{subject.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
