import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Demo from './components/Demo';
import Technology from './components/Technology';
import WhyMatters from './components/WhyMatters';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <Features />
      <Demo />
      <Technology />
      <WhyMatters />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
