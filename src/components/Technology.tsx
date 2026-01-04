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
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technology Behind BillScan
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <tech.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{tech.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
              </div>
            ))}

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 border border-blue-500 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold mb-2">Continuous Improvement</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Our AI models are constantly learning and improving from every bill analyzed.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-center">Processing Architecture</h3>

            <div className="grid md:grid-cols-5 gap-4 items-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-sm font-medium">Bill Upload</div>
              </div>

              <div className="hidden md:block text-center text-3xl text-gray-600"></div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="text-sm font-medium">OCR + NLP</div>
              </div>

              <div className="hidden md:block text-center text-3xl text-gray-600"></div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-teal-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="text-sm font-medium">ML Analysis</div>
              </div>

              <div className="hidden md:block text-center text-3xl text-gray-600 md:col-span-5 my-2">↓</div>

              <div className="text-center md:col-start-2">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="text-sm font-medium">Data Matching</div>
              </div>

              <div className="hidden md:block text-center text-3xl text-gray-600">→</div>

              <div className="text-center md:col-start-4">
                <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-sm font-medium">Report Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
