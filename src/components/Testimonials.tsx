import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer, Mumbai',
      content: 'BillScan saved me ₹12,000 on my surgery bill. The AI detected duplicate charges I would have never noticed. Absolutely incredible!',
      rating: 5,
      image: '👩‍💼',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner, Bangalore',
      content: 'After my father\'s treatment, we were shocked by the bill. BillScan analyzed it in seconds and found multiple overcharges. We got a refund within a week.',
      rating: 5,
      image: '👨‍💼',
    },
    {
      name: 'Anita Desai',
      role: 'Teacher, Delhi',
      content: 'The transparency BillScan provides is invaluable. Now I understand exactly what I\'m paying for. Every patient should use this service.',
      rating: 5,
      image: '👩‍🏫',
    },
  ];

  return (
    <section id="testimonials" className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Real stories from patients who took control of their medical bills
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full px-6 py-3 shadow-md">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-green-500 border-2 border-white"></div>
            </div>
            <span className="text-gray-700 font-medium">
              Join 10,000+ satisfied users
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}