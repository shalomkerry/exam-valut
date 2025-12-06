"use client";

import { useSubjectExams } from "./SubjectClientWrapper";

export default function SubjectExamsPage() {
  // 1. Access the data from the context provided by Layout
  const { exams } = useSubjectExams();

  if (!exams || exams.length === 0) {
    return <div className="p-4">No exams found for this subject.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subject Exams</h1>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((item) => (
          <div key={item.exam.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h2 className="font-semibold text-lg">{item.exam.title}</h2>
            <div className="text-sm text-gray-600">
              <p>Year: {item.exam.year}</p>
              <p>Type: {item.exam.type}</p>
              <p>Images: {Array.isArray(item.images) ? item.images.length : 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}