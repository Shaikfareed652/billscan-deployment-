import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface BillRecord {
  file_id?: string;
  analyzed_at: string;
  summary: {
    total_items: number;
    overpriced_count: number;
    total_billed: number;
    total_savings: number;
    overall_verdict: string;
  };
  fraud_detection?: {
    fraud_risk: string;
    fraud_probability_percent: string;
    risk_emoji: string;
  };
}

export default function DashboardPage({
  onClose,
  localHistory = [],
}: {
  onClose: () => void;
  localHistory?: any[];
}) {
  const { token } = useAuth();
  const [serverBills, setServerBills] = useState<BillRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const isGuest = !token || token === "guest";

  useEffect(() => {
    if (isGuest) { setLoading(false); return; }
    fetch("/api/bills/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : { bills: [] })
      .then(d => { setServerBills(d.bills || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  // Merge: server bills for logged-in, localHistory for guests
  const bills: BillRecord[] = isGuest
    ? localHistory.map(r => ({
        analyzed_at: r.analyzed_at || new Date().toISOString(),
        summary: r.summary,
        fraud_detection: r.fraud_detection,
      }))
    : serverBills;

  const fmt = (n: number) => "\u20b9" + n.toLocaleString("en-IN");
  const totalSavings = bills.reduce((s, b) => s + (b.summary?.total_savings || 0), 0);
  const totalBilled = bills.reduce((s, b) => s + (b.summary?.total_billed || 0), 0);
  const overpricedBills = bills.filter(b => b.summary?.overall_verdict === "RED").length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "rgba(10,0,20,0.97)" }}>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ background: "rgba(10,0,20,0.95)", borderColor: "rgba(139,92,246,0.3)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <h1 className="text-xl font-bold text-white">Bill History Dashboard</h1>
          {isGuest && (
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(234,179,8,0.2)", color: "#fbbf24", border: "1px solid rgba(234,179,8,0.4)" }}>
              Session only — login to save permanently
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-sm px-4 py-2 rounded-full font-semibold"
          style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.4)" }}>
          ✕ Close
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: "Bills Analyzed", value: bills.length, color: "#a78bfa" },
            { label: "Total Billed", value: fmt(totalBilled), color: "#60a5fa" },
            { label: "Total Savings Found", value: fmt(totalSavings), color: "#34d399" },
            { label: "Suspicious Bills", value: overpricedBills, color: "#f87171" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="text-xs mb-1" style={{ color: "#9ca3af" }}>{s.label}</div>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Guest notice banner */}
        {isGuest && bills.length > 0 && (
          <div className="mb-4 rounded-xl p-3 text-sm flex items-center gap-2"
            style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", color: "#fbbf24" }}>
            ⚠️ You are in guest mode. This history will be lost when you close the browser.
            <strong>Login to save your bills permanently.</strong>
          </div>
        )}

        {/* Bills List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#6b7280" }}>
            <div className="text-5xl mb-4">📄</div>
            <p className="text-lg text-white">No bills analyzed yet.</p>
            <p className="text-sm mt-2">Upload your first hospital bill to get started!</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 rounded-full font-semibold text-sm"
              style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.5)" }}>
              Upload a Bill
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill, idx) => {
              const v = bill.summary?.overall_verdict;
              const color = v === "RED" ? "#ef4444" : v === "YELLOW" ? "#eab308" : "#22c55e";
              const bg = v === "RED" ? "rgba(239,68,68,0.08)" : v === "YELLOW" ? "rgba(234,179,8,0.08)" : "rgba(34,197,94,0.08)";
              const emoji = v === "RED" ? "🔴" : v === "YELLOW" ? "🟡" : "🟢";
              return (
                <div key={idx} className="rounded-xl p-4"
                  style={{ background: bg, border: `1px solid ${color}40` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{emoji}</span>
                        <span className="font-semibold text-white">Bill #{bills.length - idx}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.1)", color: "#9ca3af" }}>
                          {new Date(bill.analyzed_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div style={{ color: "#9ca3af" }} className="text-xs">Total Billed</div>
                          <div className="font-bold text-white">{fmt(bill.summary?.total_billed || 0)}</div>
                        </div>
                        <div>
                          <div style={{ color: "#9ca3af" }} className="text-xs">Savings Found</div>
                          <div className="font-bold" style={{ color: "#34d399" }}>{fmt(bill.summary?.total_savings || 0)}</div>
                        </div>
                        <div>
                          <div style={{ color: "#9ca3af" }} className="text-xs">Overpriced Items</div>
                          <div className="font-bold" style={{ color: "#f87171" }}>
                            {bill.summary?.overpriced_count}/{bill.summary?.total_items}
                          </div>
                        </div>
                      </div>
                    </div>
                    {bill.fraud_detection && (
                      <div className="text-right shrink-0">
                        <div className="text-lg">{bill.fraud_detection.risk_emoji}</div>
                        <div className="text-xs font-bold" style={{ color: "#c4b5fd" }}>
                          {bill.fraud_detection.fraud_probability_percent}
                        </div>
                        <div className="text-xs" style={{ color: "#6b7280" }}>fraud risk</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
