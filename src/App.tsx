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

function App() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPicker = () => fileRef.current?.click();

  const upload = async (file: File) => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const form = new FormData();
      form.append('file', file, file.name);

      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }
      const data = await res.json();
      setReport(data);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) upload(f);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Hero onPick={openPicker} />
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          {loading && <div>Processing...</div>}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        {error && <div className="text-red-600">Error: {error}</div>}

        {report && (
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Report</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}
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
