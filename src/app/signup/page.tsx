"use client";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";


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
          router.push('/app/dashboard')
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
    <main className="signup-container">
      <div className="signup-card" role="region" aria-labelledby="signup-title">
        <h1 id="signup-title">Create your account</h1>
        <p className="muted">Sign up to access the app — it only takes a minute.</p>

        <form onSubmit={onSubmit} noValidate>
          <label className="label">
            Name
            <input
              className="input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </label>

          <label className="label ">
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
              placeholder="At least 6 characters"
              required
            />
          </label>

          <label className="label">
            Confirm password
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
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
              {loading ? "Creating…" : "Create account"}
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setFullName("");
                setEmail("");
                setPassword("");
                setConfirm("");
                setErrors([]);
                setSuccess("");
               router.push('/signin') 
              }}
            >
            Sign In
            </button>
          </div>
        </form>

        <p className="small muted" style={{ marginTop: 14 }}>
          By creating an account you agree to the terms and privacy policy.
        </p>
      </div>
    </main>
  );
}
