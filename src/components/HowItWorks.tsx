import { Upload, ScanLine, Brain, FileCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Bill Image',
      description: 'Simply upload your hospital bill in any format - photo, PDF, or scan',
      color: 'bg-blue-500',
    },
    {
      icon: ScanLine,
      title: 'AI Reads Bill Using OCR',
      description: 'Advanced OCR technology extracts every line item, charge, and detail',
      color: 'bg-cyan-500',
    },
    {
      icon: Brain,
      title: 'ML Detects Anomalies',
      description: 'Machine learning identifies overcharges, duplicates, and unusual patterns',
      color: 'bg-teal-500',
    },
    {
      icon: FileCheck,
      title: 'Instant Report Generated',
      description: 'Get a comprehensive audit report with clear explanations and savings',
      color: 'bg-green-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            From upload to insights in seconds – our AI does the heavy lifting
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 relative">
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-green-200"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`${step.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 relative z-10`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="absolute top-8 -left-4 text-8xl font-bold text-gray-100 -z-10">
                    {index + 1}
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Average processing time: 5 seconds
          </div>
        </div>
      </div>
    </section>
  );
}
