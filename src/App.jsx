import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Info from './pages/Info';
import Tokasivu from './pages/Tokasivu';
import Takasivu from './pages/Takasivu';
import Kelikamera from './pages/Kelikamera';


function App() {
  return (
    <Router>
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Info />} />
          <Route path="/tokasivu" element={<Tokasivu />} />
          <Route path="/takasivu" element={<Takasivu />} />
          <Route path="/kelikamera" element={<Kelikamera />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
