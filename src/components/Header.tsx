import { useState, useEffect } from 'react';
import { Menu, X, Heart, Smartphone, ShieldCheck, DownloadCloud } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onDownloadProjectZIP: () => void;
}

export default function Header({ currentTab, onTabChange, onDownloadProjectZIP }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'matches', label: 'Find Matches' },
    { id: 'register', label: 'Create Biodata' },
    { id: 'stories', label: 'Success Stories' },
    { id: 'pricing', label: 'Premium Plans' },
    { id: 'cpanel', label: 'cPanel Host Guide' }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`w-full tracking-tight transition-all duration-300 sticky top-0 z-50 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-rose-100 py-3' 
        : 'bg-white border-b border-rose-50 py-4.5'
    }`} id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo / Brand Name representing Shaddi Matrimonials */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onTabChange('matches'); }}
            className="flex items-center space-x-2.5 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight leading-none block text-rose-950">
                TRUSOF SHAADI
              </span>
              <span className="text-[10px] text-rose-600 font-sans tracking-widest uppercase font-extrabold block mt-1">
                Matrimonial Portal
              </span>
            </div>
          </a>

          {/* Desktop Navigation Link Groups */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-rose-50 text-rose-700 shadow-sm'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Download Code action mimicking cPanel readiness */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center bg-rose-50/50 px-3 py-1.5 rounded-full border border-rose-100">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
              <span>cPanel Ready Web App</span>
            </span>
            <button
              onClick={onDownloadProjectZIP}
              className="px-4 py-2 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center space-x-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Get Site Code</span>
            </button>
          </div>

          {/* Mobile Menu Button toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onDownloadProjectZIP}
              className="py-1.5 px-3 rounded-lg text-xs font-black bg-rose-600 text-white"
            >
              Get Code
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl transition-colors hover:bg-rose-50 text-gray-700 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full shadow-xl bg-white border-b border-rose-100 animate-fadeIn" id="mobile-menu-drawer">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`block w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  currentTab === item.id
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-gray-700 hover:bg-rose-50/40'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 px-4 border-t border-rose-50 flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-semibold uppercase">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>Secure Matrimonial Standards</span>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); onDownloadProjectZIP(); }}
                className="w-full text-center py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center space-x-1"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download cPanel Code (.ZIP)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
