import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function NavBar({
  onHistoryClick,
}: {
  onHistoryClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    ["#home", "Home"],
    ["#how-it-works", "How It Works"],
    ["#features", "Features"],
    ["#why", "Why It Matters"],
    ["#faq", "FAQ"],
    ["#contact", "Contact"],
  ];

  return (
    <header
      className="w-full sticky top-0 z-40"
      style={{
        background: "rgb(250, 248, 252)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(82, 17, 233, 0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo — bigger */}
          <a href="#home" className="flex items-center flex-shrink-0">
           <img
            src="/IMG_20251231_144047__1_-removebg-preview.png"
            alt="BillScan Logo"
            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 rounded-lg p-1"
/>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:text-purple-300 hover:bg-purple-900/30"
                style={{ color: "#0b0b0b" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onHistoryClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(25, 24, 26, 0.95)",
                color: "#c4b5fd",
                border: "1px solid rgba(139,92,246,0.4)",
              }}
            >
              📊 History
            </button>

            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                background: "rgba(24, 23, 23, 0.63)",
                color: "#e5e7eb",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              👤 {user?.email === "guest" || !user?.email
                ? "Guest User"
                : user.email.split("@")[0]}
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(242, 47, 47, 0.84)",
                color: "#f3ebeb",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              Logout
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2"
            style={{ color: "#0c0c0c" }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ✅ FIXED MOBILE MENU */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(10,0,20,0.97)",
            borderTop: "1px solid rgba(20, 20, 21, 0.2)",
          }}
        >
          <ul className="flex flex-col px-4 py-3 space-y-1">
            {links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-purple-900/30 hover:text-purple-300"
                  style={{ color: "#d1d5db" }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div
            className="px-4 py-3 border-t flex flex-col gap-2"
            style={{ borderColor: "rgba(22, 22, 23, 0.2)" }}
          >
            <button
              onClick={() => { setOpen(false); onHistoryClick?.(); }}
              className="w-full px-4 py-2 rounded-lg"
              style={{
                background: "rgba(139,92,246,0.2)",
                color: "#040111",
              }}
            >
              📊 History
            </button>

            <div
              className="w-full px-4 py-2 rounded-lg text-center"
              style={{
                background: "rgba(25, 24, 24, 0.69)",
                color: "#e5e7eb",
              }}
            >
              👤 {user?.email === "guest" || !user?.email
                ? "Guest User"
                : user.email.split("@")[0]}
            </div>

            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full px-4 py-2 rounded-lg"
              style={{
                background: "rgba(242, 22, 22, 0.85)",
                color: "#ede6e6",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}