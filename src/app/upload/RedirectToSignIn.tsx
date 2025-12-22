"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RedirectToSignIn({ next = "/" }: { next?: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = next ? `/signin?next=${encodeURIComponent(next)}` : "/signin";
      router.replace(target);
    }, 1200);
    return () => clearTimeout(timer);
  }, [router, next]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <h2 className="text-lg font-semibold">Redirecting to sign in…</h2>
        <p className="mt-2 text-sm text-white/70">
          You need to be signed in to upload exams.
        </p>
        <div className="mt-4">
          <Link
            href={next ? `/signin?next=${encodeURIComponent(next)}` : "/signin"}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
          >
            Go now
          </Link>
        </div>
      </div>
    </div>
  );
}
