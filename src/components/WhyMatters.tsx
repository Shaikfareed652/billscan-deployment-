import { Shield, Users, Eye, Scale, Wallet } from 'lucide-react';

export default function WhyMatters() {
  const reasons = [
    {
      icon: Shield,
      title: 'Prevents Unfair Medical Billing',
      description: 'Protects patients from predatory pricing and billing errors that cost thousands.',
    },
    {
      icon: Users,
      title: 'Empowers Patients with Data',
      description: 'Access to clear, understandable information to make informed healthcare decisions.',
    },
    {
      icon: Eye,
      title: 'Ensures Transparency',
      description: 'Brings accountability to healthcare billing with detailed audit trails.',
    },
    {
      icon: Scale,
      title: 'Supports Legal Compliance',
      description: 'References government regulations and pricing guidelines for every item.',
    },
    {
      icon: Wallet,
      title: 'Saves Money Instantly',
      description: 'Identifies overcharges and provides evidence to negotiate fair billing.',
    },
  ];

  return (
    <section id="why" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why BillScan Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Making healthcare billing fair, transparent, and accountable for everyone
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-102 border border-blue-100"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <reason.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-10 text-white shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">25%</div>
              <div className="text-blue-100">Average overcharge detected</div>
            </div>
            <div className="border-x border-blue-400">
              <div className="text-5xl font-bold mb-2">₹8,200</div>
              <div className="text-blue-100">Average savings per bill</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Patients empowered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
