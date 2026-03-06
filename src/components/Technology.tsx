import { Cpu, Eye, Network, Database, Cloud } from 'lucide-react';

export default function Technology() {
  const technologies = [
    {
      icon: Eye,
      title: 'OCR Pipeline',
      description: 'Advanced optical character recognition extracts text from any bill format with 99% accuracy.',
    },
    {
      icon: Cpu,
      title: 'NLP Parsing & Item Mapping',
      description: 'Natural language processing intelligently categorizes and maps billing items to standard codes.',
    },
    {
      icon: Network,
      title: 'Machine Learning Models',
      description: 'Isolation Forest and LOF algorithms detect statistical anomalies and unusual pricing patterns.',
    },
    {
      icon: Database,
      title: 'Government Data Integration',
      description: 'Real-time integration with NPPA, PM-JAY, and other regulatory price databases.',
    },
    {
      icon: Cloud,
      title: 'Secure Cloud Deployment',
      description: 'Healthcare-compliant infrastructure with end-to-end encryption and data protection.',
    },
  ];

  return (
    <section
      id="technology"
      className="py-12 sm:py-20 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500 rounded-full blur-3xl hidden sm:block"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        <div className="text-center mb-12 sm:mb-16">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Technology Behind BillScan
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto px-2">
            Cutting-edge AI and machine learning powering intelligent bill analysis
          </p>

        </div>

        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center mb-4">
                  <tech.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold mb-2 text-white">
                  {tech.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {tech.description}
                </p>

              </div>
            ))}

            <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl p-6 border border-purple-500 hover:scale-105 transition-transform duration-300">

              <div className="text-4xl mb-4">🔬</div>

              <h3 className="text-lg font-semibold mb-2 text-white">
                Continuous Improvement
              </h3>

              <p className="text-purple-100 text-sm leading-relaxed">
                Our AI models are constantly learning and improving from every bill analyzed.
              </p>

            </div>

          </div>

            </div>

          </div>

        
    </section>
  );
}