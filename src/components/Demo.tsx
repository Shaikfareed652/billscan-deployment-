import { AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

const scrollToForm = () => {
  const formSection = document.getElementById('early-access');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Demo() {
  const billItems = [
    { name: 'Room Charges (2 days)', original: 8000, verified: 6000, status: 'overcharged' },
    { name: 'MRI Scan', original: 15000, verified: 15000, status: 'verified' },
    { name: 'Blood Test (CBC)', original: 1200, verified: 800, status: 'overcharged' },
    { name: 'Consultation Fee', original: 2000, verified: 2000, status: 'verified' },
    { name: 'Medicines', original: 5800, verified: 4200, status: 'overcharged' },
  ];

  return (
    <section id="demo" className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            See BillScan in Action
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto px-2">
            Real-time analysis with clear, actionable insights
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">
                    Bill Audit Report
                  </h3>

                  <p className="text-purple-100 text-xs sm:text-sm">
                    Hospital Bill #INV-2024-7845
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    ₹8,000
                  </div>
                  <div className="text-purple-100 text-xs sm:text-sm">
                    Potential Savings
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Total Bill
                    </span>
                    <TrendingDown className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    ₹32,000
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Fair Price
                    </span>
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    ₹24,000
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-xs sm:text-sm">
                      Anomaly Score
                    </span>
                    <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    7.2/10
                  </div>
                </div>

              </div>

              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">

                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                  Detailed Breakdown
                </h4>

                <div className="space-y-2 sm:space-y-3 overflow-x-auto">
                  {billItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-xs sm:text-sm md:text-base"
                    >

                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">

                        {item.status === 'overcharged' ? (
                          <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-red-400 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 flex-shrink-0" />
                        )}

                        <span className="text-white font-medium truncate">
                          {item.name}
                        </span>

                      </div>

                      <div className="flex items-center gap-2 sm:gap-6 ml-6 sm:ml-0">

                        <div className="text-right min-w-[80px] sm:min-w-auto">

                          <div
                            className={`${
                              item.status === 'overcharged'
                                ? 'text-red-400 line-through'
                                : 'text-gray-300'
                            } text-xs sm:text-sm`}
                          >
                            ₹{item.original.toLocaleString()}
                          </div>

                          <div className="text-white font-semibold text-xs sm:text-sm">
                            ₹{item.verified.toLocaleString()}
                          </div>

                        </div>

                        {item.status === 'overcharged' && (
                          <div className="bg-red-500/20 text-red-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap">
                            -₹{(item.original - item.verified).toLocaleString()}
                          </div>
                        )}

                      </div>

                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                  <span className="text-gray-300 font-medium text-xs sm:text-sm">
                    Recommended Action
                  </span>

                  <button className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm hover:bg-purple-700 transition-colors whitespace-nowrap">
                    Download Full Report
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center px-4">
          
        </div>

      </div>
    </section>
  );
}