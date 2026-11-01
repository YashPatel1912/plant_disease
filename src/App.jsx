import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import DetectionPage from '@/pages/DetectionPage';

export default function App() {
  const [page, setPage] = useState('home');

  const navigate = (target) => {
    if (target === 'detect') {
      setPage('detect');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    setPage('home');
    requestAnimationFrame(() => {
      const element = target === 'home' ? document.body : document.getElementById(target);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="app">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main>
        {page === 'home' ? (
          <HomePage onNavigate={navigate} />
        ) : (
          <DetectionPage />
        )}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
