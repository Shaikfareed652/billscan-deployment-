import React from 'react';

export default function NavBar() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-10">
        <img src="/IMG_20251231_144047.png" alt="BillScan" className="w-56 h-auto object-contain" />
        </a>

        <nav>
          <ul className="flex items-center gap-6 text-gray-700">
            <li><a href="#home" className="hover:text-blue-600">Home</a>               |</li>
            <li><a href="#how-it-works" className="hover:text-blue-600">How It Works</a></li>
            <li><a href="#features" className="hover:text-blue-600">Features</a></li>
            <li><a href="#demo" className="hover:text-blue-600">Demo</a></li>
            <li><a href="#technology" className="hover:text-blue-600">Technology</a></li>
            <li><a href="#why" className="hover:text-blue-600">Why It Matters</a></li>
            <li><a href="#testimonials" className="hover:text-blue-600">Testimonials</a></li>
            <li><a href="#faq" className="hover:text-blue-600">FAQ</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
