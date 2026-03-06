import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: 'rgba(252, 251, 254, 0.95)',
        borderTop: '1px solid rgba(139,92,246,0.2)',
      }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-4 mb-6">
              <a href="#home" className="flex-shrink-0">
                <img
                  src="/IMG_20251231_144047__1_-removebg-preview.png"
                  alt="BillScan Logo"
                  className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform hover:scale-110 duration-300"
                />
              </a>
            </div>
            <p className="leading-relaxed mb-6" style={{ color: '#1c1b1f' }}>
              AI-powered hospital bill auditing for fair, transparent healthcare billing.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(9, 9, 11, 0.2)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#181719',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-black">Product</h3>
            <ul className="space-y-3">
              {['How It Works', 'Features', 'Pricing', 'Demo'].map(item => (
                <li key={item}>
                  <a href="#" className="transition-colors duration-200 hover:text-white" style={{ color: '#232227' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-black">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#contact" className="transition-colors duration-200 hover:text-white" style={{ color: '#45444a' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-black">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2a282f' }} />
                <a href="mailto:info@billscanai.tech" className="hover:text-white transition-colors" style={{ color: '#1e1d22' }}>
                  info@billscanai.tech
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2c2a30' }} />
                <a href="tel:+919701864124" className="hover:text-white transition-colors" style={{ color: '#1a191d' }}>
                  +919701864124
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#302f34' }} />
                <span style={{ color: '#1c1b20' }}>Hyderabad, Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(139,92,246,0.2)' }} className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: '#1a1720' }}>
              © 2024 BillScan. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                  style={{ color: '#2a282d' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}