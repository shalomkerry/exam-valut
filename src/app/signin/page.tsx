"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        router.push("/app/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setErrors([err?.message || String(err) || "An unexpected error occurred."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg" role="region" aria-labelledby="signin-title">
    
    {/* Header Section */}
    <div className="text-center">
      <h1 id="signin-title" className="text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Welcome back — enter your details to continue.
      </p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        
        {/* Email Input */}
        <label className="block text-sm font-medium text-gray-700">
          Email address
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            transition duration-200 ease-in-out"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        {/* Password Input */}
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            transition duration-200 ease-in-out"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </label>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4" aria-live="polite">
          <div className="flex">
            <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
              {errors.map((err, i) => (
                // Changed from err.length to err to display the actual message
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
          className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        
        <button
          type="button"
          onClick={() => {
            router.push('/signup')
          }}
          className="group relative w-full flex justify-center py-2.5 px-4 border border-gray-300 text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Create account
        </button>
      </div>
    </form>

    <p className="mt-4 text-center text-xs text-gray-500">
      Forgot your password? This demo doesn't include a recovery flow.
    </p>
  </div>
</main>  
  );
}
