"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/dashboard", label: "📊 Dashboard" },
    { href: "/expenses",  label: "💸 Expenses"  },
    { href: "/budget",    label: "🎯 Budget"    },
  ];

  return (
    <nav style={{
      background: "linear-gradient(135deg, #1e3a5f, #2e86ab)",
      padding: "0 1.5rem", height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)", position: "sticky", top: 0, zIndex: 100
    }}>
      {/* Left — Logo */}
      <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px",
          background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
        }}>💰</div>
        <div>
          <span style={{ color: "#fff", fontWeight: "700", fontSize: "0.95rem", letterSpacing: "-0.3px", display: "block", lineHeight: 1.2 }}>
            Expense Tracker
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", display: "block", lineHeight: 1 }}>
            Smart Insighter
          </span>
        </div>
      </Link>

      {/* Right — Nav Links + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
            <span style={{
              color: pathname === link.href ? "#fff" : "rgba(255,255,255,0.75)",
              fontSize: "0.85rem",
              fontWeight: pathname === link.href ? "600" : "400",
              padding: "0.4rem 0.85rem", borderRadius: "8px",
              background: pathname === link.href ? "rgba(255,255,255,0.2)" : "transparent",
              display: "inline-block", transition: "all 0.2s"
            }}>
              {link.label}
            </span>
          </Link>
        ))}
        <button onClick={handleLogout} style={{
          marginLeft: "0.5rem", padding: "0.4rem 0.85rem",
          background: "rgba(255,255,255,0.15)", color: "#fff",
          border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px",
          fontSize: "0.85rem", cursor: "pointer"
        }}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}