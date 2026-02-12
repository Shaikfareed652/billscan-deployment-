import React, { useRef, useState } from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Demo from './components/Demo';
import Technology from './components/Technology';
import WhyMatters from './components/WhyMatters';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import EarlyAccessForm from './components/EarlyAccessForm';

function App() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [report, setReport] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = () => fileRef.current?.click();

  const upload = async (file: File) => {
    try {
      console.log("📤 Starting upload...", { fileName: file.name, fileSize: file.size, fileType: file.type });
      setLoading(true);
      setError(null);
      setReport(null);

      // Validate file
      if (!file) {
        throw new Error('No file selected');
      }
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File too large (max 50 MB)');
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'application/pdf'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|bmp|tiff|pdf)$/i)) {
        throw new Error('Invalid file type. Use JPG, PNG, PDF, etc.');
      }

      // Step 1: Upload file
      console.log("📤 Uploading to /upload-bill endpoint...");
      const form = new FormData();
      form.append('file', file, file.name);

      const uploadRes = await fetch('http://localhost:8000/upload-bill', {
        method: 'POST',
        body: form,
      });

      console.log("📬 Upload response status:", uploadRes.status);
      const uploadData = await uploadRes.json();
      console.log("📬 Upload response data:", uploadData);

      if (!uploadRes.ok) {
        throw new Error(uploadData?.detail || uploadData?.error || `Upload failed with status ${uploadRes.status}`);
      }

      if (!uploadData?.file_path) {
        throw new Error('Upload succeeded but no file path returned. Backend error.');
      }

      console.log("✅ Upload successful! File path:", uploadData.file_path);

      // Step 2: Analyze the uploaded file
      console.log("🔄 Starting analysis at /analyze-bill...");
      const analyzeUrl = `http://localhost:8000/analyze-bill?file_path=${encodeURIComponent(uploadData.file_path)}`;
      console.log("🔄 Analyze URL:", analyzeUrl);

      const analyzeRes = await fetch(analyzeUrl, {
        method: 'POST',
      });

      console.log("📊 Analysis response status:", analyzeRes.status);
      const analysis = await analyzeRes.json();
      console.log("📊 Analysis response data:", analysis);

      if (!analyzeRes.ok) {
        throw new Error(analysis?.detail || `Analysis failed with status ${analyzeRes.status}`);
      }

      console.log("✅ Analysis complete! Verdict:", analysis.verdict);
      setReport(analysis);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error("❌ Error:", errorMsg, e);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) upload(f);
  };

  const reportText = report ? JSON.stringify(report, null, 2) : '';
  
  // Parse report to show formatted verdict
  const getVerdictBadge = () => {
    if (!report || typeof report !== 'object') return null;
    const verdict = (report as any).verdict;
    if (!verdict) return null;
    
    const badgeMap: { [key: string]: { bg: string; text: string; emoji: string } } = {
      'GREEN': { bg: 'bg-green-100', text: 'text-green-700', emoji: '🟢' },
      'YELLOW': { bg: 'bg-yellow-100', text: 'text-yellow-700', emoji: '🟡' },
      'RED': { bg: 'bg-red-100', text: 'text-red-700', emoji: '🔴' },
    };
    
    const style = badgeMap[verdict] || { bg: 'bg-gray-100', text: 'text-gray-700', emoji: '❓' };
    const savings = (report as any).possible_savings || 0;
    
    return (
      <div className={`${style.bg} ${style.text} p-4 rounded-lg mb-4 border`}>
        <div className="text-lg font-bold mb-2">{style.emoji} Verdict: {verdict}</div>
        <div className="text-sm">Possible Savings: <span className="font-semibold">₹{savings}</span></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero onPick={openPicker} />
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          {loading && (
            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm sm:text-base">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
            Error: {error}
          </div>
        )}

        {report != null && (
          <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Analysis Report</h3>
            {getVerdictBadge()}
            <div className="overflow-x-auto">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm max-h-96 overflow-y-auto">
                {reportText}
              </pre>
            </div>
          </div>
        )}

        <div className="my-8">
          <EarlyAccessForm />
        </div>
      </div>

      <HowItWorks />
      <Features />
      <Demo />
      <Technology />
      <WhyMatters />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
