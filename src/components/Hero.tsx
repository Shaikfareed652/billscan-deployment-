import { Upload, Play } from 'lucide-react';

const scrollToForm = () => {
  const formSection = document.getElementById('early-access');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Hero({ onPick }: { onPick?: () => void }) {
  const handlePick = () => {
    if (onPick) {
      onPick();
    }
  };
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium animate-fade-in">
            AI-Powered Healthcare Bill Auditing
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-slide-up">
            BillScan – Smarter, Fairer Hospital Billing
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed animate-slide-up-delay">
            AI that detects overcharges, unusual billing patterns, and hidden anomalies instantly.
            Upload your bill. Get clarity. Save money.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up-delay-2 w-full px-4 sm:px-0">
            <button
              onClick={scrollToForm}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Upload className="w-4 sm:w-5 h-4 sm:h-5" />
              Upload Bill
            </button>

            <button
              onClick={scrollToForm}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Play className="w-4 sm:w-5 h-4 sm:h-5" />
              Try Demo
            </button>
          </div>

          <div className="mt-10 sm:mt-16 relative px-4 sm:px-0">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200">
              <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">98%</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Accuracy Rate</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">₹5L+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Saved for Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">10K+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Bills Analyzed</div>
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
