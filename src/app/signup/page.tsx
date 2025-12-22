"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter} from "next/navigation";
import Link from "next/link";
export default function SignupPage() {

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: string[] = [];
    if (!fullName.trim()) e.push("Please enter your full name.");
    if (!email.trim()) e.push("Please enter your email.");
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.push("Please enter a valid email address.");
    if (password.length < 6) e.push("Password must be at least 6 characters.");
    if (password !== confirm) e.push("Passwords do not match.");
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
      const res = await authClient.signUp.email({
        name: fullName,
        email: email,
        password: password,
      });

      if (res && (res as any).error) {
        const message = ((res as any).error && String((res as any).error)) || "Signup failed";
        setErrors([message]);
      } else {
        setSuccess("Account created successfully. Redirecting…");
        // Clear sensitive fields
        setFullName("");
        setPassword("");
        setConfirm("");

        // Try to sign in automatically so the session is created and home can show the user.
        try {
          const signInRes = await authClient.signIn.email({ email, password });
          router.push('/dashboard')
          if (signInRes && (signInRes as any).error) {
            // still redirect to home; user may need to sign in manually if auto sign-in failed
            router.push("/");
          } else {
            router.push("/");
          }
        } catch (err) {
          // On any unexpected error, still redirect to home
          router.push("/");
        }
        // clear email after redirect attempt (keeps UI tidy)
        setEmail("");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || String(err) || "An unexpected error occurred.";
      setErrors([msg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-white">
  <div className="relative w-full max-w-md" role="region" aria-labelledby="signup-title">
    <div className="pointer-events-none absolute -inset-[1px] rounded-[28px] bg-[linear-gradient(120deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.06)_35.1%)] 
            shadow-[0_0_50px_-25px_rgba(0,0,0,0.5)]"></div>
    <div className="relative space-y-8 rounded-[28px] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-md">

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

    {/* Header Section */}
    <div className="text-center">
      <h1 id="signup-title" className="text-3xl font-extrabold">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-white/70">
        Sign up to access the app — it only takes a minute.
      </p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        
        {/* Name Input */}
        <label className="block text-sm font-medium text-white">
          Name
          <input
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            transition duration-200 ease-in-out"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </label>

        {/* Email Input */}
        <label className="block text-sm font-medium text-white">
          Email address
          <input
            className="mt-1 block w-full px-3 py-2  text-black bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            transition duration-200 ease-in-out"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        {/* Password Input with toggle */}
        <div className="block text-sm font-medium text-gray-700">
          <label htmlFor="password" className="text-white">Password</label>
          <div className="relative mt-1">
            <input
              id="password"
              className="block w-full px-3 py-2 pr-10 text-black bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                  <path d="M1 12s4-7 11-7c2.6 0 4.9.9 6.8 2.3" stroke="currentColor" strokeWidth="2" />
                  <path d="M23 12s-4 7-11 7c-2.6 0-4.9-.9-6.8-2.3" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="39" viewBox="0 0 48 39" fill="none">
  <path d="M21.086 6.54646C26.4434 6.04592 31.8624 6.93381 36.5157 9.07455C41.1689 11.2153 44.8006 14.4912 46.8562 18.4021C47.0479 18.8069 47.0479 19.2523 46.8562 19.6571C46.011 21.2637 44.894 22.7738 43.5352 24.1469M28.793 22.9226C27.4917 23.908 25.7488 24.4532 23.9397 24.4409C22.1307 24.4285 20.4001 23.8596 19.1209 22.8567C17.8416 21.8537 17.116 20.497 17.1003 19.0787C17.0846 17.6603 17.78 16.2939 19.0369 15.2737M36.6011 28.9469C33.5502 30.3637 30.1464 31.2495 26.6204 31.5441C23.0944 31.8387 19.5289 31.5352 16.1657 30.6542C12.8026 29.7733 9.72047 28.3354 7.12854 26.4383C4.53661 24.5411 2.49552 22.229 1.14376 19.6589C0.952082 19.2541 0.952082 18.8088 1.14376 18.4039C3.18291 14.5269 6.77082 11.2729 11.369 9.13036M1.00116 1L46.9988 37.0628" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input with toggle */}
        <div className="block text-sm font-medium text-gray-700">
          <label htmlFor="confirm" className="text-white">Confirm password</label>
          <div className="relative mt-1">
            <input
              id="confirm"
              className="block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              required
            />
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                  <path d="M1 12s4-7 11-7c2.6 0 4.9.9 6.8 2.3" stroke="currentColor" strokeWidth="2" />
                  <path d="M23 12s-4 7-11 7c-2.6 0-4.9-.9-6.8-2.3" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="39" viewBox="0 0 48 39" fill="none">
  <path d="M21.086 6.54646C26.4434 6.04592 31.8624 6.93381 36.5157 9.07455C41.1689 11.2153 44.8006 14.4912 46.8562 18.4021C47.0479 18.8069 47.0479 19.2523 46.8562 19.6571C46.011 21.2637 44.894 22.7738 43.5352 24.1469M28.793 22.9226C27.4917 23.908 25.7488 24.4532 23.9397 24.4409C22.1307 24.4285 20.4001 23.8596 19.1209 22.8567C17.8416 21.8537 17.116 20.497 17.1003 19.0787C17.0846 17.6603 17.78 16.2939 19.0369 15.2737M36.6011 28.9469C33.5502 30.3637 30.1464 31.2495 26.6204 31.5441C23.0944 31.8387 19.5289 31.5352 16.1657 30.6542C12.8026 29.7733 9.72047 28.3354 7.12854 26.4383C4.53661 24.5411 2.49552 22.229 1.14376 19.6589C0.952082 19.2541 0.952082 18.8088 1.14376 18.4039C3.18291 14.5269 6.77082 11.2729 11.369 9.13036M1.00116 1L46.9988 37.0628" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4" aria-live="polite">
          <div className="flex">
            <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200" aria-live="polite">
          {success}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#333437] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </div>
    </form>

    <p className="mt-4 text-center text-xs text-white/60">
      By creating an account you agree to the terms and privacy policy.
    </p>
    <p className="mt-3 text-center text-sm text-white/80">
      Already have an account? 
      <button
        type="button"
        onClick={() => router.push('/signin')}
        className="ml-1 font-semibold text-indigo-300 hover:text-indigo-200 underline-offset-2 hover:underline"
      >
        Sign in
      </button>
    </p>
    </div>
  </div>
</main>
);
}
