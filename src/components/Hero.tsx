import { Upload, Play } from 'lucide-react';
import ShaderBackground from './ui/shader-background';

const scrollToForm = () => {
  const formSection = document.getElementById('early-access');
  if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero({ onPick }: { onPick?: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Shader Background */}
      <ShaderBackground />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(56, 54, 54, 0.25)' }} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center px-4">

          {/* Badge */}
          <div
            className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium animate-fade-in"
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              color: '#E9D5FF',
            }}
          >
            ✨ AI-Powered Healthcare Bill Auditing
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-slide-up"
            style={{
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(139,92,246,0.6)',
            }}
          >
            BillScan –{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Smarter, Fairer
            </span>{' '}
            Hospital Billing
          </h1>

          {/* Subheading */}
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 leading-relaxed animate-slide-up-delay"
            style={{ color: '#E9D5FF' }}
          >
            AI that detects overcharges, unusual billing patterns, and hidden anomalies instantly.
            Upload your bill. Get clarity. Save money.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up-delay-2 w-full px-4 sm:px-0">
            <button
              onClick={onPick ?? scrollToForm}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#FFFFFF',
                boxShadow: '0 0 30px rgba(139,92,246,0.5)',
              }}
            >
              <Upload className="w-4 sm:w-5 h-4 sm:h-5" />
              Upload Bill
            </button>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-20"
        style={{ background: 'linear-gradient(to top, #1a0a2e, transparent)' }}
      />
    </section>
  );
}