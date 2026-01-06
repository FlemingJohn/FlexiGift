import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CreatePage } from './pages/CreatePage';
import { RedeemPage } from './pages/RedeemPage';
import { GalleryPage } from './pages/GalleryPage';
import { MarketplacePage } from './pages/MarketplacePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/redeem/:giftCardId" element={<RedeemPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
      </Routes>
    </BrowserRouter>
  );
};
