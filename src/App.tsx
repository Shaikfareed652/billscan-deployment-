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

        {report && (
          <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Report</h3>
            <div className="overflow-x-auto">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm max-h-96 overflow-y-auto">
                {JSON.stringify(report, null, 2)}
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
