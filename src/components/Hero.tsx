import { Upload, Play } from 'lucide-react';

const FORM_LINK = 'https://forms.gle/AYbpwsveR4cBVSqU7';

export default function Hero({ onPick }: { onPick?: () => void }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium animate-fade-in">
            AI-Powered Healthcare Bill Auditing
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
            BillScan – Smarter, Fairer Hospital Billing
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed animate-slide-up-delay">
            AI that detects overcharges, unusual billing patterns, and hidden anomalies instantly.
            Upload your bill. Get clarity. Save money.
          </p>

          <div className="flex flex-row gap-4 justify-center items-center animate-slide-up-delay-2">
            <button
              onClick={() => (window.location.href = FORM_LINK)}
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              Upload Bill
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>

            <button
              onClick={() => (window.location.href = FORM_LINK)}
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Try Demo
            </button>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-gray-600 text-sm">Accuracy Rate</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2">₹5L+</div>
                  <div className="text-gray-600 text-sm">Saved for Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600 text-sm">Bills Analyzed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
