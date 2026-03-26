import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import React, { useRef, useState, useCallback } from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Demo from './components/Demo';
import WhyMatters from './components/WhyMatters';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import EarlyAccessForm from './components/EarlyAccessForm';

interface BillItem {
  name: string;
  bill_amount: number;
  reference_price: number;
  difference: number;
  verdict: string;
  category?: string;
  matched_as?: string;
}

interface ReportSummary {
  total_items: number;
  overpriced_count: number;
  total_billed: number;
  total_savings: number;
  overall_verdict: string;
}

interface AnalysisReport {
  items: BillItem[];
  summary: ReportSummary;
  warning?: string;
  fraud_detection?: {
    fraud_probability: number;
    fraud_probability_percent: string;
    fraud_risk: string;
    risk_emoji: string;
    explanation: string;
  };
}

function App() {
  const { user, token, logout, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0014' }}>
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <LoginPage onSuccess={() => {}} />;

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [localHistory, setLocalHistory] = useState<AnalysisReport[]>([]);
  const [shareMsg, setShareMsg] = useState('');

  const openPicker = () => fileRef.current?.click();

  const upload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setReport(null);

      if (file.size > 50 * 1024 * 1024) throw new Error('File too large (max 50MB)');

      const form = new FormData();
      form.append('file', file, file.name);

      const uploadRes = await fetch('/api/upload-bill', {
        method: 'POST',
        headers: token && token !== 'guest' ? { 'Authorization': `Bearer ${token}` } : {},
        body: form,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData?.detail || 'Upload failed');
      if (!uploadData?.file_id) throw new Error('No file ID returned');

      const analyzeRes = await fetch(`/api/analyze/${uploadData.file_id}`, {
        method: 'POST',
        headers: token && token !== 'guest' ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!analyzeRes.ok) {
        const err = await analyzeRes.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err?.detail || 'Analysis failed');
      }

      const analysis = await analyzeRes.json();
      setReport(analysis);
      setLocalHistory(prev => [{ ...analysis, analyzed_at: new Date().toISOString() }, ...prev]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) upload(f);
  };

  // Drag & Drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  }, [token]);

  // Share report
  const shareReport = async () => {
    if (!report) return;
    const text = `🏥 BillScan AI Report\n` +
      `Verdict: ${report.summary.overall_verdict}\n` +
      `Total Billed: ₹${report.summary.total_billed.toLocaleString('en-IN')}\n` +
      `Overpriced Items: ${report.summary.overpriced_count}/${report.summary.total_items}\n` +
      `Possible Savings: ₹${report.summary.total_savings.toLocaleString('en-IN')}\n` +
      (report.fraud_detection ? `ML Fraud Risk: ${report.fraud_detection.fraud_risk} (${report.fraud_detection.fraud_probability_percent})\n` : '') +
      `\nAnalyzed with BillScan AI — billscanai.tech`;

    try {
      await navigator.clipboard.writeText(text);
      setShareMsg('✅ Copied to clipboard!');
      setTimeout(() => setShareMsg(''), 3000);
    } catch {
      setShareMsg('❌ Could not copy');
      setTimeout(() => setShareMsg(''), 3000);
    }
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'RED':    return { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700',    emoji: '🔴' };
      case 'YELLOW': return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', emoji: '🟡' };
      case 'GREEN':  return { bg: 'bg-green-50',  border: 'border-green-300',  text: 'text-green-700',  emoji: '🟢' };
      default:       return { bg: 'bg-gray-50',   border: 'border-gray-300',   text: 'text-gray-700',   emoji: '⚪' };
    }
  };

  const getItemVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Overpriced':   return { bg: 'bg-red-50',  badge: 'bg-red-100 text-red-700',     emoji: '🔴' };
      case 'Normal':       return { bg: 'bg-white',   badge: 'bg-green-100 text-green-700', emoji: '🟢' };
      case 'Undercharged': return { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700',   emoji: '🔵' };
      default:             return { bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-500',   emoji: '⚪' };
    }
  };

  const renderReport = () => {
    if (!report) return null;
    const { items, summary, warning } = report;
    const overpricedCount = summary?.overpriced_count || 0;
    const totalItems = summary?.total_items || items.length;
    const totalSavings = summary?.total_savings ||
      items.filter(i => i.verdict === 'Overpriced').reduce((s, i) => s + i.difference, 0);
    const totalBilled = summary?.total_billed || items.reduce((s, i) => s + i.bill_amount, 0);
    const pct = totalItems > 0 ? overpricedCount / totalItems : 0;
    const overallVerdict = summary?.overall_verdict || (pct > 0.5 ? 'RED' : pct > 0.2 ? 'YELLOW' : 'GREEN');
    const vs = getVerdictStyle(overallVerdict);

    return (
      <div className="mt-6 space-y-4">
        {warning && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-yellow-800 text-sm">
            ⚠️ {warning}
          </div>
        )}

        {/* Verdict Summary Box */}
        <div className={`${vs.bg} ${vs.border} border-2 rounded-xl p-5`}>
          <div className={`text-2xl font-bold ${vs.text} mb-3`}>
            {vs.emoji} Verdict: {overallVerdict}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Total Items</div>
              <div className="text-xl font-bold text-gray-800">{totalItems}</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Overpriced</div>
              <div className="text-xl font-bold text-red-600">{overpricedCount}/{totalItems}</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Possible Savings</div>
              <div className="text-xl font-bold text-green-600">{fmt(totalSavings)}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-opacity-30 flex justify-between text-sm">
            <span className={vs.text}>Total Billed Amount</span>
            <span className={`font-bold ${vs.text}`}>{fmt(totalBilled)}</span>
          </div>
        </div>

        {/* ML Fraud Detection Card */}
        {report.fraud_detection && (
          <div className="rounded-xl p-5 border-2"
            style={{
              background: report.fraud_detection.fraud_risk === 'HIGH' ? 'rgba(239,68,68,0.1)'
                : report.fraud_detection.fraud_risk === 'MEDIUM' ? 'rgba(234,179,8,0.1)'
                : 'rgba(34,197,94,0.1)',
              borderColor: report.fraud_detection.fraud_risk === 'HIGH' ? 'rgb(239,68,68)'
                : report.fraud_detection.fraud_risk === 'MEDIUM' ? 'rgb(234,179,8)'
                : 'rgb(34,197,94)',
            }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{report.fraud_detection.risk_emoji}</span>
              <div>
                <div className="font-bold text-white">
                  ML Fraud Detection — {report.fraud_detection.fraud_risk} RISK
                </div>
                <div className="text-sm" style={{ color: '#c4b5fd' }}>
                  Fraud Probability: {report.fraud_detection.fraud_probability_percent}
                </div>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#e9d5ff' }}>
              💡 {report.fraud_detection.explanation}
            </p>
            <div className="mt-3 h-3 rounded-full bg-gray-700">
              <div className="h-3 rounded-full transition-all"
                style={{
                  width: report.fraud_detection.fraud_probability_percent,
                  background: report.fraud_detection.fraud_risk === 'HIGH' ? 'rgb(239,68,68)'
                    : report.fraud_detection.fraud_risk === 'MEDIUM' ? 'rgb(234,179,8)'
                    : 'rgb(34,197,94)',
                }} />
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="flex items-center gap-3">
          <button onClick={shareReport}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.4)' }}>
            📤 Share Report
          </button>
          {shareMsg && (
            <span className="text-sm font-medium" style={{ color: '#34d399' }}>{shareMsg}</span>
          )}
          <button onClick={() => { setReport(null); openPicker(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'rgba(96,165,250,0.2)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.4)' }}>
            🔄 Analyze Another Bill
          </button>
        </div>

        {/* Items Table */}
        {items.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-800 px-4 py-3">
              <h4 className="text-white font-semibold text-sm">📋 Itemized Bill Analysis</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Item</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-semibold">Billed</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-semibold">Reference</th>
                    <th className="text-right px-4 py-3 text-gray-600 font-semibold">Difference</th>
                    <th className="text-center px-4 py-3 text-gray-600 font-semibold">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const ivs = getItemVerdictStyle(item.verdict);
                    return (
                      <tr key={idx} className={`${ivs.bg} border-b border-gray-100 hover:brightness-95 transition-all`}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{item.name}</div>
                          {item.category && <div className="text-xs text-gray-400 mt-0.5">{item.category}</div>}
                          {item.matched_as && <div className="text-xs text-blue-400 mt-0.5">matched: {item.matched_as}</div>}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(item.bill_amount)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {item.reference_price > 0 ? fmt(item.reference_price) : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.difference > 0 ? (
                            <span className="text-red-600 font-semibold">+{fmt(item.difference)}</span>
                          ) : item.difference < 0 ? (
                            <span className="text-blue-600">{fmt(item.difference)}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${ivs.badge}`}>
                            {ivs.emoji} {item.verdict}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-800">
                    <td className="px-4 py-3 text-white font-bold">Total</td>
                    <td className="px-4 py-3 text-right text-white font-bold">{fmt(totalBilled)}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-right text-red-300 font-bold">
                      {totalSavings > 0 ? `+${fmt(totalSavings)} overcharged` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        overallVerdict === 'RED' ? 'bg-red-500 text-white' :
                        overallVerdict === 'YELLOW' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {vs.emoji} {overallVerdict}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {totalSavings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
            💡 <strong>Tip:</strong> You may be able to save <strong>{fmt(totalSavings)}</strong> by
            questioning overpriced items with your hospital billing department.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">



      <NavBar onHistoryClick={() => setShowDashboard(true)} />
      <Hero onPick={openPicker} />

      {/* Upload / Report Section */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        {/* Drag & Drop Zone */}
        {!report && !loading && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={openPicker}
            className="cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all"
            style={{
              borderColor: dragging ? '#a78bfa' : 'rgba(139,92,246,0.4)',
              background: dragging ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.04)',
            }}>
            <div className="text-5xl mb-3">{dragging ? '📂' : '📄'}</div>
            <p className="text-white font-semibold text-lg mb-1">
              {dragging ? 'Drop your bill here!' : 'Drag & drop your hospital bill'}
            </p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              or <span style={{ color: '#a78bfa' }}>click to browse</span> — JPG, PNG, PDF up to 50MB
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 py-8 text-blue-600">
            <div className="w-6 h-6 border-2 border-white-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium text-white">Analyzing your bill... this may take 10-20 seconds</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            ❌ {error}
          </div>
        )}

        {report && (
          <div className="mt-4">
            <h3 className="font-bold text-lg text-white mb-2">Analysis Report</h3>
            {renderReport()}
          </div>
        )}
      </div>

      <HowItWorks />
      <Features />
      <Demo />
      <WhyMatters />
      <div className="my-8"><EarlyAccessForm /></div>
      <FAQ />
      <Footer />

      {/* Dashboard Modal */}
      {showDashboard && <DashboardPage onClose={() => setShowDashboard(false)} localHistory={localHistory} />}
    </div>
  );
}

export default App;
