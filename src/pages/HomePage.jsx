import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';

export default function HomePage({ onNavigate }) {
  return (
    <>
      <Hero onDetect={() => onNavigate('detect')} onLearnMore={() => onNavigate('features')} />
      <Features />
    </>
  );
}
