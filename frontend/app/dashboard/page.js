"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "../../components/Navbar";
import API from "../../lib/api";

const COLORS = ["#2e86ab","#1e3a5f","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6"];

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) { router.push("/login"); return; }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await API.get("/dashboard/summary", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(res.data);
  } catch {
    toast.error("Failed to load dashboard");
  } finally {
    setLoading(false);
  }
};

  if (loading) return (
    <>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "#6b7280" }}>Loading your dashboard...</p>
        </div>
      </div>
    </>
  );

  const pieData = data?.by_category
    ? Object.entries(data.by_category).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    : [];

  const barData = data?.daily_spending
    ? Object.entries(data.daily_spending)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([date, amount]) => ({ date: date.slice(5), amount: parseFloat(amount.toFixed(2)) }))
    : [];

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const heatmapDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const amount = data?.daily_spending?.[dateStr] || 0;
    return { day, amount };
  });
  const maxAmount = Math.max(...heatmapDays.map(d => d.amount), 1);

  const budgetPct = data?.budget_used_pct || 0;
  const budgetColor = budgetPct >= 100 ? "#ef4444" : budgetPct >= 80 ? "#f59e0b" : "#22c55e";

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Alert Banner */}
        {data?.alert && (
          <div style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            border: "1px solid #f59e0b", borderRadius: "12px",
            padding: "0.85rem 1.25rem", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem"
          }}>
            <span style={{ fontSize: "1.25rem" }}>⚠️</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400e", fontSize: "0.9rem" }}>Budget Alert!</p>
              <p style={{ color: "#b45309", fontSize: "0.8rem" }}>
                You have used {budgetPct}% of your monthly budget. Consider reducing spending.
              </p>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { icon: "💸", label: "Spent This Month", value: `₹${data?.total_spent?.toFixed(2) || "0.00"}`, color: "#2e86ab" },
            { icon: "🎯", label: "Monthly Budget",   value: data?.monthly_limit ? `₹${data.monthly_limit.toFixed(2)}` : "Not set", color: "#1e3a5f" },
            { icon: "📈", label: "Estimated Total",  value: `₹${data?.estimated_total?.toFixed(2) || "0.00"}`, color: "#8b5cf6" },
            { icon: "📊", label: "Budget Used",      value: data?.budget_used_pct ? `${data.budget_used_pct}%` : "N/A", color: budgetColor },
          ].map((card, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "16px", padding: "1.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6"
            }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{card.icon}</div>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
              <p style={{ fontSize: "1.4rem", fontWeight: "700", color: card.color, marginTop: "0.25rem" }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Budget Progress */}
        {data?.monthly_limit && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#374151" }}>🎯 Budget Progress</span>
              <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>₹{data.total_spent?.toFixed(2)} / ₹{data.monthly_limit?.toFixed(2)}</span>
            </div>
            <div style={{ background: "#f3f4f6", borderRadius: "999px", height: "12px", overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(budgetPct, 100)}%`, height: "100%",
                background: `linear-gradient(90deg, ${budgetColor}, ${budgetColor}cc)`,
                borderRadius: "999px", transition: "width 0.8s ease"
              }} />
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.5rem" }}>{budgetPct}% used</p>
          </div>
        )}

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

          {/* Pie Chart */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: "600", fontSize: "0.9rem", color: "#374151", marginBottom: "1rem" }}>🥧 Spending by Category</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v}`} />
                  </PieChart>
                </ResponsiveContainer>
              </>
            ) : (
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
                No expenses yet
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: "600", fontSize: "0.9rem", color: "#374151", marginBottom: "1rem" }}>📅 Daily Spending (Last 14 days)</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Bar dataKey="amount" fill="#2e86ab" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontWeight: "600", fontSize: "0.9rem", color: "#374151", marginBottom: "1rem" }}>🗓️ Monthly Spending Heatmap</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {heatmapDays.map(({ day, amount }) => {
              const intensity = amount / maxAmount;
              const bg = amount === 0 ? "#f3f4f6"
                : intensity > 0.75 ? "#1e3a5f"
                : intensity > 0.5  ? "#2e86ab"
                : intensity > 0.25 ? "#7dd3fc"
                : "#dbeafe";
              return (
                <div key={day} title={`Day ${day}: ₹${amount.toFixed(2)}`} style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: "600",
                  color: intensity > 0.5 && amount > 0 ? "#fff" : "#374151",
                  cursor: "default", transition: "transform 0.1s"
                }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.15)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "#6b7280" }}>
            <span>Less</span>
            {["#f3f4f6","#dbeafe","#7dd3fc","#2e86ab","#1e3a5f"].map((c, i) => (
              <div key={i} style={{ width: "16px", height: "16px", borderRadius: "4px", background: c }} />
            ))}
            <span>More</span>
          </div>
        </div>

      </div>
    </>
  );
}