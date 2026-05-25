"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("user_name");
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_name");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/dashboard", label: "📊 Dashboard" },
    { href: "/expenses",  label: "💸 Expenses"  },
    { href: "/budget",    label: "🎯 Budget"    },
  ];

  // Get initials from name for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav style={{
      background: "linear-gradient(135deg, #1e3a5f, #2e86ab)",
      padding: "0 1.5rem", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)", position: "sticky", top: 0, zIndex: 100
    }}>

      {/* Left — Logo */}
      <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
        }}>💰</div>
        <div>
          <span style={{ color: "#fff", fontWeight: "700", fontSize: "0.95rem", display: "block", lineHeight: 1.2 }}>
            Expense Tracker
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", display: "block", lineHeight: 1 }}>
            Smart Insighter
          </span>
        </div>
      </Link>

      {/* Center — Nav Links */}
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
      </div>

      {/* Right — User Info + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

        {/* User Avatar + Name */}
        {userName && (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "999px", padding: "0.3rem 0.85rem 0.3rem 0.3rem"
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "linear-gradient(135deg, #fff, #dbeafe)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: "700", color: "#1e3a5f",
              flexShrink: 0
            }}>
              {getInitials(userName)}
            </div>
            <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: "500", whiteSpace: "nowrap" }}>
              {userName}
            </span>
          </div>
        )}

        {/* Logout Button */}
        <button onClick={handleLogout} style={{
          padding: "0.4rem 0.9rem",
          background: "rgba(255,255,255,0.12)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "8px", fontSize: "0.82rem",
          cursor: "pointer", fontWeight: "500",
          transition: "all 0.2s"
        }}
          onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.3)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.12)"}
        >
          🚪 Logout
        </button>
      </div>

    </nav>
  );
}