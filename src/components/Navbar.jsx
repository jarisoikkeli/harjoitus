// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">React-harjoituksia</Link>

        {/* Desktop-nav */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:underline">Info</Link>
          <Link to="/tokasivu" className="hover:underline">Tokasivu</Link>
          <Link to="/takasivu" className="hover:underline">Takasivu</Link>
          <Link to="/kelikamera" className="hover:underline">Kelikamera</Link>
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label="Valikko"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="block hover:underline">Info</Link>
          <Link to="/tokasivu" onClick={() => setIsOpen(false)} className="block hover:underline">Tokasivu</Link>
          <Link to="/takasivu" onClick={() => setIsOpen(false)} className="block hover:underline">Takasivu</Link>
          <Link to="/kelikamera" onClick={() => setIsOpen(false)} className="block hover:underline">Kelikamera</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
