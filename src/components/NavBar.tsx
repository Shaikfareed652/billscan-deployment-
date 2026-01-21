import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
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
            <ul className="flex items-center gap-4 lg:gap-6 text-gray-700 text-xs sm:text-sm lg:text-base">
              <li><a href="#home" className="hover:text-blue-600">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-600">How It Works</a></li>
              <li><a href="#features" className="hover:text-blue-600">Features</a></li>
              <li><a href="#technology" className="hover:text-blue-600">Technology</a></li>
              <li><a href="#why" className="hover:text-blue-600">Why It Matters</a></li>
              <li><a href="#testimonials" className="hover:text-blue-600">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-blue-600">FAQ</a></li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
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
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <ul className="flex flex-col px-4 py-4 space-y-2 sm:space-y-3 text-gray-700 text-sm">
            <li><a onClick={() => setOpen(false)} href="#home">Home</a></li>
            <li><a onClick={() => setOpen(false)} href="#how-it-works">How It Works</a></li>
            <li><a onClick={() => setOpen(false)} href="#features">Features</a></li>
            <li><a onClick={() => setOpen(false)} href="#technology">Technology</a></li>
            <li><a onClick={() => setOpen(false)} href="#why">Why It Matters</a></li>
            <li><a onClick={() => setOpen(false)} href="#testimonials">Testimonials</a></li>
            <li><a onClick={() => setOpen(false)} href="#faq">FAQ</a></li>
          </ul>
        </div>
      )}
    </header>
  );
}
