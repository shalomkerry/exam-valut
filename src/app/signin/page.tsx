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
        // Redirect to home which will display the user's name/email
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
    <main className="signup-container">
      <div className="signup-card" role="region" aria-labelledby="signin-title">
        <h1 id="signin-title">Sign in to your account</h1>
        <p className="muted">Welcome back — enter your details to continue.</p>

        <form onSubmit={onSubmit} noValidate>
          <label className="label">
            Email address
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </label>

          {errors.length > 0 && (
            <div className="errors" aria-live="polite">
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {success && <div className="success" aria-live="polite">{success}</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button type="submit" className="btn primary" disabled={loading} aria-busy={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <button className="btn secondary" onClick={()=>{
              router.push('/signup')
            }}>
              Create account
            </button>
          </div>
        </form>

        <p className="small muted" style={{ marginTop: 14 }}>
          Forgot your password? This demo doesn't include a recovery flow.
        </p>
      </div>
    </main>
  );
}
