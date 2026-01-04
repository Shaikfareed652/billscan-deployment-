import { AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

const FORM_LINK = 'https://forms.gle/AYbpwsveR4cBVSqU7';

export default function Demo() {
  const billItems = [
    { name: 'Room Charges (2 days)', original: 8000, verified: 6000, status: 'overcharged' },
    { name: 'MRI Scan', original: 15000, verified: 15000, status: 'verified' },
    { name: 'Blood Test (CBC)', original: 1200, verified: 800, status: 'overcharged' },
    { name: 'Consultation Fee', original: 2000, verified: 2000, status: 'verified' },
    { name: 'Medicines', original: 5800, verified: 4200, status: 'overcharged' },
  ];

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            See BillScan in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time analysis with clear, actionable insights
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Bill Audit Report</h3>
                  <p className="text-blue-100">Hospital Bill #INV-2024-7845</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">₹8,000</div>
                  <div className="text-blue-100">Potential Savings</div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Total Bill</span>
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">₹32,000</div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Fair Price</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">₹24,000</div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Anomaly Score</span>
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">7.2/10</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h4>

                <div className="space-y-3">
                  {billItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {item.status === 'overcharged' ? (
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        )}
                        <span className="text-white font-medium">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`${item.status === 'overcharged' ? 'text-red-400 line-through' : 'text-gray-400'} text-sm`}>
                            ₹{item.original.toLocaleString()}
                          </div>
                          <div className="text-white font-semibold">
                            ₹{item.verified.toLocaleString()}
                          </div>
                        </div>

                        {item.status === 'overcharged' && (
                          <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                            -₹{(item.original - item.verified).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Recommended Action</span>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Download Full Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => (window.location.href = FORM_LINK)} className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Try It With Your Bill
          </button>
        </div>
      </div>
    </section>
  );
}
