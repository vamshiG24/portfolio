// Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full text-white z-50 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-amber-500">My Portfolio</h1>
        <ul className="flex space-x-6">
          <li><a href="#home" className="hover:text-amber-400">Home</a></li>
          <li><a href="#timeline" className="hover:text-amber-400">Timeline</a></li>
          <li><a href="#projects" className="hover:text-amber-400">Projects</a></li>
          <li><a href="#buildlogs" className="hover:text-amber-400">Build Logs</a></li>
          <li><a href="#mindset" className="hover:text-amber-400">Mindset</a></li>
          <li><a href="#contact" className="hover:text-amber-400">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;