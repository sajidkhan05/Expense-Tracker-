"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import API from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1rem",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2e86ab 50%, #1e3a5f 100%)"
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "20px",
            background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", fontSize: "28px", border: "1px solid rgba(255,255,255,0.3)"
          }}>💰</div>
          <h1 style={{ color: "#fff", fontSize: "1.75rem", fontWeight: "700" }}>Expense Tracker</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Track. Analyse. Save.
          </p>
        </div>

        <div style={{
          background: "#fff", borderRadius: "24px", padding: "2rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
        }}>
          <h2 style={{ fontSize: "1.375rem", fontWeight: "700", color: "#111827", marginBottom: "0.25rem" }}>
            Create account ✨
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Start tracking your expenses today
          </p>

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>👤</span>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  required placeholder="Your full name"
                  style={{
                    width: "100%", padding: "0.7rem 0.75rem 0.7rem 2.5rem",
                    border: "1.5px solid #e5e7eb", borderRadius: "12px",
                    fontSize: "0.875rem", outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2e86ab"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📧</span>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  required placeholder="you@example.com"
                  style={{
                    width: "100%", padding: "0.7rem 0.75rem 0.7rem 2.5rem",
                    border: "1.5px solid #e5e7eb", borderRadius: "12px",
                    fontSize: "0.875rem", outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2e86ab"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange} required placeholder="Min. 6 characters"
                  style={{
                    width: "100%", padding: "0.7rem 2.5rem 0.7rem 2.5rem",
                    border: "1.5px solid #e5e7eb", borderRadius: "12px",
                    fontSize: "0.875rem", outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2e86ab"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "0.8rem",
                background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2e86ab)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "0.9rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}>
              {loading ? "⏳ Creating account..." : "Create Account →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "#6b7280" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#2e86ab", fontWeight: "600", textDecoration: "none" }}>
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}