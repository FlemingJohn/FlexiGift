import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CreatePage } from './pages/CreatePage';
import { RedeemPage } from './pages/RedeemPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/redeem/:giftCardId" element={<RedeemPage />} />
      </Routes>
    </BrowserRouter>
  );
};
