import { Brain, DollarSign, TrendingUp, FileText, Shield } from 'lucide-react';

const scrollToForm = () => {
  const formSection = document.getElementById('early-access');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Anomaly Detection',
      description: 'Finds unusual patterns, duplicate tests, inflated costs, and billing irregularities that humans might miss.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: DollarSign,
      title: 'Government Price Comparison',
      description: 'Cross-checks medicines, devices, and procedures with NPPA & PM-JAY rates to ensure fair pricing.',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: TrendingUp,
      title: 'Smart ML Insights',
      description: 'Detects abnormal patterns using Isolation Forest & cost modeling for comprehensive analysis.',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: FileText,
      title: 'Transparent Bill Audit Report',
      description: 'Highlights overcharges and provides legal references with detailed, easy-to-understand explanations.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Privacy & Security Assured',
      description: 'Healthcare-grade security measures protect your sensitive medical and billing information.',
      gradient: 'from-blue-600 to-blue-500',
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Powerful Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Advanced AI technology working for you to ensure fair and transparent billing
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

          <div className="group bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-white md:col-span-2 lg:col-span-1">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl sm:text-3xl">✓</span>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              Ready to Get Started?
            </h3>

            <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base">
              Join thousands of patients who are taking control of their medical bills.
            </p>

            <button onClick={scrollToForm} className="w-full bg-white text-blue-600 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base">
              Upload Your Bill Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
