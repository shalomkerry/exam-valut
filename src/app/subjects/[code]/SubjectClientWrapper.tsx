"use client";

import { createContext, useContext, ReactNode } from "react";

// Define the shape of a single exam with its images
export type ExamData = {
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
  // Ideally define a proper type for images, but unknown works for now
  images: any[]; 
};

interface ExamContextType {
  exams: ExamData[];
}

const ExamContext = createContext<ExamContextType | null>(null);

// --- The Hook ---
export function useSubjectExams() {
  const ctx = useContext(ExamContext);
  if (!ctx) {
    throw new Error("useSubjectExams must be used within a SubjectClientWrapper");
  }
  return ctx;
}

// --- The Provider Component ---
interface SubjectClientWrapperProps {
  initialExams: any
  children: ReactNode;
}

export default function SubjectClientWrapper({
  initialExams,
  children,
}: SubjectClientWrapperProps) {
  
  return (
    <ExamContext.Provider value={{ exams: initialExams }}>
      {children}
    </ExamContext.Provider>
  );
}