"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import API from "../../lib/api";

export default function BudgetPage() {
  const router = useRouter();
  const [budget, setBudget] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/budget/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBudget(res.data);
    setAmount(res.data.monthly_limit);
  } catch { }
  finally { setLoading(false); }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!amount || parseFloat(amount) <= 0) { toast.error("Enter a valid amount"); return; }
  setSaving(true);
  const token = localStorage.getItem("token");
  try {
    const res = await API.post("/budget/", { monthly_limit: parseFloat(amount) }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBudget(res.data);
    toast.success(budget ? "Budget updated!" : "Budget set!");
  } catch { toast.error("Failed to save budget"); }
  finally { setSaving(false); }
};

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem 1rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#111827", marginBottom: "0.25rem" }}>🎯 Monthly Budget</h1>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Set your monthly spending limit. You will be warned when you reach 80%.
        </p>

        {/* Current Budget Card */}
        {budget && (
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f, #2e86ab)",
            borderRadius: "20px", padding: "1.75rem",
            marginBottom: "1.5rem", color: "#fff", textAlign: "center"
          }}>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.5rem" }}>Current Monthly Budget</p>
            <p style={{ fontSize: "2.5rem", fontWeight: "700", letterSpacing: "-1px" }}>₹{budget.monthly_limit.toFixed(2)}</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "0.5rem" }}>per month</p>
          </div>
        )}

        {/* Set Budget Form */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "1.25rem", fontSize: "1rem" }}>
            {budget ? "✏️ Update Budget" : "➕ Set Budget"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "0.4rem" }}>
                Monthly Limit (₹)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontWeight: "700", color: "#6b7280" }}>₹</span>
                <input type="number" min="1" step="0.01" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  style={{
                    width: "100%", padding: "0.8rem 0.85rem 0.8rem 2rem",
                    border: "1.5px solid #e5e7eb", borderRadius: "12px",
                    fontSize: "1rem", outline: "none", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#2e86ab"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
            </div>
            <button type="submit" disabled={saving || loading}
              style={{
                width: "100%", padding: "0.8rem",
                background: "linear-gradient(135deg, #1e3a5f, #2e86ab)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "0.9rem", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1
              }}>
              {saving ? "⏳ Saving..." : budget ? "Update Budget ✓" : "Set Budget ✓"}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.25rem" }}>
          {[
            { icon: "⚠️", title: "80% Alert", desc: "Get warned when you approach your limit" },
            { icon: "📊", title: "Live Tracking", desc: "Dashboard shows real-time budget usage" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
              <p style={{ fontWeight: "600", fontSize: "0.85rem", color: "#374151" }}>{item.title}</p>
              <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.25rem" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}