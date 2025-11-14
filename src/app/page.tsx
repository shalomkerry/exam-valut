"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/get-session", { credentials: "include" });
        if (!res.ok) {
          // try to parse error body
          const text = await res.text();
          throw new Error(text || "Failed to get session");
        }
        const data = await res.json();
        // better-auth client/server shape varies; try common paths
        const foundUser = data?.user || data?.session?.user || data?.data?.user || null;
        if (mounted) setUser(foundUser);
      } catch (err: any) {
        if (mounted) setError(err?.message || String(err) || "Not signed in");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);


  const handleSignOut = async () => {
    await authClient.signOut();
    setUser(null)
  };

  return (
    <main className="home-container">
      <div className="signup-card" role="region" aria-labelledby="home-title">
        {loading ? (
          <p>Loading…</p>
        ) : user ? (
          <>
            <h1 id="home-title">Welcome{user.name ? `, ${user.name}` : ""}!</h1>
            <p className="muted">{user.email}</p>

            <p style={{ marginTop: 12 }}>
              <button className='btn primary'onClick={handleSignOut}>
                Sign out
              </button>
            </p>

          </>
        ) : (
          <>
            <h1 id="home-title">Welcome to ExamBuddy</h1>
            <p className="muted">Please sign in or create an account to continue.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <Link href="/signin" className="btn primary">
                Sign in
              </Link>
              <Link href="/signup" className="btn secondary">
                Create account
              </Link>
            </div>
          </>
        )}

            {error && <p className="small muted" style={{ marginTop: 12 }}>{error}</p>}
      </div>
    </main>
  );
}
