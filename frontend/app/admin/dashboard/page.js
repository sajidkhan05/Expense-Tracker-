"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";
import API from "../../../lib/api";

const COLORS = ["#1e3a5f","#2e86ab","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6"];

export default function AdminDashboard() {
  const router = useRouter();
  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [categories,setCategories]= useState([]);
  const [trend,     setTrend]     = useState([]);
  const [topSpenders,setTopSpenders]=useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin"); return; }
    fetchAll(token);
  }, []);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`
  });

  const fetchAll = async () => {
    try {
      const [s, u, c, t, ts] = await Promise.all([
        API.get("/admin/stats",              { headers: headers() }),
        API.get("/admin/users",              { headers: headers() }),
        API.get("/admin/category-breakdown", { headers: headers() }),
        API.get("/admin/monthly-trend",      { headers: headers() }),
        API.get("/admin/top-spenders",       { headers: headers() }),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setCategories(c.data);
      setTrend(t.data);
      setTopSpenders(ts.data);
    } catch {
      toast.error("Failed to load admin data");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    toast.success("Logged out");
    router.push("/admin");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <p>Loading admin panel...</p>
      </div>
    </div>
  );

  const tabs = [
    { key: "overview", label: "📊 Overview"   },
    { key: "users",    label: "👥 Users"      },
    { key: "spending", label: "💸 Spending"   },
    { key: "trends",   label: "📈 Trends"     },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>

      {/* Top Navbar */}
      <nav style={{
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        padding: "0 1.5rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
          }}>🛡️</div>
          <div>
            <p style={{ color: "#fff", fontWeight: "700", fontSize: "0.95rem", lineHeight: 1.2 }}>Admin Panel</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>Expense Tracker</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", textDecoration: "none" }}>← Main Site</a>
          <button onClick={handleLogout} style={{
            padding: "0.4rem 1rem", background: "rgba(239,68,68,0.2)",
            color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "600"
          }}>🚪 Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "#fff", padding: "0.4rem", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", width: "fit-content" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "0.5rem 1.1rem", borderRadius: "10px", border: "none",
              fontSize: "0.85rem", fontWeight: activeTab === tab.key ? "600" : "400",
              background: activeTab === tab.key ? "linear-gradient(135deg, #1e3a5f, #2e86ab)" : "transparent",
              color: activeTab === tab.key ? "#fff" : "#6b7280", cursor: "pointer",
              transition: "all 0.2s"
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: "👥", label: "Total Users",     value: stats?.total_users,                    color: "#2e86ab" },
                { icon: "🧾", label: "Total Expenses",  value: stats?.total_expenses,                 color: "#1e3a5f" },
                { icon: "💰", label: "Total Spending",  value: `₹${stats?.total_spending?.toFixed(2)}`, color: "#22c55e" },
                { icon: "🎯", label: "Budgets Set",     value: stats?.total_budgets,                  color: "#f59e0b" },
              ].map((card, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: "16px", padding: "1.25rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9"
                }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{card.icon}</div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
                  <p style={{ fontSize: "1.6rem", fontWeight: "700", color: card.color, marginTop: "0.25rem" }}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Top Spenders */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: "600", fontSize: "0.95rem", color: "#374151", marginBottom: "1rem" }}>🏆 Top 5 Spenders</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {topSpenders.map((user, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.85rem 1rem", background: "#f8fafc", borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i]}99)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: "700", fontSize: "0.85rem"
                      }}>
                        {i + 1}
                      </div>
                      <div>
                        <p style={{ fontWeight: "600", fontSize: "0.875rem", color: "#111827" }}>{user.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{user.email}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "700", color: "#1e3a5f", fontSize: "0.95rem" }}>₹{user.total_spent.toFixed(2)}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{user.expense_count} expenses</p>
                    </div>
                  </div>
                ))}
                {topSpenders.length === 0 && (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "1rem", fontSize: "0.875rem" }}>No spending data yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: "600", fontSize: "0.95rem", color: "#374151" }}>👥 All Registered Users</h3>
              <span style={{
                background: "#dbeafe", color: "#1e40af", fontSize: "0.75rem",
                fontWeight: "600", padding: "0.25rem 0.75rem", borderRadius: "999px"
              }}>{users.length} users</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["#", "Name", "Email", "Joined", "Expenses", "Total Spent", "Budget", "Flagged"].map(h => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>{i + 1}</td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: "600", color: "#111827" }}>{user.name}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>{user.email}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>{user.joined}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "999px", fontWeight: "600" }}>{user.total_expenses}</span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#1e3a5f" }}>₹{user.total_spent.toFixed(2)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>
                        {user.budget_set ? `₹${user.budget_set.toFixed(2)}` : <span style={{ color: "#9ca3af" }}>Not set</span>}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {user.flagged_count > 0
                          ? <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "999px", fontWeight: "600" }}>⚠️ {user.flagged_count}</span>
                          : <span style={{ color: "#22c55e", fontWeight: "600" }}>✓ Clean</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem", fontSize: "0.875rem" }}>No users registered yet</p>
              )}
            </div>
          </div>
        )}

        {/* ── SPENDING TAB ── */}
        {activeTab === "spending" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

            {/* Pie Chart */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: "600", fontSize: "0.95rem", color: "#374151", marginBottom: "1rem" }}>🥧 Spending by Category</h3>
              {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categories} dataKey="total_amount" nameKey="category"
                      cx="50%" cy="50%" outerRadius={100}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false} fontSize={11}>
                      {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => `₹${v}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>No data yet</div>
              )}
            </div>

            {/* Bar Chart */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontWeight: "600", fontSize: "0.95rem", color: "#374151", marginBottom: "1rem" }}>📊 Amount per Category</h3>
              {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categories} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip formatter={v => `₹${v}`} />
                    <Bar dataKey="total_amount" radius={[0, 4, 4, 0]}>
                      {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>No data yet</div>
              )}
            </div>

            {/* Category Table */}
            <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", gridColumn: "1 / -1" }}>
              <h3 style={{ fontWeight: "600", fontSize: "0.95rem", color: "#374151", marginBottom: "1rem" }}>📋 Category Breakdown Table</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Category", "Total Amount", "No. of Expenses", "Avg per Expense"].map(h => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: "600", color: "#374151", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: COLORS[i % COLORS.length] }} />
                          <span style={{ fontWeight: "600", color: "#111827" }}>{cat.category}</span>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#1e3a5f" }}>₹{cat.total_amount.toFixed(2)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>{cat.expense_count}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>₹{(cat.total_amount / cat.expense_count).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TRENDS TAB ── */}
        {activeTab === "trends" && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: "600", fontSize: "0.95rem", color: "#374151", marginBottom: "1rem" }}>📈 Platform-wide Monthly Spending Trend</h3>
            {trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                  <Tooltip formatter={v => `₹${v}`} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#2e86ab" strokeWidth={3}
                    dot={{ fill: "#2e86ab", r: 5 }} name="Total Spending" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "340px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</div>
                <p>No trend data yet. Add some expenses first.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}