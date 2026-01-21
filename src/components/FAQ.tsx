import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use healthcare-grade encryption and comply with all data protection regulations. Your bills are processed securely and deleted after analysis. We never share your information with third parties.',
    },
    {
      question: 'How accurate is the AI?',
      answer: 'Our AI has a 98% accuracy rate in detecting billing anomalies. It cross-references millions of data points from government databases, medical pricing standards, and historical billing patterns to ensure reliable results.',
    },
    {
      question: 'What types of bills are supported?',
      answer: 'BillScan supports all types of hospital and medical bills including inpatient, outpatient, surgery, diagnostic tests, pharmacy, and emergency care bills. We accept images, PDFs, and scanned documents.',
    },
    {
      question: 'Does BillScan work with all hospitals?',
      answer: 'Yes! BillScan works with bills from any hospital, clinic, or healthcare facility in India. Our AI is trained on diverse billing formats and can process bills from any provider.',
    },
    {
      question: 'How long does the analysis take?',
      answer: 'Most bills are analyzed within 5-10 seconds. Complex bills with many line items may take up to 30 seconds. You\'ll receive an instant notification when your report is ready.',
    },
    {
      question: 'What if I find overcharges?',
      answer: 'Our detailed report includes specific line items with overcharges, government reference prices, and legal citations. You can use this documentation to negotiate with your hospital or file a complaint with relevant authorities.',
    },
  ];

  return (
    <section id="faq" className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Everything you need to know about BillScan
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 pr-4 sm:pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 sm:w-5 h-4 sm:h-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-4 sm:p-6 pt-0 text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
