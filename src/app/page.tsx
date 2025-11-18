"use client";
import { useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session && !isPending) {
      router.replace("/app/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Checking authentication…</p>
      </main>
    );
  }

  if (session && !isPending) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Redirecting to dashboard…</p>
      </main>
    );
  }

  // Not signed in: show a minimal prompt with a sign-in link
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold">You are not signed in</h1>
        <p className="mt-2 text-gray-600">
          Please <Link href="/signin" className="text-indigo-600 underline">sign in</Link> to continue to the dashboard.
        </p>
      </div>
    </main>
  );
}
