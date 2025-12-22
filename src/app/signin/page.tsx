"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: string[] = [];
    if (!email.trim()) e.push("Please enter your email.");
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.push("Please enter a valid email address.");
    if (!password) e.push("Please enter your password.");
    return e;
  }

  async function onSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    setSuccess("");
    const v = validate();
    setErrors(v);
    if (v.length > 0) return;

    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res && (res as any).error) {
        setErrors([String((res as any).error || "Sign-in failed")]);
      } else {
        setSuccess("Signed in successfully.");
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrors([err?.message || String(err) || "An unexpected error occurred."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen  text-white">

      <div className="relative m-auto text-center top-20">
        <Link href='/dashboard' className=" text-center text-2xl md:text-3xl font-extrabold tracking-tight">
          Exam Vault
        </Link>
      </div>
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_35.1%)] 
            shadow-[0_0_50px_-25px_rgba(0,0,0,0.5)] p-8 backdrop-blur-md">
          <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/10" />

          {/* Spinner */}
          <div className="mx-auto mb-6 flex h-8 w-8 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="105" height="122" viewBox="0 0 105 122" fill="none">
  <circle cx="53.5" cy="13.5" r="13.5" fill="#D9D9D9"/>
  <circle cx="91" cy="38" r="14" fill="#D9D9D9"/>
  <ellipse cx="15.5" cy="79.5" rx="13.5" ry="14.5" fill="#D9D9D9"/>
  <ellipse cx="13" cy="38" rx="13" ry="14" fill="#D9D9D9"/>
  <ellipse cx="91.5" cy="81" rx="13.5" ry="13" fill="#D9D9D9"/>
  <ellipse cx="53" cy="108.5" rx="13" ry="13.5" fill="#D9D9D9"/>
</svg>
          </div>

          <div className="text-center">
            <h1 id="signin-title" className="text-xl font-bold">Welcome to Exam Vault</h1>
            <p className="mt-1 text-xs text-white/70">Signin to your an account to post exams</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm placeholder-white/50 outline-none ring-1 ring-white/10 focus:border-white/30 focus:ring-white/20"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-white" htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 pr-12 text-sm placeholder-white/50 outline-none ring-1 ring-white/10 focus:border-white/30 focus:ring-white/20"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 hover:text-white"

              >

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                  <path d="M1 12s4-7 11-7c2.6 0 4.9.9 6.8 2.3" stroke="currentColor" strokeWidth="2" />
                  <path d="M23 12s-4 7-11 7c-2.6 0-4.9-.9-6.8-2.3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200" aria-live="polite">
                <ul className="list-disc pl-5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {success && (
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200" aria-live="polite">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>

    <p className="mt-3 text-center text-sm text-white/80">
      Don't have an account? 
      <button
        type="button"
        onClick={() => router.push('/signup')}
        className="ml-1 font-semibold text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline"
      >
        Sign up
      </button>
    </p>
        </div>
      </div>
    </main>
  );
}
