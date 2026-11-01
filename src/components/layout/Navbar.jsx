import { useEffect, useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', target: 'home', page: 'home' },
  { label: 'How It Works', target: 'features', page: 'home' },
  { label: 'Detect Disease', target: 'detect', page: 'detect' },
];

export default function Navbar({ currentPage, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (item) => {
    setIsMenuOpen(false);
    onNavigate(item.target);
  };

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <button type="button" className="navbar__brand" onClick={() => handleNavigate(NAV_ITEMS[0])}>
          <span className="navbar__logo">
            <Leaf size={20} strokeWidth={2.4} />
          </span>
          <span className="navbar__name">PlantGuard AI</span>
        </button>

        <nav className={`navbar__links ${isMenuOpen ? 'navbar__links--open' : ''}`} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.page === 'detect' ? currentPage === 'detect' : currentPage === 'home' && item.target === 'home';
            return (
              <button
                key={item.label}
                type="button"
                className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={() => handleNavigate(item)}
              >
                {item.label}
              </button>
            );
          })}
          <button type="button" className="btn btn-primary navbar__cta" onClick={() => handleNavigate(NAV_ITEMS[2])}>
            Start Scanning
          </button>
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
