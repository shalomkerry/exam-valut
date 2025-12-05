"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { kMaxLength } from "buffer";


export default function SignupPage() {

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg" role="region" aria-labelledby="signup-title">
    
    {/* Header Section */}
    <div className="text-center">
      <h1 id="signup-title" className="text-3xl font-extrabold text-gray-900">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Sign up to access the app — it only takes a minute.
      </p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        
        {/* Name Input */}
        <label className="block text-sm font-medium text-gray-700">
          Name
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
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
            placeholder="At least 6 characters"
            required
          />
        </label>

        {/* Confirm Password Input */}
        <label className="block text-sm font-medium text-gray-700">
          Confirm password
          <input
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            transition duration-200 ease-in-out"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
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
          {loading ? "Creating…" : "Create account"}
        </button>
        
        <button
          type="button"
          onClick={() => {
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirm("");
            setErrors([]);
            setSuccess("");
            router.push('/signin') 
          }}
          className="group relative w-full flex justify-center py-2.5 px-4 border border-gray-300 text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Sign In
        </button>
      </div>
    </form>

    <p className="mt-4 text-center text-xs text-gray-500">
      By creating an account you agree to the terms and privacy policy.
    </p>
  </div>
</main>
);
}
