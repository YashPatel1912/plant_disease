import { ArrowRight, Leaf, Microscope, ScanLine, ShieldCheck } from 'lucide-react';
import './Hero.css';

const HERO_IMAGE_URL =
  'https://images.pexels.com/photos/2257524/pexels-photo-2257524.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const HIGHLIGHTS = [
  { icon: ScanLine, label: 'Instant leaf analysis' },
  { icon: Microscope, label: 'Deep learning CNN model' },
  { icon: ShieldCheck, label: 'Healthy or diseased status' },
];

export default function Hero({ onDetect, onLearnMore }) {
  return (
    <section className="hero">
      <img className="hero__image" src={HERO_IMAGE_URL} alt="" aria-hidden="true" />
      <div className="hero__overlay" />

      <div className="container hero__content">
        <span className="hero__eyebrow">
          <Leaf size={16} />
          Smart crop health monitoring
        </span>

        <h1 className="hero__title">AI-Powered Plant Disease Detection</h1>

        <p className="hero__description">
          Upload a photo of a leaf and our trained convolutional neural network checks it for disease. Get a
          clear prediction, a confidence score, and a healthy or diseased status in seconds.
        </p>

        <div className="hero__actions">
          <button type="button" className="btn btn-primary hero__btn" onClick={onDetect}>
            Detect Plant Disease
            <ArrowRight size={18} />
          </button>
          <button type="button" className="btn btn-secondary hero__btn" onClick={onLearnMore}>
            Learn More
          </button>
        </div>

        <ul className="hero__highlights">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li key={label} className="hero__highlight">
              <Icon size={18} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
