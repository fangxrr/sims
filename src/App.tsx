import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Worlds } from './pages/Worlds';
import { WorldDetail } from './pages/WorldDetail';
import { Families } from './pages/Families';
import { FamilyDetail } from './pages/FamilyDetail';
import { SimsOverview } from './pages/SimsOverview';
import { LotsOverview } from './pages/LotsOverview';
import { LotDetail } from './pages/LotDetail';
import { SimDetail } from './pages/SimDetail';
import { Creators } from './pages/Creators';
import { CCTracker } from './pages/Tracker';
import { Finders } from './pages/Finders';
import { Gallery } from './pages/Gallery';
import { Notes } from './pages/Notes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="worlds" element={<Worlds />} />
          <Route path="worlds/:id" element={<WorldDetail />} />
          <Route path="families" element={<Families />} />
          <Route path="families/:id" element={<FamilyDetail />} />
          <Route path="sims" element={<SimsOverview />} />
          <Route path="sims/:id" element={<SimDetail />} />
          <Route path="lots" element={<LotsOverview />} />
          <Route path="lots/:id" element={<LotDetail />} />
          <Route path="creators" element={<Creators />} />
          <Route path="tracker" element={<CCTracker />} />
          <Route path="finders" element={<Finders />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
