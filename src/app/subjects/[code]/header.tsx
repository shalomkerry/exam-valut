'use client';

import Link from "next/link";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-blue-200 p-4 border-b">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
        <div className="text-xl font-bold">EV</div>
      </div>
      <h1 className="text-2xl font-bold mt-2">{title}</h1>
      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Post Exam
        </button>
      </div>
    </header>
  );
}