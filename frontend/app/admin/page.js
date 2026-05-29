"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/admin/login", form);
      localStorage.setItem("admin_token", res.data.access_token);
      toast.success("Welcome, Admin!");
      router.push("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1rem",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)"
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "20px",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", fontSize: "2rem"
          }}>🛡️</div>
          <h1 style={{ color: "#fff", fontSize: "1.75rem", fontWeight: "800" }}>Admin Panel</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Expense Tracker — Admin Access
          </p>
        </div>

        <div style={{
          background: "#fff", borderRadius: "24px", padding: "2rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#111827", marginBottom: "1.5rem" }}>
            Sign in as Administrator
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem" }}>
                Username
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>👤</span>
                <input type="text" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required placeholder="Admin username"
                  autoComplete="username"
                  suppressHydrationWarning
                  style={{
                    width: "100%", padding: "0.7rem 0.75rem 0.7rem 2.5rem",
                    border: "1.5px solid #e5e7eb", borderRadius: "12px",
                    fontSize: "0.875rem", outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#1e3a5f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>🔒</span>
                <input type={showPassword ? "text" : "password"} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required placeholder="••••••••"
                  autoComplete="current-password"
                  suppressHydrationWarning
                  style={{
                    width: "100%", padding: "0.7rem 2.5rem 0.7rem 2.5rem",
                    border: "1.5px solid #e5e7eb", borderRadius: "12px",
                    fontSize: "0.875rem", outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#1e3a5f"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                suppressHydrationWarning
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} 
            suppressHydrationWarning
            style={{
              width: "100%", padding: "0.8rem",
              background: loading ? "#94a3b8" : "linear-gradient(135deg, #0f172a, #1e3a5f)",
              color: "#fff", border: "none", borderRadius: "12px",
              fontSize: "0.9rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? "⏳ Signing in..." : "🛡️ Admin Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <a href="/" style={{ fontSize: "0.8rem", color: "#6b7280", textDecoration: "none" }}>
              ← Back to main site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}