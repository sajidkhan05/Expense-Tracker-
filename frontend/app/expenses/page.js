"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import API from "../../lib/api";

const CATEGORIES = ["Food","Transport","Shopping","Bills","Health","Entertainment","Education","Other"];

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ amount: "", date: new Date().toISOString().split("T")[0], description: "", category: "Food" });
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
   if (!localStorage.getItem("token")) { router.push("/login"); return; }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/expenses/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setExpenses(res.data);
  } catch { toast.error("Failed to load expenses"); }
  finally { setLoading(false); }
};

  const handleDescriptionChange = async (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, description: val }));
    if (val.length > 2) {
      setSuggesting(true);
      try {
        const res = await API.get(`/expenses/suggest-category?description=${val}`);
        setForm(f => ({ ...f, category: res.data.category }));
      } catch {} finally { setSuggesting(false); }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  try {
    if (editId) {
      await API.put(`/expenses/${editId}`, { ...form, amount: parseFloat(form.amount) }, { headers });
      toast.success("Expense updated!");
    } else {
      await API.post("/expenses/", { ...form, amount: parseFloat(form.amount) }, { headers });
      toast.success("Expense added!");
    }
    setShowForm(false); setEditId(null);
    setForm({ amount: "", date: new Date().toISOString().split("T")[0], description: "", category: "Food" });
    fetchExpenses();
  } catch { toast.error("Failed to save expense"); }
};

  const handleEdit = (exp) => {
    setForm({ amount: exp.amount, date: exp.date, description: exp.description, category: exp.category });
    setEditId(exp.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
  if (!confirm("Delete this expense?")) return;
  const token = localStorage.getItem("token");
  try {
    await API.delete(`/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Expense deleted!");
    fetchExpenses();
  } catch { toast.error("Failed to delete"); }
};

  const inputStyle = {
    width: "100%", padding: "0.65rem 0.85rem",
    border: "1.5px solid #e5e7eb", borderRadius: "10px",
    fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
    background: "#fafafa"
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem 1rem" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#111827" }}>💸 My Expenses</h1>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.2rem" }}>{expenses.length} total records</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ amount: "", date: new Date().toISOString().split("T")[0], description: "", category: "Food" }); }}
            style={{
              padding: "0.6rem 1.25rem",
              background: showForm ? "#f3f4f6" : "linear-gradient(135deg, #1e3a5f, #2e86ab)",
              color: showForm ? "#374151" : "#fff",
              border: "none", borderRadius: "10px", fontSize: "0.875rem",
              fontWeight: "600", cursor: "pointer"
            }}>
            {showForm ? "✕ Cancel" : "+ Add Expense"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "1.25rem", fontSize: "1rem" }}>
              {editId ? "✏️ Edit Expense" : "➕ Add New Expense"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Amount (₹)</label>
                  <input type="number" step="0.01" min="0" required value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#2e86ab"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Date</label>
                  <input type="date" required value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#2e86ab"}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>
                  Description {suggesting && <span style={{ color: "#2e86ab", fontWeight: "400" }}>— detecting category...</span>}
                </label>
                <input type="text" required value={form.description}
                  onChange={handleDescriptionChange}
                  placeholder="e.g. Lunch at restaurant, Bus ticket..."
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#2e86ab"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "#374151", marginBottom: "0.35rem" }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" style={{
                padding: "0.7rem 2rem",
                background: "linear-gradient(135deg, #1e3a5f, #2e86ab)",
                color: "#fff", border: "none", borderRadius: "10px",
                fontSize: "0.875rem", fontWeight: "600", cursor: "pointer"
              }}>
                {editId ? "Update Expense" : "Save Expense"} ✓
              </button>
            </form>
          </div>
        )}

        {/* Expense List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>⏳ Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧾</div>
            <p style={{ color: "#374151", fontWeight: "600" }}>No expenses yet</p>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.25rem" }}>Click &quot;Add Expense&quot; to get started</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {expenses.map(exp => (
              <div key={exp.id} style={{
                background: "#fff", borderRadius: "14px", padding: "1rem 1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                border: exp.is_flagged ? "1.5px solid #fbbf24" : "1px solid #f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0
                  }}>
                    {{"Food":"🍔","Transport":"🚗","Shopping":"🛍️","Bills":"📄","Health":"💊","Entertainment":"🎬","Education":"📚","Other":"📌"}[exp.category] || "📌"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <p style={{ fontWeight: "600", fontSize: "0.9rem", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {exp.description}
                      </p>
                      {exp.is_flagged && <span style={{ fontSize: "0.7rem", background: "#fef3c7", color: "#92400e", padding: "2px 7px", borderRadius: "999px", fontWeight: "600", flexShrink: 0 }}>⚠️ Flagged</span>}
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.15rem" }}>
                      {exp.category} · {exp.date}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  <span style={{ fontWeight: "700", fontSize: "1rem", color: "#1e3a5f" }}>₹{exp.amount.toFixed(2)}</span>
                  <button onClick={() => handleEdit(exp)} style={{
                    padding: "0.35rem 0.75rem", background: "#f0f9ff",
                    color: "#0369a1", border: "1px solid #bae6fd",
                    borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "500"
                  }}>Edit</button>
                  <button onClick={() => handleDelete(exp.id)} style={{
                    padding: "0.35rem 0.75rem", background: "#fff1f2",
                    color: "#be123c", border: "1px solid #fecdd3",
                    borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", fontWeight: "500"
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}