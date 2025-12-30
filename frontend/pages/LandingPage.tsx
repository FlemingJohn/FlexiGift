import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { ProductDemo } from '../components/ProductDemo';
import { AssetAtlasSection } from '../components/AssetAtlasSection';
import { SolutionsSection } from '../components/SolutionsSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { ParticlesBackground } from '../components/ParticlesBackground';

export const LandingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-green-500/30 selection:text-green-400">
            {/* Dynamic Background - Always Fixed */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticlesBackground />
            </div>

            <Navbar />

            <main className="relative z-10">
                <Hero />
                <ServicesSection />
                <ProductDemo />
                <AssetAtlasSection />
                <SolutionsSection />
                <ContactSection />
            </main>

            <Footer />
        </div>
    );
};
