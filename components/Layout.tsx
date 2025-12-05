import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { Logo } from './Logo';
import { MontessoriBot } from './MontessoriBot';
import { Menu, X, Instagram, Facebook, Mail, ArrowRight, Lock, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const currentPath = location.pathname;

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-brand-darkest bg-brand-cream selection:bg-brand-clay selection:text-white flex flex-col">
      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isHome ? 'bg-transparent border-white/10' : 'bg-white shadow-md border-gray-100'} border-b backdrop-blur-md`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="cursor-pointer flex items-center gap-2 group"
            onClick={handleMobileMenuClose}
          >
            {/* Dynamic Back Arrow for Mobile */}
            {!isHome && <ArrowLeft size={20} className={`md:hidden ${isHome ? 'text-white' : 'text-brand-darkest'}`} />}

            {/* The New Logo */}
            <Logo
              variant={isHome ? 'light' : 'color'}
              className="w-10 h-10 md:w-12 md:h-12"
              classNameText="hidden md:flex"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-bold tracking-widest uppercase transition-colors relative group ${
                  isHome ? 'text-white hover:text-brand-clay' :
                  currentPath === link.path ? 'text-brand-clay' : 'text-brand-darkest hover:text-brand-clay'
                }`}
              >
                {link.label}
                {/* Underline effect */}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-clay transition-all duration-300 group-hover:w-full ${currentPath === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
            <Link
              to="/educators"
              className={`text-sm font-bold tracking-widest uppercase transition-colors relative group ${
                currentPath === '/educators' ? 'text-brand-clay' :
                isHome ? 'text-white hover:text-brand-clay' : 'text-brand-darkest hover:text-brand-clay'
              }`}
            >
              Educators
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-clay transition-all duration-300 group-hover:w-full ${currentPath === '/educators' ? 'w-full' : ''}`}></span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden z-50 ${isHome && !mobileMenuOpen ? 'text-white' : 'text-brand-darkest'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-brand-cream text-brand-darkest flex flex-col items-center justify-center space-y-8 z-40 animate-fade-in">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.path}
                onClick={handleMobileMenuClose}
                className="text-3xl font-serif hover:text-brand-clay transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/educators"
              onClick={handleMobileMenuClose}
              className="text-3xl font-serif hover:text-brand-clay transition-colors"
            >
              Educators
            </Link>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-brand-darkest text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Logo variant="light" className="w-16 h-16 mb-4" />
              <p className="text-white/60 max-w-sm">
                Empowering parents to raise independent, confident children through the Montessori method.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold mb-6 text-brand-clay">Quick Links</h4>
              <ul className="space-y-4 text-white/70">
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <Link to={link.path} className="hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/educators" className="hover:text-white transition-colors">Educators</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold mb-6 text-brand-clay">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white/5 border-none rounded-l-md px-4 py-2 w-full focus:ring-1 focus:ring-brand-clay text-sm"
                />
                <button className="bg-brand-clay px-4 rounded-r-md hover:bg-brand-wine transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm">
            <p>&copy; 2024 Montessori Milestones.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link
                to="/admin"
                className="flex items-center gap-1 hover:text-brand-clay transition-colors opacity-50 hover:opacity-100"
                title="Admin Access"
              >
                <Lock size={12} /> Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- AI BOT (show on non-home pages) --- */}
      {!isHome && <MontessoriBot variant="floating" />}
    </div>
  );
};
