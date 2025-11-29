"use client";

import { exams,subjects } from "@/db/data_schema";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Exam = typeof exams.$inferSelect;
type Subject = typeof subjects.$inferSelect;

interface User {
  id: string;
  role:string 
}

interface AdminContextType {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  user: User | null;
}

// 2. Create Context
const AdminContext = createContext<AdminContextType | null>(null);

// 3. The Hook
export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used inside <AdminClientWrapper>");
  }
  return ctx;
}

// 4. The Provider Component
interface AdminClientWrapperProps {
  initialSubjects: Subject[];
  initialExams: Exam[];
  user: User | null;
  children: ReactNode;
}

export default function AdminClientWrapper({
  initialSubjects,
  initialExams,
  user,
  children,
}: AdminClientWrapperProps) {
  // Initialize state with the data passed from the Server Layout
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  
  const currentUser = user; 

  return (
    <AdminContext.Provider
      value={{
        subjects,
        setSubjects,
        exams,
        setExams,
        user: currentUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}