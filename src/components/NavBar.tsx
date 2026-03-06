import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="w-full sticky top-0 z-40"
      style={{
        background: 'rgb(255, 255, 255)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(11, 11, 11, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">

          {/* Logo */}
          <a href="#home" className="flex items-center flex-shrink-0">
            <img
              src="/IMG_20251231_144047__1_-removebg-preview.png"
              alt="BillScan Logo"
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain max-w-sm transition-transform hover:scale-110 duration-300"
            />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-4 lg:gap-6 text-xs sm:text-sm lg:text-base">
              {[
                ['#home','Home'],
                ['#how-it-works','How It Works'],
                ['#features','Features'],
                ['#why','Why It Matters'],
                ['#faq','FAQ'],
                ['#contact','Contact']
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="transition-colors duration-200 hover:text-purple-300"
                    style={{ color: '#161518' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2"
            style={{ color: '#c4b5fd' }}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(10,0,20,0.95)',
            borderTop: '1px solid rgba(139,92,246,0.2)',
          }}
        >
          <ul className="flex flex-col px-4 py-4 space-y-3 text-sm" style={{ color: '#c4b5fd' }}>
            {[
              ['#home', 'Home'],
              ['#how-it-works', 'How It Works'],
              ['#features', 'Features'],
              ['#why', 'Why It Matters'],
              ['#faq', 'FAQ'],
              ['#contact', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  onClick={() => setOpen(false)}
                  href={href}
                  className="hover:text-purple-300 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}