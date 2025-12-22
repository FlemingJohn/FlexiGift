
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NavigationPill } from './components/NavigationPill';
import { ServicesSection } from './components/ServicesSection';
import { AssetAtlasSection } from './components/AssetAtlasSection';
import { SolutionsSection } from './components/SolutionsSection';
import { Footer } from './components/Footer';
import { ContactSection } from './components/ContactSection';
import { ParticlesBackground } from './components/ParticlesBackground';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY < windowHeight * 0.8) setActiveSection('home');
      else if (scrollY < windowHeight * 1.8) setActiveSection('services');
      else if (scrollY < windowHeight * 2.8) setActiveSection('product');
      else setActiveSection('about');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-green-500/30 selection:text-green-400">
      {/* Dynamic Background - Always Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticlesBackground />
      </div>

      <Navbar />

      <main className="relative z-10">
        <section id="home">
          <Hero />
        </section>

        <section id="services">
          <ServicesSection />
        </section>

        <section id="product">
          <AssetAtlasSection />
        </section>

        <section id="solutions">
          <SolutionsSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>

        <Footer />
      </main>

      {/* Persistent Navigation */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <NavigationPill activeSection={activeSection} />
      </div>

      {/* Atmospheric overlays */}
      <div className="fixed inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
};

export default App;
